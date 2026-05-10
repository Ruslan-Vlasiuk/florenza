import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';
import { sendTelegramMessage, startTypingHeartbeat } from '@/lib/messengers/telegram';
import { getPayloadClient } from '@/lib/payload-client';
import {
  isAdminChat,
  setAdminAwaitingReply,
  getAdminAwaitingReply,
  clearAdminAwaitingReply,
  sendToCustomerChat,
  sendTelegramMessageWithButtons,
  answerCallbackQuery,
  linkOrderToTelegramChat,
  formatAdminOrderDetails,
  findOrderByNumber,
  findCustomerByTelegramChatId,
  findLatestOrderForCustomer,
  forwardCustomerMessageToAdmin,
  buildPrepaymentPrompt,
  createPaymentLinkForOrder,
} from '@/lib/messengers/telegram-commands';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get('x-telegram-bot-api-secret-token');
    if (header !== secret) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  try {
    const update = await req.json();

    // 1. Inline keyboard button click → callback_query
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const fromName =
      [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') ||
      message.from?.username;
    const fromUsername = message.from?.username;
    const text = (message.text ?? '').trim();

    // Voice handling — disabled in soft-launch
    if (message.voice) {
      await sendTelegramMessage(
        chatId,
        'Поки що приймаю тільки текст. Опишіть коротко що цікавить — допоможу обрати букет.',
      );
      return NextResponse.json({ ok: true });
    }

    if (!text) return NextResponse.json({ ok: true });

    // 2. Admin path
    if (isAdminChat(chatId)) {
      const handled = await handleAdminMessage(chatId, text);
      if (handled) return NextResponse.json({ ok: true });
      // Fall through to default behavior if admin types regular text without
      // active reply state and no command — they might just chat with the bot.
    }

    // 3. /stop blacklist
    if (text.toLowerCase() === '/stop') {
      const payload = await getPayloadClient();
      await payload
        .create({
          collection: 'client-blacklist',
          data: {
            phone: `telegram:${chatId}`,
            reason: 'stop_command',
            addedAt: new Date().toISOString(),
          } as any,
        })
        .catch(() => {});
      await sendTelegramMessage(
        chatId,
        'Записали. Більше не турбуємо розсилками. Якщо знадобимось — пишіть.',
      );
      return NextResponse.json({ ok: true });
    }

    // 4. Customer deep-link from order success page: /start order_F-XXX
    const startMatch = text.match(/^\/start\s+order_([A-Z0-9-]+)$/i);
    if (startMatch) {
      // Accept both new F-YYMMDD-NNN and legacy FL-YYYYMMDD-XXXXX formats verbatim.
      const orderNumber = startMatch[1].toUpperCase();
      const result = await linkOrderToTelegramChat({
        orderNumber,
        chatId,
        fromName,
        fromUsername,
      });
      if (!result.ok) {
        await sendTelegramMessage(
          chatId,
          `Замовлення ${orderNumber} не знайдено. Перевірте номер або зв'яжіться з нами через сайт.`,
        );
      } else {
        await sendTelegramMessage(chatId, result.orderSummary ?? 'Замовлення прийнято.');
        // Send the prepayment / payment-method follow-up
        const order = await findOrderByNumber(orderNumber);
        if (order) {
          const prep = await buildPrepaymentPrompt(order);
          await sendTelegramMessageWithButtons(chatId, prep.text, prep.buttons);
        }
        // Notify admin that customer linked themselves
        await notifyAdminCustomerLinked(orderNumber, chatId, fromName, fromUsername);
      }
      return NextResponse.json({ ok: true });
    }

    // 4b. Deep-link from a bouquet card: /start bouquet_<slug>
    // The website's "Запитати в чаті → Telegram" button on bouquet cards
    // generates this. We persist a per-conversation entryContext so the
    // very next AI turn knows which bouquet the customer is asking about.
    const bouquetMatch = text.match(/^\/start\s+bouquet_([a-z0-9-]+)$/i);
    if (bouquetMatch) {
      const slug = bouquetMatch[1].toLowerCase();
      const handled = await handleBouquetDeepLink({ slug, chatId, fromName, fromUsername });
      if (handled) return NextResponse.json({ ok: true });
      // fall through to plain /start handler if bouquet not found
    }

    // 5. Plain /start without payload
    if (text.toLowerCase() === '/start') {
      await sendTelegramMessage(chatId, 'Я АІ-помічник сайту florenza-irpin.com');
      return NextResponse.json({ ok: true });
    }

    // 6. Customer typed an order number (F-YYMMDD-NNN or legacy FL-...) — try to link
    const numMatch = text.match(/^(F-\d{6}-\d{3}|FL-\d{8}-[A-Z0-9]{5})$/i);
    if (numMatch) {
      const result = await linkOrderToTelegramChat({
        orderNumber: numMatch[1].toUpperCase(),
        chatId,
        fromName,
        fromUsername,
      });
      if (result.ok) {
        await sendTelegramMessage(chatId, result.orderSummary ?? 'Привʼязали.');
        const order = await findOrderByNumber(numMatch[1].toUpperCase());
        if (order) {
          const prep = await buildPrepaymentPrompt(order);
          await sendTelegramMessageWithButtons(chatId, prep.text, prep.buttons);
        }
        await notifyAdminCustomerLinked(
          numMatch[1].toUpperCase(),
          chatId,
          fromName,
          fromUsername,
        );
      } else {
        await sendTelegramMessage(
          chatId,
          'Замовлення з таким номером не знайдено. Перевірте чи правильно скопійовано.',
        );
      }
      return NextResponse.json({ ok: true });
    }

    // 7. If this chat is linked to a customer with an order — relay
    //    the message to admin instead of bouncing through Лія.
    const linkedCustomer = await findCustomerByTelegramChatId(chatId);
    if (linkedCustomer) {
      const latestOrder = await findLatestOrderForCustomer(linkedCustomer.id);
      await forwardCustomerMessageToAdmin({
        customer: linkedCustomer,
        orderNumber: latestOrder?.orderNumber,
        text,
        fromName,
        fromUsername,
        customerChatId: chatId,
      });
      await sendTelegramMessage(
        chatId,
        '✅ Передали повідомлення менеджеру — відповімо щойно прочитаємо.',
      );
      return NextResponse.json({ ok: true });
    }

    // 8. Default for unlinked chats: pass to Лія (window-shoppers etc.)
    const stopTyping = startTypingHeartbeat(chatId);
    let result;
    try {
      result = await handleIncomingMessage({
        channel: 'telegram',
        externalId: chatId,
        customerName: fromName,
        customerTelegramChatId: chatId,
        text,
        isVoiceTranscript: false,
        attachments: [],
      });
    } finally {
      stopTyping();
    }

    if (result?.text) {
      await sendTelegramMessage(chatId, result.text);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[telegram webhook] error:', e);
    return NextResponse.json({ ok: true });
  }
}

/**
 * Admin commands: /order FL-X, /find, /reply <text>, free text in reply state.
 * Returns true if handled, false to fall through.
 */
async function handleAdminMessage(adminChatId: string, text: string): Promise<boolean> {
  // Active reply state — relay text to customer
  const awaitingOrderNumber = getAdminAwaitingReply(adminChatId);
  if (awaitingOrderNumber && !text.startsWith('/')) {
    const order = await findOrderByNumber(awaitingOrderNumber);
    const customer = order?.customer && typeof order.customer === 'object' ? order.customer : null;
    const customerChatId = customer?.telegramChatId;
    if (!customerChatId) {
      await sendTelegramMessage(
        adminChatId,
        `❌ Клієнт замовлення ${awaitingOrderNumber} ще не привʼязав свій Telegram. Зателефонуйте: <code>${order?.buyerPhone ?? '—'}</code>`,
      );
      clearAdminAwaitingReply(adminChatId);
      return true;
    }
    try {
      await sendToCustomerChat(customerChatId, text);
      await sendTelegramMessage(
        adminChatId,
        `✅ Передано клієнту ${order?.buyerName ?? ''} (${awaitingOrderNumber})`,
      );
    } catch (e) {
      await sendTelegramMessage(
        adminChatId,
        `❌ Не вдалось доставити: ${(e as Error).message}`,
      );
    }
    clearAdminAwaitingReply(adminChatId);
    return true;
  }

  // /order FL-X
  const orderCmd = text.match(/^\/order\s+(\S+)/i);
  if (orderCmd) {
    const orderNumber = orderCmd[1].toUpperCase();
    const order = await findOrderByNumber(orderNumber);
    if (!order) {
      await sendTelegramMessage(adminChatId, `Замовлення ${orderNumber} не знайдено.`);
      return true;
    }
    const customer = order.customer && typeof order.customer === 'object' ? order.customer : null;
    await sendTelegramMessageWithButtons(
      adminChatId,
      formatAdminOrderDetails(order, customer),
      [
        [
          {
            text: customer?.telegramChatId ? '💬 Написати клієнту' : '📞 Телефон (TG не привʼязаний)',
            callback_data: customer?.telegramChatId
              ? `reply:${orderNumber}`
              : `phone:${orderNumber}`,
          },
        ],
      ],
    );
    return true;
  }

  // /find — prompt for number
  if (text.toLowerCase() === '/find' || text.toLowerCase() === '/order') {
    await sendTelegramMessage(
      adminChatId,
      'Введіть номер замовлення: <code>/order FL-YYYYMMDD-XXXXX</code>',
    );
    return true;
  }

  // /help
  if (text.toLowerCase() === '/help' || text.toLowerCase() === '/start') {
    await sendTelegramMessage(
      adminChatId,
      [
        '<b>Команди адміна:</b>',
        '<code>/order FL-...</code> — деталі замовлення + кнопка відповіді',
        '<code>/find</code> — підказка по пошуку',
        '<code>/cancel</code> — скасувати поточну дію',
        '',
        'Коли отримуєте сповіщення про нове замовлення — на ньому є кнопка «Відповісти клієнту».',
      ].join('\n'),
    );
    return true;
  }

  if (text.toLowerCase() === '/cancel') {
    clearAdminAwaitingReply(adminChatId);
    await sendTelegramMessage(adminChatId, 'OK, скасовано.');
    return true;
  }

  return false;
}

async function handleCallbackQuery(cb: any) {
  const callbackId = cb.id;
  const data: string = cb.data ?? '';
  const fromChatId = String(cb.from.id);
  const [action, ...rest] = data.split(':');

  // Customer-side actions (work for any chatId)
  if (action === 'pay') {
    // pay:FL-X:50 or pay:FL-X:100
    const orderNumber = rest[0];
    const share = rest[1] === '100' ? 100 : 50;
    await answerCallbackQuery(callbackId, 'Створюємо посилання на оплату…');
    const result = await createPaymentLinkForOrder(orderNumber, share as 50 | 100);
    if ('error' in result) {
      await sendTelegramMessage(
        fromChatId,
        `❌ Не вдалось створити посилання: ${result.error}. Напишіть нам у цей чат — допоможемо.`,
      );
      return;
    }
    await sendTelegramMessageWithButtons(
      fromChatId,
      [
        `<b>💳 Оплата ${result.amount} грн</b>`,
        `Замовлення: <b>${orderNumber}</b>`,
        '',
        'Натисніть кнопку — відкриється безпечна сторінка Monobank.',
        '<i>Посилання дійсне 24 години.</i>',
      ].join('\n'),
      [[{ text: `Оплатити ${result.amount} грн →`, url: result.url }]],
    );
    return;
  }

  // Admin-only actions below
  if (!isAdminChat(fromChatId)) {
    await answerCallbackQuery(callbackId, 'Доступно тільки адміну.');
    return;
  }
  const adminChatId = fromChatId;

  if (action === 'reply') {
    const orderNumber = rest.join(':');
    const order = await findOrderByNumber(orderNumber);
    const customer = order?.customer && typeof order.customer === 'object' ? order.customer : null;
    if (!customer?.telegramChatId) {
      await answerCallbackQuery(callbackId, 'Клієнт ще не привʼязав Telegram');
      await sendTelegramMessage(
        adminChatId,
        `Клієнт замовлення ${orderNumber} не привʼязав Telegram. Зателефонуйте: <code>${order?.buyerPhone ?? '—'}</code>`,
      );
      return;
    }
    setAdminAwaitingReply(adminChatId, orderNumber);
    await answerCallbackQuery(callbackId, 'Введіть текст відповіді');
    await sendTelegramMessage(
      adminChatId,
      `✏️ Наступне ваше повідомлення буде надіслано клієнту замовлення <b>${orderNumber}</b>.\nЩоб скасувати — <code>/cancel</code>.`,
    );
    return;
  }

  if (action === 'phone') {
    const orderNumber = rest.join(':');
    const order = await findOrderByNumber(orderNumber);
    await answerCallbackQuery(
      callbackId,
      order?.buyerPhone ? `Телефон: ${order.buyerPhone}` : 'Без телефону',
    );
    return;
  }

  await answerCallbackQuery(callbackId, '');
}

async function notifyAdminCustomerLinked(
  orderNumber: string,
  chatId: string,
  fromName?: string,
  fromUsername?: string,
) {
  const adminId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminId) return;

  // Look up the original order alert message_id so this follow-up threads
  // as a reply to the new-order alert in the admin chat.
  let replyToMessageId: number | undefined;
  try {
    const { findOrderByNumber: _find } = await import('@/lib/messengers/telegram-commands');
    const order: any = await _find(orderNumber);
    if (order?.adminAlertMessageId) replyToMessageId = order.adminAlertMessageId;
  } catch {
    /* ignore */
  }

  const handle = fromUsername ? `@${fromUsername}` : '';
  await sendTelegramMessageWithButtons(
    adminId,
    [
      `🔗 Клієнт привʼязав Telegram до замовлення <b>${orderNumber}</b>`,
      `Імʼя: ${fromName ?? '—'} ${handle}`,
      `Chat ID: <code>${chatId}</code>`,
      '',
      'Тепер ви можете писати йому через бота.',
    ].join('\n'),
    [[{ text: '💬 Написати клієнту', callback_data: `reply:${orderNumber}` }]],
    { useAdminBot: true, replyToMessageId },
  ).catch((e) => console.error('[notifyAdminCustomerLinked]', e));
}

