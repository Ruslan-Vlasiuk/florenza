import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

async function lookupBouquet(payload: any, idOrSlug: string): Promise<any | null> {
  if (!idOrSlug) return null;
  const numeric = Number(idOrSlug);
  if (Number.isFinite(numeric)) {
    try {
      return await payload.findByID({ collection: 'bouquets', id: numeric });
    } catch {/* fall through to slug lookup */}
  }
  const r = await payload.find({
    collection: 'bouquets',
    where: { slug: { equals: String(idOrSlug) } },
    limit: 1,
  });
  return r.docs[0] ?? null;
}

async function lookupZone(payload: any, idOrSlug: string): Promise<any | null> {
  if (!idOrSlug) return null;
  const numeric = Number(idOrSlug);
  if (Number.isFinite(numeric)) {
    try {
      return await payload.findByID({ collection: 'delivery-zones', id: numeric });
    } catch {/* fall through */}
  }
  const r = await payload.find({
    collection: 'delivery-zones',
    where: { slug: { equals: String(idOrSlug) } },
    limit: 1,
  });
  return r.docs[0] ?? null;
}

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

    // Robust lookup: AI sometimes passes the slug instead of the numeric id.
    // Try id first, fall back to slug; same for delivery zone.
    const bouquet = (await lookupBouquet(payload, input.bouquet_id)) as any;
    if (!bouquet) {
      return {
        error: true,
        message: `Букет ${input.bouquet_id} не знайдено. Викликай search_bouquets або get_bouquet_details щоб дістати правильний bouquet_id.`,
      };
    }
    const zone = (await lookupZone(payload, input.delivery_zone_id)) as any;
    if (!zone) {
      return {
        error: true,
        message: `Зону доставки ${input.delivery_zone_id} не знайдено. Викликай get_delivery_zones.`,
      };
    }

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
