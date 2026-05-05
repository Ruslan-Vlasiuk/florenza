import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';
import { sendTelegramMessageWithButtons } from '@/lib/messengers/telegram-commands';
import { recordFollowupSent } from '@/lib/payments/order-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Hourly cron: orders that sat in `new` (= customer never opened the
 * Telegram bot to confirm + prepay) for >1h get a nudge to admin.
 *
 *   curl -H "Authorization: Bearer <CRON_SECRET>" \
 *        https://florenza-irpin.com/api/cron/orders-followup
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const payload = await getPayloadClient();
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) {
    return NextResponse.json({ ok: true, skipped: 'no admin chat id' });
  }

  // Window: 1h..24h ago — nudge orders older than an hour, but skip
  // ones we already gave up on (>24h).
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const stuck = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'new' } },
        { createdAt: { less_than: oneHourAgo } },
        { createdAt: { greater_than: twentyFourHoursAgo } },
        // Skip orders we already nudged
        { followupSentAt: { exists: false } },
      ],
    },
    limit: 20,
    depth: 1,
    overrideAccess: true,
  });

  let nudged = 0;
  for (const order of stuck.docs as any[]) {
    const customer =
      typeof order.customer === 'object' && order.customer ? order.customer : null;
    if (customer?.telegramChatId) continue; // they linked, don't nudge

    const text = [
      `⚠️ <b>${order.orderNumber}</b> — клієнт не привʼязав Telegram за годину`,
      '',
      `<b>${order.buyerName ?? 'Клієнт'}</b> · <code>${order.buyerPhone ?? '—'}</code>`,
      `Сума: ${order.totalAmount} грн`,
      `Доставка: ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('uk-UA') : '—'} · ${order.deliverySlot ?? '—'}`,
      '',
      'Зателефонуйте клієнту для підтвердження замовлення вручну.',
    ].join('\n');

    await sendTelegramMessageWithButtons(
      adminChatId,
      text,
      [
        [
          { text: '📋 Деталі', callback_data: `details:${order.orderNumber}` },
          { text: '📞 Телефон', callback_data: `phone:${order.orderNumber}` },
        ],
      ],
      {
        useAdminBot: true,
        replyToMessageId: order.adminAlertMessageId ?? undefined,
      },
    ).catch((e) => console.error('[cron orders-followup]', e));

    await recordFollowupSent(order.id).catch(() => {});
    nudged++;
  }

  return NextResponse.json({ ok: true, nudged, candidates: stuck.docs.length });
}
