/**
 * LiqPay SDK wrapper. Backup payment provider (used when Mono fails).
 * https://www.liqpay.ua/documentation/api/aquiring/checkout/doc
 */
import crypto from 'crypto';

export interface CreatePaymentRequest {
  amount: number;
  orderRef: string;
  description: string;
  resultUrl: string;
  serverUrl: string;
}

export interface CreatePaymentResponse {
  url: string;
  intentId: string;
}

export async function createLiqPayPayment(
  req: CreatePaymentRequest,
): Promise<CreatePaymentResponse> {
  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error('LIQPAY_PUBLIC_KEY / LIQPAY_PRIVATE_KEY not set');
  }

  const params = {
    public_key: publicKey,
    version: '3',
    action: 'pay',
    amount: req.amount,
    currency: 'UAH',
    description: req.description,
    order_id: req.orderRef,
    result_url: req.resultUrl,
    server_url: req.serverUrl,
    language: 'uk',
  };

  const data = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature = crypto
    .createHash('sha1')
    .update(privateKey + data + privateKey)
    .digest('base64');

  // LiqPay generates a checkout URL based on data+signature
  const url = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

  return {
    url,
    intentId: req.orderRef, // LiqPay uses order_id as the reference
  };
}

export function verifyLiqPayWebhook(data: string, signature: string): boolean {
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;
  if (!privateKey) return false;
  const expected = crypto
    .createHash('sha1')
    .update(privateKey + data + privateKey)
    .digest('base64');
  return expected === signature;
}

export function decodeLiqPayPayload(data: string): any {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
}
