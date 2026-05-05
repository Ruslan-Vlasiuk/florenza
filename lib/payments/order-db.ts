/**
 * Raw-SQL helpers for payment-related order updates.
 *
 * Why raw SQL: Payload's update path goes through Drizzle's UPSERT with
 * full row reserialization, which fails on this schema when a nullable
 * relationship column is involved (the previously-NULL delivery_zone_id
 * comes back as empty string and Postgres rejects the cast to integer).
 * For payment writes we touch a tiny set of columns, so a focused UPDATE
 * is both faster and avoids the Payload/Drizzle quirk.
 */

import { Pool } from 'pg';

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URI ??
        'postgres://florenza:florenza_dev@localhost:5432/florenza',
      max: 4,
    });
  }
  return pool;
}

export async function recordPaymentLink(args: {
  orderId: number | string;
  intentId: string;
  url: string;
  status?: string;
}): Promise<void> {
  const p = getPool();
  await p.query(
    `UPDATE orders
       SET payment_provider = 'mono',
           payment_intent_id = $1,
           payment_link = $2,
           status = $3,
           updated_at = NOW()
     WHERE id = $4`,
    [args.intentId, args.url, args.status ?? 'awaiting_prepayment', Number(args.orderId)],
  );
}

export async function recordPaymentSuccess(args: {
  orderId: number | string;
  paidAmount: number;
  totalAmount: number;
  status: 'paid' | 'prepayment_received' | 'paid_partial';
}): Promise<void> {
  const p = getPool();
  const remaining = Math.max(0, args.totalAmount - args.paidAmount);
  await p.query(
    `UPDATE orders
       SET status = $1,
           paid_amount = COALESCE(paid_amount, 0) + $2,
           remaining_amount = $3,
           paid_at = NOW(),
           updated_at = NOW()
     WHERE id = $4`,
    [args.status, args.paidAmount, remaining, Number(args.orderId)],
  );
}

export async function recordPaymentCancelled(orderId: number | string): Promise<void> {
  const p = getPool();
  await p.query(
    `UPDATE orders
       SET status = 'cancelled',
           updated_at = NOW()
     WHERE id = $1`,
    [Number(orderId)],
  );
}

export async function recordAdminAlertMessageId(args: {
  orderId: number | string;
  messageId: number;
}): Promise<void> {
  const p = getPool();
  await p.query(
    `UPDATE orders
       SET admin_alert_message_id = $1,
           updated_at = NOW()
     WHERE id = $2`,
    [args.messageId, Number(args.orderId)],
  );
}

export async function recordFollowupSent(orderId: number | string): Promise<void> {
  const p = getPool();
  await p.query(
    `UPDATE orders
       SET followup_sent_at = NOW(),
           updated_at = NOW()
     WHERE id = $1`,
    [Number(orderId)],
  );
}

export async function setOrderStatus(
  orderId: number | string,
  status: string,
): Promise<void> {
  const p = getPool();
  await p.query(
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, Number(orderId)],
  );
}

/** Same Drizzle/Payload UPSERT quirk on Customers — write directly. */
export async function setCustomerTelegram(args: {
  customerId: number | string;
  telegramChatId: string;
  name?: string;
}): Promise<void> {
  const p = getPool();
  if (args.name) {
    await p.query(
      `UPDATE customers
         SET telegram_chat_id = $1,
             preferred_channel = 'telegram',
             name = COALESCE($2, name),
             updated_at = NOW()
       WHERE id = $3`,
      [args.telegramChatId, args.name, Number(args.customerId)],
    );
  } else {
    await p.query(
      `UPDATE customers
         SET telegram_chat_id = $1,
             preferred_channel = 'telegram',
             updated_at = NOW()
       WHERE id = $2`,
      [args.telegramChatId, Number(args.customerId)],
    );
  }
}
