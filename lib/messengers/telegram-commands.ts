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
import { createMonoPayment } from '../payments/mono';
import {
  recordPaymentLink,
  setOrderStatus,
  setCustomerTelegram,
} from '../payments/order-db';

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
  opts?: { useAdminBot?: boolean; replyToMessageId?: number },
): Promise<{ messageId?: number }> {
  const token = opts?.useAdminBot
    ? process.env.TELEGRAM_ADMIN_BOT_TOKEN
    : getCustomerBotToken();
  if (!token) return {};
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: buttons },
  };
  if (opts?.replyToMessageId) {
    body.reply_parameters = {
      message_id: opts.replyToMessageId,
      allow_sending_without_reply: true,
    };
  }
  const res = await fetch(`${TG_API(token)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  try {
    const data = await res.json();
    return { messageId: data?.result?.message_id };
  } catch {
    return {};
  }
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
    await setCustomerTelegram({
      customerId,
      telegramChatId: args.chatId,
      name: args.fromName,
    }).catch((e) => console.error('[linkOrderToTelegram] update customer:', e));
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
      await setCustomerTelegram({
        customerId,
        telegramChatId: args.chatId,
        name: args.fromName,
      }).catch(() => {});
    }
  }

  // Move order into "awaiting prepayment" state — customer must now pay 50%.
  if (order.status === 'new') {
    await setOrderStatus(order.id, 'awaiting_prepayment').catch(() => {});
  }

  const summary = formatCustomerOrderSummary(order);
  return { ok: true, orderSummary: summary };
}

/**
 * After customer is linked, the bot prompts them to pay the 50% deposit.
 * Uses real Monobank acquiring (sandbox token works for end-to-end flow
 * with Mono's test cards — no real money).
 */
export async function buildPrepaymentPrompt(order: any): Promise<{
  text: string;
  buttons: InlineButton[][];
}> {
  const total = Number(order.totalAmount ?? 0);
  const prepayAmount = Math.round(total / 2);
  const orderNumber = order.orderNumber as string;

  const text = [
    `<b>💳 Передоплата за замовленням ${orderNumber}</b>`,
    '',
    `Сума передоплати: <b>${prepayAmount} грн</b> (50% від ${total} грн)`,
    'Решта — при доставці кур’єру (готівкою або карткою).',
    '',
    'Натисніть кнопку — згенеруємо посилання на оплату через Monobank Acquiring (Apple Pay / Google Pay / картка).',
  ].join('\n');

  const buttons: InlineButton[][] = [
    [
      {
        text: `💳 Сплатити ${prepayAmount} грн`,
        callback_data: `pay:${orderNumber}:50`,
      },
    ],
    [
      {
        text: `💎 Сплатити повністю ${total} грн`,
        callback_data: `pay:${orderNumber}:100`,
      },
    ],
  ];

  return { text, buttons };
}

/**
 * Generate a Monobank invoice for an order, persist invoiceId on the
 * Order, and return the customer-facing payment URL.
 */
export async function createPaymentLinkForOrder(
  orderNumber: string,
  share: 50 | 100,
): Promise<{ url: string; amount: number; invoiceId: string } | { error: string }> {
  const order = await findOrderByNumber(orderNumber);
  if (!order) return { error: 'Замовлення не знайдено' };

  const total = Number(order.totalAmount ?? 0);
  const amount = share === 100 ? total : Math.round(total / 2);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://florenza-irpin.com';

  try {
    const result = await createMonoPayment({
      amount,
      orderRef: orderNumber,
      description:
        share === 100
          ? `Florenza · повна оплата замовлення ${orderNumber}`
          : `Florenza · передоплата 50% за ${orderNumber}`,
      redirectUrl: `${siteUrl}/order/${orderNumber}`,
      webhookUrl: `${siteUrl}/api/webhook/mono`,
      validityMinutes: 60 * 24, // 24h to pay
    });

    await recordPaymentLink({
      orderId: order.id,
      intentId: result.intentId,
      url: result.url,
    });

    return { url: result.url, amount, invoiceId: result.intentId };
  } catch (e) {
    console.error('[createPaymentLinkForOrder]', e);
    return { error: (e as Error).message };
  }
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

/** Find a customer who linked this Telegram chat. */
export async function findCustomerByTelegramChatId(chatId: string) {
  const payload = await getPayloadClient();
  const r = await payload.find({
    collection: 'customers',
    where: { telegramChatId: { equals: chatId } },
    limit: 1,
    overrideAccess: true,
  });
  return r.docs[0] as any | undefined;
}

/** Latest non-cancelled order placed by this customer. */
export async function findLatestOrderForCustomer(customerId: string | number) {
  const payload = await getPayloadClient();
  const r = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { customer: { equals: customerId } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    sort: '-createdAt',
    limit: 1,
    overrideAccess: true,
  });
  return r.docs[0] as any | undefined;
}

/**
 * Forward a message from a linked customer's Telegram chat to the admin bot.
 * Threads as a reply to the original order alert if available.
 */
export async function forwardCustomerMessageToAdmin(args: {
  customer: any;
  orderNumber?: string;
  text: string;
  fromName?: string;
  fromUsername?: string;
  customerChatId: string;
}) {
  const adminChatId = getAdminChatId();
  if (!adminChatId) return;

  const handle = args.fromUsername ? ` @${args.fromUsername}` : '';
  const orderHeader = args.orderNumber
    ? `📩 <b>${args.fromName ?? 'Клієнт'}</b>${handle} · замовлення <b>${args.orderNumber}</b>`
    : `📩 <b>${args.fromName ?? 'Клієнт'}</b>${handle} · TG <code>${args.customerChatId}</code>`;

  const body = `${orderHeader}\n\n${escapeHtml(args.text)}`;

  let replyToMessageId: number | undefined;
  if (args.orderNumber) {
    const order = await findOrderByNumber(args.orderNumber);
    if (order?.adminAlertMessageId) replyToMessageId = order.adminAlertMessageId;
  }

  await sendTelegramMessageWithButtons(
    adminChatId,
    body,
    args.orderNumber
      ? [
          [
            { text: '💬 Відповісти', callback_data: `reply:${args.orderNumber}` },
            { text: '📋 Деталі', callback_data: `details:${args.orderNumber}` },
          ],
        ]
      : [],
    { useAdminBot: true, replyToMessageId },
  ).catch((e) => console.error('[forwardCustomerMessageToAdmin]', e));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
