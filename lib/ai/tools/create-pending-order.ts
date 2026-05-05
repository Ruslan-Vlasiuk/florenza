import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

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

    // Payload+Postgres relationships expect numeric IDs.
    const bouquetIdNum = Number(input.bouquet_id);
    if (!Number.isFinite(bouquetIdNum)) {
      return {
        error: true,
        message: `Невалідний bouquet_id: ${input.bouquet_id}. Викличу escalate_to_human.`,
      };
    }
    const deliveryZoneIdNum = input.delivery_zone_id
      ? Number(input.delivery_zone_id)
      : undefined;
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

    return {
      orderId: order.id,
      orderNumber: (order as any).orderNumber,
      status: 'pending_payment',
      message: `Замовлення створено: ${(order as any).orderNumber}, до оплати ${input.total_amount} грн`,
    };
  },
};
