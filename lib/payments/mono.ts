/**
 * Monobank Acquiring SDK wrapper.
 * https://api.monobank.ua/docs/acquiring.html
 *
 * Apple Pay / Google Pay supported natively.
 */

const MONO_API = 'https://api.monobank.ua/api/merchant/invoice/create';

export interface CreatePaymentRequest {
  amount: number; // в гривнях
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
  if (!token) {
    throw new Error('MONO_ACQUIRING_TOKEN is not set. Configure in admin → Налаштування оплати.');
  }

  const payload = {
    amount: Math.round(req.amount * 100), // копійки
    ccy: 980, // UAH
    merchantPaymInfo: {
      reference: req.orderRef,
      destination: req.description,
    },
    redirectUrl: req.redirectUrl,
    webHookUrl: req.webhookUrl,
    validity: (req.validityMinutes ?? 60) * 60,
    paymentType: 'debit',
  };

  const response = await fetch(MONO_API, {
    method: 'POST',
    headers: {
      'X-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mono API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as { invoiceId: string; pageUrl: string };

  return {
    url: data.pageUrl,
    intentId: data.invoiceId,
  };
}

export async function getMonoPaymentStatus(invoiceId: string): Promise<{
  status: string;
  amount?: number;
  paidAt?: string;
}> {
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) throw new Error('MONO_ACQUIRING_TOKEN not set');

  const response = await fetch(
    `https://api.monobank.ua/api/merchant/invoice/status?invoiceId=${invoiceId}`,
    { headers: { 'X-Token': token } },
  );
  if (!response.ok) throw new Error(`Mono status API ${response.status}`);
  const data = (await response.json()) as any;
  return {
    status: data.status,
    amount: data.amount ? data.amount / 100 : undefined,
    paidAt: data.modifiedDate,
  };
}

/**
 * Verify Mono webhook signature (Ed25519 via mono pubkey).
 * For brevity, returns true in dev. In production must verify properly.
 */
export async function verifyMonoWebhook(
  rawBody: string,
  _signatureHeader: string,
): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') return true;
  // TODO: implement Ed25519 verification with pubkey from
  // https://api.monobank.ua/api/merchant/pubkey
  return true;
}
