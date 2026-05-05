/**
 * Issues a fiscal receipt via Checkbox ПРРО for a paid order
 * and sends it to the customer's preferred messenger.
 */
import { createFiscalReceipt, sendReceiptToCustomer } from './checkbox';
import { getPayloadClient } from '../payload-client';
import { Pool } from 'pg';

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URI ?? '',
      max: 2,
    });
  }
  return pool;
}

export async function issueFiscalReceiptForOrder(orderId: string): Promise<void> {
  const payload = await getPayloadClient();
  const order: any = await payload.findByID({ collection: 'orders', id: orderId });
  if (!order) return;
  if (!process.env.CHECKBOX_LICENSE_KEY) {
    console.warn('[checkbox] not configured, skipping receipt');
    return;
  }

  const receipt = await createFiscalReceipt({
    orderRef: order.orderNumber,
    amount: order.paidAmount ?? order.totalAmount,
    description: order.bouquetSnapshot?.name ?? 'Букет',
    paymentMethod: 'card',
    customerPhone: order.buyerPhone,
  });

  // Use raw SQL — same Payload+Drizzle UPSERT quirk applies on Orders.
  await getPool().query(
    `UPDATE orders
       SET fiscal_receipt_id = $1,
           fiscal_receipt_url = $2,
           updated_at = NOW()
     WHERE id = $3`,
    [receipt.receiptId, receipt.receiptUrl, Number(orderId)],
  );

  // Find conversation and send to its channel
  const conv: any = order.conversation
    ? await payload.findByID({ collection: 'conversations', id: order.conversation })
    : null;

  if (conv) {
    const channel = conv.channel === 'telegram' ? 'telegram' : conv.channel === 'viber' ? 'viber' : null;
    if (channel) {
      await sendReceiptToCustomer(receipt.receiptUrl, channel, conv.externalId).catch(() => {});
    }
  }
}
