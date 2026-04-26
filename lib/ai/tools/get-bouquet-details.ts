import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const getBouquetDetails: ToolDef = {
  name: 'get_bouquet_details',
  description: 'Повертає повну інформацію про конкретний букет за slug або ID.',
  input_schema: {
    type: 'object',
    properties: {
      slug: { type: 'string' },
      id: { type: 'string' },
    },
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();
    let bouquet: any;
    if (input.slug) {
      const r = await payload.find({
        collection: 'bouquets',
        where: { slug: { equals: input.slug } },
        limit: 1,
        depth: 2,
      });
      bouquet = r.docs[0];
    } else if (input.id) {
      bouquet = await payload.findByID({
        collection: 'bouquets',
        id: input.id,
        depth: 2,
      });
    }
    if (!bouquet) return { error: true, message: 'Букет не знайдено' };

    return {
      id: bouquet.id,
      name: bouquet.name,
      slug: bouquet.slug,
      price: bouquet.price,
      composition: bouquet.composition,
      descriptionShort: bouquet.descriptionShort,
      preparationHours: bouquet.preparationHours,
      size: bouquet.size,
      seasonality: bouquet.seasonality,
      url: `https://florenza-irpin.com/buket/${bouquet.slug}`,
      discountActive: bouquet.discount?.enabled,
      discountEndAt: bouquet.discount?.endAt,
    };
  },
};
