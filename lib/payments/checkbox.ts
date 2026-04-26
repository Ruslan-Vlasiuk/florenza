/**
 * Checkbox.ua ПРРО SDK wrapper.
 * Issues fiscal receipts after successful payments and delivers them to Telegram/Viber.
 *
 * https://checkbox.ua/api-docs
 */

const CHECKBOX_API = process.env.CHECKBOX_API_URL || 'https://api.checkbox.ua/api/v1';

export interface FiscalReceiptRequest {
  orderRef: string;
  amount: number;
  description: string;
  paymentMethod: 'card' | 'cash';
  customerPhone?: string;
}

export interface FiscalReceiptResponse {
  receiptId: string;
  receiptUrl: string;
  fiscalNumber?: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getCheckboxToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const login = process.env.CHECKBOX_LOGIN;
  const password = process.env.CHECKBOX_PASSWORD;
  const licenseKey = process.env.CHECKBOX_LICENSE_KEY;
  if (!login || !password || !licenseKey) {
    throw new Error('CHECKBOX_LOGIN / CHECKBOX_PASSWORD / CHECKBOX_LICENSE_KEY not set');
  }

  const response = await fetch(`${CHECKBOX_API}/cashier/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-License-Key': licenseKey,
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) throw new Error(`Checkbox auth failed: ${response.status}`);
  const data = (await response.json()) as any;

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + 1000 * 60 * 60, // 1h
  };
  return cachedToken.token;
}

export async function createFiscalReceipt(
  req: FiscalReceiptRequest,
): Promise<FiscalReceiptResponse> {
  const token = await getCheckboxToken();
  const licenseKey = process.env.CHECKBOX_LICENSE_KEY!;

  const receiptPayload = {
    cashier_name: 'Florenza AI',
    payments: [
      {
        type: req.paymentMethod === 'card' ? 'CARD' : 'CASH',
        value: Math.round(req.amount * 100),
      },
    ],
    goods: [
      {
        good: { code: 'FLOWER', name: req.description, price: Math.round(req.amount * 100) },
        quantity: 1000, // Checkbox uses milliquantity
      },
    ],
    related_receipt_id: req.orderRef,
  };

  const response = await fetch(`${CHECKBOX_API}/receipts/sell`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-License-Key': licenseKey,
    },
    body: JSON.stringify(receiptPayload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Checkbox receipt failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as any;
  return {
    receiptId: data.id,
    receiptUrl: data.receipt_url ?? `${CHECKBOX_API}/receipts/${data.id}/html`,
    fiscalNumber: data.fiscal_code,
  };
}

export async function sendReceiptToCustomer(
  receiptUrl: string,
  channel: 'telegram' | 'viber',
  customerExternalId: string,
): Promise<void> {
  // Delegated to messenger module
  const { sendTelegramMessage } = await import('../messengers/telegram');
  const { sendViberMessage } = await import('../messengers/viber');

  const message = `Дякуємо за замовлення! Ваш фіскальний чек:\n${receiptUrl}`;

  if (channel === 'telegram') {
    await sendTelegramMessage(customerExternalId, message);
  } else {
    await sendViberMessage(customerExternalId, message);
  }
}
