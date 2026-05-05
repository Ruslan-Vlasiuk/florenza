import { NextRequest, NextResponse } from 'next/server';
import { verifyMonoWebhook } from '@/lib/payments/mono';
import { getPayloadClient } from '@/lib/payload-client';
import { sendTelegramMessageWithButtons } from '@/lib/messengers/telegram-commands';
import { sendTelegramMessage } from '@/lib/messengers/telegram';
import { issueFiscalReceiptForOrder } from '@/lib/payments/issue-receipt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Monobank Acquiring webhook.
 * Mono posts here on every state transition: created → processing →
 * (hold | success | failure | reversed | expired).
 *
 * Body sample:
 *   {
 *     "invoiceId": "p2_xxx",
 *     "status": "success",
 *     "amount": 80000,        // kopiykas
 *     "ccy": 980,
 *     "finalAmount": 80000,
 *     "createdDate": "...",
 *     "modifiedDate": "...",
 *     "reference": "FL-...",
 *     "destination": "..."
 *   }
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get('x-sign') ?? '';
  const ok = await verifyMonoWebhook(rawBody, sigHeader);
  if (!ok) {
    console.warn('[mono webhook] signature mismatch');
    return NextResponse.json({ error: 'invalid signature' }, { status: 403 });
  }

  let data: any;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { invoiceId, status, amount } = data;
  if (!invoiceId || !status) {
    return NextResponse.json({ ok: true });
  }

  const payload = await getPayloadClient();
  const ordersResult = await payload.find({
    collection: 'orders',
    where: { paymentIntentId: { equals: invoiceId } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  const order: any = ordersResult.docs[0];
  if (!order) {
    console.warn('[mono webhook] order not found for invoice', invoiceId);
    return NextResponse.json({ ok: true });
  }

  const paidAmountUah = typeof amount === 'number' ? amount / 100 : 0;
  const isFullPayment = Math.abs(paidAmountUah - order.totalAmount) < 0.5;
  const isPrepayment50 = !isFullPayment && paidAmountUah >= order.totalAmount / 2 - 0.5;

  if (status === 'success') {
    const newStatus = isFullPayment
      ? 'paid'
      : isPrepayment50
        ? 'prepayment_received'
        : 'paid_partial';

    await payload.update({
      collection: 'orders',
      id: order.id,
      overrideAccess: true,
      data: {
        status: newStatus,
        paidAmount: (order.paidAmount ?? 0) + paidAmountUah,
        remainingAmount: Math.max(0, order.totalAmount - ((order.paidAmount ?? 0) + paidAmountUah)),
        paidAt: new Date().toISOString(),
      } as any,
    });

    // Notify customer in their TG chat
    const customer =
      typeof order.customer === 'object' && order.customer ? order.customer : null;
    if (customer?.telegramChatId) {
      const msg = isFullPayment
        ? `✅ Оплату <b>${paidAmountUah} грн</b> отримано. Замовлення <b>${order.orderNumber}</b> у роботі — підготуємо й передамо кур'єру вчасно.`
        : `✅ Передоплату <b>${paidAmountUah} грн</b> отримано. Замовлення <b>${order.orderNumber}</b> підтверджено. Решта (${(order.totalAmount - paidAmountUah).toFixed(0)} грн) — при доставці.`;
      await sendTelegramMessage(customer.telegramChatId, msg).catch(() => {});
    }

    // Notify admin (thread on original alert)
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      await sendTelegramMessageWithButtons(
        adminChatId,
        [
          `💰 <b>${order.orderNumber}</b> — ${isFullPayment ? 'ПОВНА оплата' : isPrepayment50 ? 'передоплата 50%' : 'часткова оплата'}`,
          `Сума: <b>${paidAmountUah} грн</b>`,
          `Mono invoice: <code>${invoiceId}</code>`,
          '',
          `Статус замовлення → ${newStatus === 'paid' ? '✅ оплачено' : '✅ передоплата отримана'}`,
        ].join('\n'),
        [[{ text: '📋 Деталі', callback_data: `details:${order.orderNumber}` }]],
        {
          useAdminBot: true,
          replyToMessageId: order.adminAlertMessageId ?? undefined,
        },
      ).catch(() => {});
    }

    // Try to issue ПРРО receipt only if Checkbox creds are configured
    if (process.env.CHECKBOX_LICENSE_KEY) {
      await issueFiscalReceiptForOrder(order.id).catch((e: any) =>
        console.error('[checkbox] receipt failed', e),
      );
    }
  } else if (status === 'failure' || status === 'expired' || status === 'reversed') {
    await payload.update({
      collection: 'orders',
      id: order.id,
      overrideAccess: true,
      data: {
        status: 'cancelled',
      } as any,
    });

    const customer =
      typeof order.customer === 'object' && order.customer ? order.customer : null;
    if (customer?.telegramChatId) {
      await sendTelegramMessage(
        customer.telegramChatId,
        `❌ Оплата не пройшла (${status}). Замовлення ${order.orderNumber} скасовано. Якщо це помилка — напишіть нам у цей чат.`,
      ).catch(() => {});
    }

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      await sendTelegramMessageWithButtons(
        adminChatId,
        `❌ <b>${order.orderNumber}</b> — оплата ${status}`,
        [[{ text: '📋 Деталі', callback_data: `details:${order.orderNumber}` }]],
        {
          useAdminBot: true,
          replyToMessageId: order.adminAlertMessageId ?? undefined,
        },
      ).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
