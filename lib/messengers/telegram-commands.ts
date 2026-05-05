/**
 * Telegram bot command handlers — both customer and admin sides.
 *
 * Routing is in /api/webhook/telegram/route.ts. This module provides:
 *  - linkOrderToChat — customer presses "Слідкуй у Telegram", we associate
 *    their chatId with the Order.customer
 *  - admin commands /order, /find, /reply
 *  - inline-button callback handlers (reply_to_order, find_order)
 *  - in-memory state for "admin is composing reply" flow
 */

import { sendTelegramMessage } from './telegram';
import { getPayloadClient } from '../payload-client';

const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

function getCustomerBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN;
}

function getAdminChatId(): string | undefined {
  return process.env.TELEGRAM_ADMIN_CHAT_ID;
}

export function isAdminChat(chatId: string | number): boolean {
  const adminId = getAdminChatId();
  return !!adminId && String(chatId) === String(adminId);
}

/**
 * In-memory state: admin chat → orderNumber they're composing a reply for.
 * Lives for ~10 min then expires. Process-local — OK for single-instance.
 */
type AdminReplyState = { orderNumber: string; until: number };
const adminReplyState = new Map<string, AdminReplyState>();
const REPLY_TTL_MS = 10 * 60 * 1000;

export function setAdminAwaitingReply(adminChatId: string, orderNumber: string) {
  adminReplyState.set(adminChatId, {
    orderNumber,
    until: Date.now() + REPLY_TTL_MS,
  });
}

export function getAdminAwaitingReply(adminChatId: string): string | null {
  const s = adminReplyState.get(adminChatId);
  if (!s) return null;
  if (s.until < Date.now()) {
    adminReplyState.delete(adminChatId);
    return null;
  }
  return s.orderNumber;
}

export function clearAdminAwaitingReply(adminChatId: string) {
  adminReplyState.delete(adminChatId);
}

/**
 * Send a customer-facing message via @FLORENZA_irpin_bot to a chatId.
 * Used by the admin to relay replies.
 */
export async function sendToCustomerChat(chatId: string, text: string) {
  const token = getCustomerBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not configured');
  const res = await fetch(`${TG_API(token)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram send failed: ${res.status} ${await res.text()}`);
  }
}

/**
 * Reply to a customer message via inline keyboard button.
 */
export type InlineButton = { text: string; callback_data?: string; url?: string };

export async function sendTelegramMessageWithButtons(
  chatId: string,
  text: string,
  buttons: InlineButton[][],
  opts?: { useAdminBot?: boolean },
) {
  const token = opts?.useAdminBot
    ? process.env.TELEGRAM_ADMIN_BOT_TOKEN
    : getCustomerBotToken();
  if (!token) return;
  await fetch(`${TG_API(token)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: buttons },
    }),
  });
}

export async function answerCallbackQuery(
  callbackId: string,
  text?: string,
  opts?: { useAdminBot?: boolean },
) {
  const token = opts?.useAdminBot
    ? process.env.TELEGRAM_ADMIN_BOT_TOKEN
    : getCustomerBotToken();
  if (!token) return;
  await fetch(`${TG_API(token)}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackId,
      text: text ?? '',
    }),
  }).catch(() => {});
}

/**
 * Customer pressed deep-link /start order_FL-XXXX.
 * Link this chat to the order's customer, persist telegramChatId.
 */
