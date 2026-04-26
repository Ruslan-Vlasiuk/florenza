import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const calculateOrderPrice: ToolDef = {
  name: 'calculate_order_price',
  description:
    'Розраховує точну суму замовлення з знижкою + доставкою. Використовуй перш ніж створювати заказ.',
  input_schema: {
    type: 'object',
    properties: {
      bouquet_id: { type: 'string', description: 'ID букета' },
      delivery_zone_id: { type: 'string', description: 'ID зони доставки' },
      urgent_delivery: { type: 'boolean', default: false },
      extras: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
    },
    required: ['bouquet_id', 'delivery_zone_id'],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();
    const bouquet = (await payload.findByID({
      collection: 'bouquets',
      id: input.bouquet_id,
    })) as any;
    const zone = (await payload.findByID({
      collection: 'delivery-zones',
      id: input.delivery_zone_id,
    })) as any;

    const subtotal = bouquet.price;
    let discountAmount = 0;
    if (bouquet.discount?.enabled) {
      const now = new Date();
      const start = bouquet.discount.startAt ? new Date(bouquet.discount.startAt) : null;
      const end = bouquet.discount.endAt ? new Date(bouquet.discount.endAt) : null;
      const isActive = (!start || start <= now) && (!end || now <= end);
      if (isActive) {
        if (bouquet.discount.type === 'percent') {
          discountAmount = Math.round(subtotal * (bouquet.discount.amount / 100));
        } else {
          discountAmount = bouquet.discount.amount;
        }
      }
    }

    const extrasSum = (input.extras ?? []).reduce(
      (sum: number, e: any) => sum + (e.price ?? 0),
      0,
    );

    const subtotalAfterDiscount = subtotal - discountAmount + extrasSum;

    let deliveryFee = zone.tariff;
    if (subtotalAfterDiscount >= (zone.freeFromAmount ?? 3000)) {
      deliveryFee = 0;
    }
    const urgentSurcharge =
      input.urgent_delivery && zone.urgentAvailable ? zone.urgentSurcharge : 0;

    const total = subtotalAfterDiscount + deliveryFee + urgentSurcharge;

    return {
      subtotal,
      discountAmount,
      extras: extrasSum,
      deliveryFee,
      urgentSurcharge,
      total,
      breakdown: `Букет ${subtotal} грн${discountAmount > 0 ? ` − знижка ${discountAmount}` : ''}${extrasSum > 0 ? ` + додатки ${extrasSum}` : ''}${deliveryFee > 0 ? ` + доставка ${deliveryFee}` : ' + безкоштовна доставка'}${urgentSurcharge > 0 ? ` + термінова ${urgentSurcharge}` : ''} = ${total} грн`,
    };
  },
};
