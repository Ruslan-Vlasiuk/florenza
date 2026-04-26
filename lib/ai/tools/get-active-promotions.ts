import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const getActivePromotions: ToolDef = {
  name: 'get_active_promotions',
  description: 'Поточні активні знижки на букети.',
  input_schema: { type: 'object', properties: {} },
  handler: async (_input, _ctx) => {
    const payload = await getPayloadClient();
    const now = new Date().toISOString();
    const r = await payload.find({
      collection: 'bouquets',
      where: {
        and: [
          { status: { equals: 'published' } },
          { 'discount.enabled': { equals: true } },
          {
            or: [
              { 'discount.endAt': { exists: false } },
              { 'discount.endAt': { greater_than: now } },
            ],
          },
        ],
      },
      limit: 30,
    });
    return {
      count: r.totalDocs,
      bouquets: r.docs.map((b: any) => ({
        name: b.name,
        slug: b.slug,
        url: `https://florenza-irpin.com/buket/${b.slug}`,
        originalPrice: b.price,
        discountType: b.discount.type,
        discountAmount: b.discount.amount,
        finalPrice:
          b.discount.type === 'percent'
            ? Math.round(b.price * (1 - b.discount.amount / 100))
            : b.price - b.discount.amount,
        endAt: b.discount.endAt,
        campaignName: b.discount.campaignName,
      })),
    };
  },
};