export async function linkOrderToTelegramChat(args: {
  orderNumber: string;
  chatId: string;
  fromName?: string;
  fromUsername?: string;
}): Promise<{ ok: boolean; reason?: string; orderSummary?: string }> {
  const payload = await getPayloadClient();

  const orders = await payload.find({
    collection: 'orders',
    where: { orderNumber: { equals: args.orderNumber } },
    limit: 1,
    overrideAccess: true,
  });
  const order = orders.docs[0] as any;
  if (!order) {
    return { ok: false, reason: 'order_not_found' };
  }

  // Resolve customer; create or update telegramChatId.
  let customerId =
    typeof order.customer === 'object' ? order.customer?.id : order.customer;

  if (customerId) {
    await payload
      .update({
        collection: 'customers',
        id: customerId,
        overrideAccess: true,
        data: {
          telegramChatId: args.chatId,
          preferredChannel: 'telegram',
          name: args.fromName ?? undefined,
        } as any,
      })
      .catch((e) => console.error('[linkOrderToTelegram] update customer:', e));
  } else if (order.buyerPhone) {
    // Fallback: find/create by phone and attach
    const found = await payload.find({
      collection: 'customers',
      where: { phone: { equals: order.buyerPhone } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs[0]) {
      customerId = found.docs[0].id;
      await payload.update({
        collection: 'customers',
        id: customerId,
        overrideAccess: true,
        data: {
          telegramChatId: args.chatId,
          preferredChannel: 'telegram',
        } as any,
      });
    }
  }

  const summary = formatCustomerOrderSummary(order);
  return { ok: true, orderSummary: summary };
}

export function formatCustomerOrderSummary(order: any): string {
  const items = (order.bouquetSnapshot?.items as any[]) ?? [];
  const itemsLine = items
    .map((i: any) => `• ${i.quantity}× ${i.name} — ${i.price * i.quantity} грн`)
    .join('\n');
  const address = `${order.addressStreet}, ${order.addressBuilding}${
    order.addressApartment ? `, кв. ${order.addressApartment}` : ''
  }`;
  return [
    `<b>Замовлення ${order.orderNumber}</b>`,
    `Статус: <b>${humanStatus(order.status)}</b>`,
    '',
    itemsLine,
    '',
    `<b>Доставка:</b> ${order.deliveryDate} · ${order.deliverySlot}${order.isUrgent ? ' · ТЕРМІНОВА' : ''}`,
    `<b>Адреса:</b> ${address}`,
    `<b>Сума:</b> ${order.totalAmount} грн`,
    '',
    'Будемо повідомляти про зміни статусу. Якщо потрібно щось уточнити — пишіть просто в цей чат.',
  ].join('\n');
}

export function formatAdminOrderDetails(order: any, customer: any | null): string {
  const items = (order.bouquetSnapshot?.items as any[]) ?? [];
  const itemsLine = items
    .map((i: any) => `• ${i.quantity}× ${i.name} — ${i.price * i.quantity} грн`)
    .join('\n');
  const address = `${order.addressStreet}, ${order.addressBuilding}${
    order.addressApartment ? `, кв. ${order.addressApartment}` : ''
  }${order.addressFloor ? `, поверх ${order.addressFloor}` : ''}${
    order.addressEntrance ? `, під'їзд ${order.addressEntrance}` : ''
  }${order.addressIntercom ? `, домофон ${order.addressIntercom}` : ''}`;

  const tgInfo = customer?.telegramChatId
    ? `Telegram: <code>${customer.telegramChatId}</code>`
    : '<i>Telegram не привʼязаний</i>';

  return [
    `<b>📋 ${order.orderNumber}</b> · ${humanStatus(order.status)}`,
    '',
    itemsLine,
    '',
    `<b>Замовник:</b> ${order.buyerName ?? '—'}`,
    `<b>Телефон:</b> <code>${order.buyerPhone ?? '—'}</code>`,
    tgInfo,
    order.recipientName ? `<b>Отримувач:</b> ${order.recipientName} · ${order.recipientPhone ?? '—'}` : '',
    order.isAnonymous ? '🤐 <i>анонімне</i>' : '',
    '',
    `<b>Адреса:</b> ${address}`,
    order.courierInstructions ? `<b>Інструкції:</b> ${order.courierInstructions}` : '',
    '',
    `<b>Доставка:</b> ${order.deliveryDate} · ${order.deliverySlot}${order.isUrgent ? ' · ⚠️ ТЕРМІНОВА' : ''}`,
    order.cardMessage ? `<b>Листівка:</b> ${order.cardMessage}` : '',
    '',
    `<b>Сума:</b> ${order.totalAmount} грн (${humanPaymentProvider(order.paymentProvider)})`,
    order.paymentLink ? `<a href="${order.paymentLink}">Посилання на оплату</a>` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function humanStatus(status: string): string {
  const map: Record<string, string> = {
    new: '🆕 Новий',
    pending_payment: '💳 Очікує оплати',
    paid: '✅ Оплачений',
    paid_partial: '◑ Часткова оплата',
    in_progress: '🌿 У роботі',
    handed_to_courier: '🛵 Передано курʼєру',
    delivered: '🎉 Доставлено',
    cancelled: '❌ Скасований',
  };
  return map[status] ?? status;
}

function humanPaymentProvider(p?: string): string {
  if (p === 'mono') return 'Mono';
  if (p === 'liqpay') return 'LiqPay';
  if (p === 'cash_on_delivery') return 'при доставці';
  return p ?? '—';
}

/**
 * Find Order by number, with customer hydrated.
 */
export async function findOrderByNumber(orderNumber: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'orders',
    where: { orderNumber: { equals: orderNumber } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs[0] as any | undefined;
}
