import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';
import { sendNewOrderAdminAlert } from '../../messengers/order-alert';
import {
  buildPrepaymentPrompt,
  sendTelegramMessageWithButtons,
} from '../../messengers/telegram-commands';
import { setCustomerTelegram } from '../../payments/order-db';

export const createPendingOrder: ToolDef = {
  name: 'create_pending_order',
  description:
    'Створює замовлення зі статусом "очікує оплати". Повертає orderId і orderNumber. Викликай тільки коли всі дані зібрані.',
  input_schema: {
    type: 'object',
    properties: {
      bouquet_id: { type: 'string' },
      buyer_phone: { type: 'string' },
      buyer_name: { type: 'string' },
      recipient_name: { type: 'string' },
      recipient_phone: { type: 'string' },
      delivery_zone_id: { type: 'string' },
      address_street: { type: 'string' },
      address_building: { type: 'string' },
      address_apartment: { type: 'string' },
      address_floor: { type: 'string' },
      address_intercom: { type: 'string' },
      courier_instructions: { type: 'string' },
      delivery_date: { type: 'string', description: 'YYYY-MM-DD' },
      delivery_slot: { type: 'string' },
      is_urgent: { type: 'boolean', default: false },
      is_anonymous: { type: 'boolean', default: false },
      card_message: { type: 'string' },
      total_amount: { type: 'number' },
      subtotal: { type: 'number' },
      discount_amount: { type: 'number' },
      delivery_fee: { type: 'number' },
      liya_notes: { type: 'string', description: 'Нотатки з контексту діалогу для менеджера' },
    },
    required: [
      'bouquet_id',
      'buyer_phone',
      'recipient_name',
      'delivery_zone_id',
      'address_street',
      'address_building',
      'delivery_date',
      'delivery_slot',
      'total_amount',
    ],
  },
  handler: async (input, ctx) => {
    const payload = await getPayloadClient();

    // Resolve bouquet by id OR slug OR name — AI passes any of the three.
    let bouquetIdNum = Number(input.bouquet_id);
    if (!Number.isFinite(bouquetIdNum)) {
      const raw = String(input.bouquet_id).trim();
      // Try slug first
      const slugTry = await payload.find({
        collection: 'bouquets',
        where: { slug: { equals: raw.toLowerCase() } },
        limit: 1,
        overrideAccess: true,
      });
      if (slugTry.docs[0]) {
        bouquetIdNum = Number(slugTry.docs[0].id);
      } else {
        // Fallback: case-insensitive name match
        const stripQuotes = raw.replace(/^[«»"'`]|[«»"'`]$/g, '').trim();
        const nameTry = await payload.find({
          collection: 'bouquets',
          where: { name: { like: stripQuotes } },
          limit: 1,
          overrideAccess: true,
        });
        if (nameTry.docs[0]) bouquetIdNum = Number(nameTry.docs[0].id);
      }
    }
    if (!Number.isFinite(bouquetIdNum)) {
      return {
        error: true,
        message: `Букет ${input.bouquet_id} не знайдено (ні по id, ні по slug). Викличи search_bouquets щоб дістати правильний bouquet_id.`,
      };
    }
    // Same for zone
    let deliveryZoneIdNum: number | undefined;
    if (input.delivery_zone_id) {
      const num = Number(input.delivery_zone_id);
      if (Number.isFinite(num)) {
        deliveryZoneIdNum = num;
      } else {
        const r = await payload.find({
          collection: 'delivery-zones',
          where: { slug: { equals: String(input.delivery_zone_id) } },
          limit: 1,
          overrideAccess: true,
        });
        if (r.docs[0]) deliveryZoneIdNum = Number(r.docs[0].id);
      }
    }
    const conversationIdNum =
      typeof ctx.conversationId === 'number'
        ? ctx.conversationId
        : Number(ctx.conversationId);

    // Find or create customer
    const customer = await payload.find({
      collection: 'customers',
      where: { phone: { equals: input.buyer_phone } },
      limit: 1,
      overrideAccess: true,
    });
    const customerId = customer.docs[0]?.id ?? (
      await payload.create({
        collection: 'customers',
        overrideAccess: true,
        data: {
          phone: input.buyer_phone,
          name: input.buyer_name,
          preferredChannel: ctx.channel,
        } as any,
      })
    ).id;

    // Bouquet snapshot
    const bouquet = (await payload.findByID({
      collection: 'bouquets',
      id: bouquetIdNum,
      overrideAccess: true,
    })) as any;

    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        status: 'pending_payment',
        bouquet: bouquetIdNum,
        bouquetSnapshot: {
          name: bouquet.name,
          price: bouquet.price,
          composition: bouquet.composition,
          imageUrl: bouquet.primaryImage,
        },
        subtotal: input.subtotal ?? bouquet.price,
        discountAmount: input.discount_amount ?? 0,
        deliveryFee: input.delivery_fee ?? 0,
        totalAmount: input.total_amount,
        customer: customerId,
        buyerName: input.buyer_name,
        buyerPhone: input.buyer_phone,
        recipientName: input.recipient_name,
        recipientPhone: input.recipient_phone,
        isAnonymous: input.is_anonymous ?? false,
        ...(deliveryZoneIdNum && Number.isFinite(deliveryZoneIdNum)
          ? { deliveryZone: deliveryZoneIdNum }
          : {}),
        addressStreet: input.address_street,
        addressBuilding: input.address_building,
        addressApartment: input.address_apartment,
        addressFloor: input.address_floor,
        addressIntercom: input.address_intercom,
        courierInstructions: input.courier_instructions,
        deliveryDate: input.delivery_date,
        deliverySlot: input.delivery_slot,
        isUrgent: input.is_urgent ?? false,
        cardMessage: input.card_message,
        conversation: conversationIdNum,
        createdBy: 'liya',
        liyaNotes: input.liya_notes,
      } as any,
    });

    // Determine sandbox mode (mirrors /api/orders behavior)
    const brandSettings: any = await payload
      .findGlobal({ slug: 'brand-settings' as any })
      .catch(() => ({}));
    const isSandbox = brandSettings?.paymentMode !== 'production';

    // Notify admin — always, regardless of channel (was missing before:
    // Лія-created orders silently went to DB without admin alert)
    await sendNewOrderAdminAlert({
      orderId: order.id,
      isSandbox,
      source: ctx.channel === 'telegram' ? 'liya_telegram' : 'liya_web_chat',
      prepaymentRequired: true, // Лія orders default to 50% prepayment
    });

    const orderNumber = (order as any).orderNumber;
    const tgDeepLink = `https://t.me/FLORENZA_irpin_bot?start=order_${orderNumber}`;

    // If the customer is talking to us in Telegram already — push the Mono
    // pay button right after the order is created. Without this, Liya tells
    // them "press the button below" but no button is ever rendered, because
    // the bot only attaches buttons via the `/start order_X` deep-link flow.
    if (ctx.channel === 'telegram' && ctx.externalId) {
      try {
        // Link this TG chat to the customer record so subsequent payment
        // webhooks (Mono success) know where to deliver the receipt.
        await setCustomerTelegram({
          customerId: customerId as any,
          telegramChatId: ctx.externalId,
          name: input.buyer_name,
        });
        const prep = await buildPrepaymentPrompt(order as any);
        await sendTelegramMessageWithButtons(ctx.externalId, prep.text, prep.buttons);
      } catch (e) {
        console.error('[create_pending_order] failed to send TG pay button:', e);
        // Non-fatal — admin still notified, customer can /start order_X manually
      }
    }

    const halfAmount = Math.round(input.total_amount / 2);

    return {
      orderId: order.id,
      orderNumber,
      status: 'pending_payment',
      tgDeepLink,
      message:
        ctx.channel === 'telegram'
          ? `Замовлення створено: ${orderNumber}. Кнопку оплати вже надіслано клієнту окремим повідомленням ПЕРЕД цим. Скажи коротко (БЕЗ запиту даних, БЕЗ особистих імен, БЕЗ генерації будь-яких посилань): "Замовлення прийнято — ${orderNumber} ✅ Сума ${input.total_amount} грн. Передоплата 50% (${halfAmount} грн) — кнопка для оплати в попередньому повідомленні ↑. Решта при доставці. Кур'єр приїде в обраний слот."`
          : `Замовлення створено: ${orderNumber}. Скажи клієнту коротко (БЕЗ створення Mono-посилань — тільки TG): "Замовлення прийнято — ${orderNumber} ✅ Сума ${input.total_amount} грн. Передоплата 50% (${halfAmount} грн). Перейдіть у наш Telegram-бот: ${tgDeepLink} — там одна кнопка для оплати. Решта 50% при доставці." Не вживай особистих імен. НЕ генеруй жодних інших посилань. Завершуй розмову.`,
    };
  },
};
