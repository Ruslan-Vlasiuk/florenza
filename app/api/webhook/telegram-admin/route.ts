import { NextRequest, NextResponse } from 'next/server';
import {
  isAdminChat,
  setAdminAwaitingReply,
  getAdminAwaitingReply,
  clearAdminAwaitingReply,
  sendToCustomerChat,
  sendTelegramMessageWithButtons,
  answerCallbackQuery,
  formatAdminOrderDetails,
  findOrderByNumber,
} from '@/lib/messengers/telegram-commands';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Webhook for the ADMIN bot (@djirickeosiifj832838bot).
 * The admin DM's this bot to manage orders. Identical command surface as
 * the customer-bot admin path, but routed via the dedicated admin bot so
 * the bot the admin uses for alerts is the same one that accepts commands.
 */
export async function POST(req: NextRequest) {
  // Admin bot uses a separate webhook secret if configured.
  const secret = process.env.TELEGRAM_ADMIN_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get('x-telegram-bot-api-secret-token');
    if (header !== secret) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  try {
    const update = await req.json();

    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const adminChatId = String(message.chat.id);
    const text = (message.text ?? '').trim();

    // Hard gate: only the configured admin chat can use this bot.
    if (!isAdminChat(adminChatId)) {
      await sendAdminBotMessage(
        adminChatId,
        'Цей бот — для адміна Florenza. Якщо ви клієнт — напишіть @FLORENZA_irpin_bot.',
      );
      return NextResponse.json({ ok: true });
    }

    if (!text) return NextResponse.json({ ok: true });
    await routeAdminCommand(adminChatId, text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[telegram-admin webhook] error:', e);
    return NextResponse.json({ ok: true });
  }
}

async function routeAdminCommand(adminChatId: string, text: string) {
  // Active reply state — relay text to customer
  const awaitingOrderNumber = getAdminAwaitingReply(adminChatId);
  if (awaitingOrderNumber && !text.startsWith('/')) {
    const order = await findOrderByNumber(awaitingOrderNumber);
    const customer =
      order?.customer && typeof order.customer === 'object' ? order.customer : null;
    const customerChatId = customer?.telegramChatId;
    if (!customerChatId) {
      await sendAdminBotMessage(
        adminChatId,
        `❌ Клієнт замовлення ${awaitingOrderNumber} ще не привʼязав свій Telegram.\nЗателефонуйте: <code>${order?.buyerPhone ?? '—'}</code>`,
      );
      clearAdminAwaitingReply(adminChatId);
      return;
    }
    try {
      await sendToCustomerChat(customerChatId, text);
      await sendAdminBotMessage(
        adminChatId,
        `✅ Передано клієнту ${order?.buyerName ?? ''} (${awaitingOrderNumber})`,
      );
    } catch (e) {
      await sendAdminBotMessage(
        adminChatId,
        `❌ Не вдалось доставити: ${(e as Error).message}`,
      );
    }
    clearAdminAwaitingReply(adminChatId);
    return;
  }

  // /order FL-X
  const orderCmd = text.match(/^\/order\s+(\S+)/i);
  if (orderCmd) {
    const orderNumber = orderCmd[1].toUpperCase();
    const order = await findOrderByNumber(orderNumber);
    if (!order) {
      await sendAdminBotMessage(adminChatId, `Замовлення ${orderNumber} не знайдено.`);
      return;
    }
    const customer =
      order.customer && typeof order.customer === 'object' ? order.customer : null;
    await sendTelegramMessageWithButtons(
      adminChatId,
      formatAdminOrderDetails(order, customer),
      [
        [
          {
            text: customer?.telegramChatId ? '💬 Написати клієнту' : '📞 Тільки телефон',
            callback_data: customer?.telegramChatId
              ? `reply:${orderNumber}`
              : `phone:${orderNumber}`,
          },
        ],
      ],
      { useAdminBot: true },
    );
    return;
  }

  // /find — prompt
  if (text.toLowerCase() === '/find' || text.toLowerCase() === '/order') {
    await sendAdminBotMessage(
      adminChatId,
      'Введіть номер замовлення:\n<code>/order FL-YYYYMMDD-XXXXX</code>',
    );
    return;
  }

  // /cancel
  if (text.toLowerCase() === '/cancel') {
    clearAdminAwaitingReply(adminChatId);
    await sendAdminBotMessage(adminChatId, 'OK, скасовано.');
    return;
  }

  // /help, /start
  if (text.toLowerCase() === '/help' || text.toLowerCase() === '/start') {
    await sendAdminBotMessage(
      adminChatId,
      [
        '<b>Florenza · адмін-бот</b>',
        '',
        '<b>Команди:</b>',
        '<code>/order FL-...</code> — повна інформація + кнопка відповіді',
        '<code>/find</code> — підказка',
        '<code>/cancel</code> — скасувати поточну дію',
        '',
        'Коли отримуєте сповіщення про нове замовлення — на ньому одразу буде кнопка «Відповісти клієнту».',
      ].join('\n'),
    );
    return;
  }

  // Default: explain
  await sendAdminBotMessage(
    adminChatId,
    'Не розпізнав команду. Напишіть /help для списку.',
  );
}

async function handleCallbackQuery(cb: any) {
  const callbackId = cb.id;
  const data: string = cb.data ?? '';
  const adminChatId = String(cb.from.id);

  if (!isAdminChat(adminChatId)) {
    await answerCallbackQuery(callbackId, 'Доступно тільки адміну.', { useAdminBot: true });
    return;
  }

  const [action, ...rest] = data.split(':');
  const orderNumber = rest.join(':');

  if (action === 'reply') {
    const order = await findOrderByNumber(orderNumber);
    const customer =
      order?.customer && typeof order.customer === 'object' ? order.customer : null;
    if (!customer?.telegramChatId) {
      await answerCallbackQuery(callbackId, 'TG не привʼязаний', { useAdminBot: true });
      await sendAdminBotMessage(
        adminChatId,
        `Клієнт замовлення ${orderNumber} не привʼязав Telegram.\nЗателефонуйте: <code>${order?.buyerPhone ?? '—'}</code>`,
      );
      return;
    }
    setAdminAwaitingReply(adminChatId, orderNumber);
    await answerCallbackQuery(callbackId, 'Введіть текст', { useAdminBot: true });
    await sendAdminBotMessage(
      adminChatId,
      `✏️ Наступне ваше повідомлення буде надіслано клієнту замовлення <b>${orderNumber}</b>.\nЩоб скасувати — <code>/cancel</code>.`,
    );
    return;
  }

  if (action === 'phone') {
    const order = await findOrderByNumber(orderNumber);
    await answerCallbackQuery(
      callbackId,
      order?.buyerPhone ? `Тел: ${order.buyerPhone}` : 'Без телефону',
      { useAdminBot: true },
    );
    return;
  }

  if (action === 'details') {
    const order = await findOrderByNumber(orderNumber);
    if (!order) {
      await answerCallbackQuery(callbackId, 'Не знайдено', { useAdminBot: true });
      return;
    }
    const customer =
      order.customer && typeof order.customer === 'object' ? order.customer : null;
    await answerCallbackQuery(callbackId, '', { useAdminBot: true });
    await sendTelegramMessageWithButtons(
      adminChatId,
      formatAdminOrderDetails(order, customer),
      [
        [
          {
            text: customer?.telegramChatId ? '💬 Написати клієнту' : '📞 Тільки телефон',
            callback_data: customer?.telegramChatId
              ? `reply:${orderNumber}`
              : `phone:${orderNumber}`,
          },
        ],
      ],
      { useAdminBot: true },
    );
    return;
  }

  await answerCallbackQuery(callbackId, '', { useAdminBot: true });
}

async function sendAdminBotMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  }).catch(() => {});
}