/**
 * Customer arrived from a bouquet card via /start bouquet_<slug>.
 * Persists entryContext on the conversation so Liya's first reply
 * already knows which bouquet they were looking at, then sends a
 * tailored welcome.
 */
async function handleBouquetDeepLink(args: {
  slug: string;
  chatId: string;
  fromName: string;
  fromUsername?: string;
}): Promise<boolean> {
  const { slug, chatId } = args;
  const payload = await getPayloadClient();
  const r = await payload.find({
    collection: 'bouquets',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  });
  const bouquet = r.docs[0] as any;
  if (!bouquet) return false;

  // Find or create conversation and write entryContext.
  const existing = await payload.find({
    collection: 'conversations',
    where: {
      and: [
        { channel: { equals: 'telegram' } },
        { externalId: { equals: chatId } },
      ],
    },
    limit: 1,
  });
  const entryContext = {
    intent: 'question',
    source: 'web_card',
    bouquetSlug: bouquet.slug,
    bouquetId: String(bouquet.id),
    bouquetName: bouquet.name,
  };
  if (existing.docs[0]) {
    await payload.update({
      collection: 'conversations',
      id: existing.docs[0].id,
      data: { entryContext, firstTurnHandled: false } as any,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: 'conversations',
      data: {
        channel: 'telegram',
        externalId: chatId,
        status: 'active',
        entryContext,
        firstTurnHandled: false,
      } as any,
      overrideAccess: true,
    });
  }

  await sendTelegramMessage(
    chatId,
    [
      `Бачу, ви цікавитесь букетом <b>«${bouquet.name}»</b> 🌿`,
      '',
      `Ціна: <b>${bouquet.price} грн</b>`,
      bouquet.descriptionShort ? '' : null,
      bouquet.descriptionShort ?? null,
      '',
      'Що цікавить — склад, доставка, оформити замовлення? Я Лія, відповім одразу.',
    ]
      .filter((x) => x !== null)
      .join('\n'),
  );
  return true;
}
