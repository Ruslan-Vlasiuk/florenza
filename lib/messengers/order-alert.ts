/**
 * Single source of truth for the "new order" admin alert.
 * Used both by web checkout (/api/orders) and by Лія's create_pending_order
 * tool, so admin gets the same rich card + inline buttons regardless of
 * how the order originated.
 */

import { sendTelegramMessageWithButtons } from './telegram-commands';
import { sendAdminAlert } from './admin-notify';
import { getPayloadClient } from '../payload-client';
import { recordAdminAlertMessageId } from '../payments/order-db';

type AlertSource = 'web_checkout' | 'liya_telegram' | 'liya_web_chat';

export async function sendNewOrderAdminAlert(args: {
  orderId: number | string;
  isSandbox: boolean;
  source: AlertSource;
  prepaymentRequired?: boolean;
}): Promise<{ messageId?: number }> {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) return {};

  const payload = await getPayloadClient();
  const order = (await payload.findByID({
    collection: 'orders',
    id: args.orderId,
    overrideAccess: true,
    depth: 1,
  })) as any;

  if (!order) return {};

  const orderNumber = order.orderNumber as string;
  const items: any[] = (order.bouquetSnapshot?.items as any[]) ?? [
    {
      name: order.bouquetSnapshot?.name ?? 'Букет',
      quantity: 1,
      price: order.bouquetSnapshot?.price ?? order.subtotal ?? 0,
    },
  ];
  const itemsLine = items
    .map((i) => `${i.quantity}× ${i.name}`)
    .join(', ');

  const sourceLabel =
    args.source === 'web_checkout'
      ? 'веб-чекаут'
      : args.source === 'liya_telegram'
        ? 'Telegram-бот · Лія'
        : 'AI-чат на сайті · Лія';

  const customer =
    typeof order.customer === 'object' && order.customer
      ? order.customer
      : null;
  const tgInfo = customer?.telegramChatId
    ? `Telegram: <code>${customer.telegramChatId}</code>`
    : '<i>Telegram не привʼязаний</i>';

  const recipientLine = order.recipientName
    ? `${order.recipientName} · <code>${order.recipientPhone ?? '—'}</code>${order.isAnonymous ? ' 🤐 анонімне' : ''}`
    : '= замовник';

  const addressBlock: string[] = [
    `${order.addressStreet ?? '—'}, ${order.addressBuilding ?? '—'}`,
  ];
  const sub: string[] = [];
  if (order.addressApartment) sub.push(`кв. ${order.addressApartment}`);
  if (order.addressFloor) sub.push(`поверх ${order.addressFloor}`);
  if (order.addressEntrance) sub.push(`під'їзд ${order.addressEntrance}`);
  if (order.addressIntercom) sub.push(`домофон ${order.addressIntercom}`);
  if (sub.length) addressBlock.push(sub.join(', '));

  const lines = [
    `<b>🌸 Нове замовлення ${orderNumber}</b>${args.isSandbox ? ' · sandbox' : ''}${order.isUrgent ? ' · ⚠️ ТЕРМІНОВА' : ''}`,
    `Джерело: ${sourceLabel}`,
    '',
    `<b>Сума:</b> ${order.totalAmount} грн`,
    args.prepaymentRequired
      ? `<b>Передоплата 50%:</b> ${Math.round(order.totalAmount / 2)} грн (через TG-бот)`
      : null,
    `<b>Букети:</b> ${itemsLine}`,
    '',
    `<b>Замовник:</b> ${order.buyerName ?? '—'} · <code>${order.buyerPhone ?? '—'}</code>`,
    tgInfo,
    `<b>Отримувач:</b> ${recipientLine}`,
    '',
    `<b>Адреса:</b>\n   ${addressBlock.join('\n   ')}`,
    order.courierInstructions ? `<b>Курʼєру:</b> ${order.courierInstructions}` : null,
    '',
    `<b>Доставка:</b> ${formatDate(order.deliveryDate)} · ${order.deliverySlot ?? ''}`,
    order.cardMessage ? `<b>Листівка:</b> ${order.cardMessage}` : null,
    '',
    customer?.telegramChatId
      ? '<i>✅ Клієнт привʼязав Telegram</i>'
      : '<i>⏳ Чекаємо коли клієнт привʼяже Telegram через сайт.</i>',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const sent = await sendTelegramMessageWithButtons(
      adminChatId,
      lines,
      [
        [
          { text: '📋 Деталі', callback_data: `details:${orderNumber}` },
          {
            text: customer?.telegramChatId ? '💬 Написати клієнту' : '📞 Телефон',
            callback_data: customer?.telegramChatId
              ? `reply:${orderNumber}`
              : `phone:${orderNumber}`,
          },
        ],
      ],
      { useAdminBot: true },
    );

    if (sent.messageId) {
      await recordAdminAlertMessageId({
        orderId: args.orderId,
        messageId: sent.messageId,
      }).catch(() => {});
    }
    return sent;
  } catch (err) {
    console.error('[order-alert] inline alert failed, falling back:', err);
    await sendAdminAlert({
      kind: 'new_paid_order',
      title: `🌸 ${orderNumber}`,
      body: lines,
      urgency: order.isUrgent ? 'high' : 'normal',
      meta: { orderId: args.orderId, orderNumber },
    }).catch(() => {});
    return {};
  }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  // 'YYYY-MM-DD' or full ISO
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('uk-UA');
}
