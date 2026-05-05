/**
 * Monobank Acquiring SDK wrapper.
 * https://api.monobank.ua/docs/acquiring.html
 *
 * Apple Pay / Google Pay supported natively.
 *
 * Webhook signature: ECDSA-SHA256 with the merchant public key from
 * /api/merchant/pubkey. Header `X-Sign` is base64(signature).
 */

import crypto from 'node:crypto';

const MONO_BASE = 'https://api.monobank.ua';
const PUBKEY_URL = `${MONO_BASE}/api/merchant/pubkey`;

export interface CreatePaymentRequest {
  amount: number; // hryvnias
  orderRef: string;
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  validityMinutes?: number;
}

export interface CreatePaymentResponse {
  url: string;
  intentId: string;
}

export async function createMonoPayment(
  req: CreatePaymentRequest,
): Promise<CreatePaymentResponse> {
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) throw new Error('MONO_ACQUIRING_TOKEN is not set');

  const body = {
    amount: Math.round(req.amount * 100), // kopiykas
    ccy: 980, // UAH
    merchantPaymInfo: {
      reference: req.orderRef,
      destination: req.description,
    },
    redirectUrl: req.redirectUrl,
    webHookUrl: req.webhookUrl,
    validity: (req.validityMinutes ?? 60) * 60,
    paymentType: 'debit' as const,
  };

  const res = await fetch(`${MONO_BASE}/api/merchant/invoice/create`, {
    method: 'POST',
    headers: {
      'X-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Mono API ${res.status}: ${errorText}`);
  }
  const data = (await res.json()) as { invoiceId: string; pageUrl: string };
  return { url: data.pageUrl, intentId: data.invoiceId };
}

export async function getMonoPaymentStatus(invoiceId: string): Promise<{
  status: string;
  amount?: number;
  paidAt?: string;
}> {
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) throw new Error('MONO_ACQUIRING_TOKEN not set');

  const res = await fetch(
    `${MONO_BASE}/api/merchant/invoice/status?invoiceId=${invoiceId}`,
    { headers: { 'X-Token': token } },
  );
  if (!res.ok) throw new Error(`Mono status API ${res.status}`);
  const data = (await res.json()) as any;
  return {
    status: data.status,
    amount: data.amount ? data.amount / 100 : undefined,
    paidAt: data.modifiedDate,
  };
}

export async function cancelMonoPayment(invoiceId: string): Promise<void> {
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) throw new Error('MONO_ACQUIRING_TOKEN not set');
  await fetch(`${MONO_BASE}/api/merchant/invoice/cancel`, {
    method: 'POST',
    headers: { 'X-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoiceId }),
  }).catch(() => {});
}

/**
 * Cache the merchant pubkey for ~1h so we don't refetch on every webhook.
 * Mono allows pubkey rotation; on 401 we'll refetch eagerly.
 */
let cachedPubKeyPem: string | null = null;
let cachedPubKeyAt = 0;
const PUBKEY_TTL_MS = 60 * 60 * 1000;

async function loadMerchantPubkeyPem(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedPubKeyPem &&
    now - cachedPubKeyAt < PUBKEY_TTL_MS
  ) {
    return cachedPubKeyPem;
  }
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) throw new Error('MONO_ACQUIRING_TOKEN not set');
  const res = await fetch(PUBKEY_URL, { headers: { 'X-Token': token } });
  if (!res.ok) throw new Error(`Mono pubkey ${res.status}`);
  const data = (await res.json()) as { key: string };
  // `key` is base64-encoded PEM (with header/footer)
  const pem = Buffer.from(data.key, 'base64').toString('utf8');
  cachedPubKeyPem = pem;
  cachedPubKeyAt = now;
  return pem;
}

/**
 * Verify Mono webhook signature.
 * Header `X-Sign` is base64(ECDSA-SHA256(rawBody)) with the merchant pubkey.
 */
export async function verifyMonoWebhook(
  rawBody: string,
  signatureHeader: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  // Dev escape hatch — local testing without real Mono signature
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.MONO_VERIFY_SKIP === 'true'
  ) {
    return true;
  }

  let signatureBytes: Buffer;
  try {
    signatureBytes = Buffer.from(signatureHeader, 'base64');
  } catch {
    return false;
  }

  for (const force of [false, true]) {
    try {
      const pem = await loadMerchantPubkeyPem(force);
      const verifier = crypto.createVerify('SHA256');
      verifier.update(rawBody);
      verifier.end();
      const ok = verifier.verify(pem, signatureBytes);
      if (ok) return true;
      if (!force) continue; // try once more with refreshed key
    } catch (e) {
      if (force) {
        console.error('[mono verify] error:', e);
        return false;
      }
    }
  }
  return false;
}
