import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const searchBouquets: ToolDef = {
  name: 'search_bouquets',
  description:
    'Шукає букети в каталозі за фільтрами. Повертає список з 3–10 кращими варіантами з посиланнями. Використовуй коли клієнт описує що він шукає.',
  input_schema: {
    type: 'object',
    properties: {
      budget_min: { type: 'number', description: 'Мінімальний бюджет, грн' },
      budget_max: { type: 'number', description: 'Максимальний бюджет, грн' },
      flower_slug: {
        type: 'string',
        description: 'Slug головної квітки: troyandy, pivonii, khryzantemy, tyulpany, sezonni, тощо',
      },
      occasion_slug: {
        type: 'string',
        description: 'Slug приводу: den-narodzhennya, 8-bereznya, richnytsia, тощо',
      },
      type_slug: {
        type: 'string',
        description: 'Slug типу: avtorski, monobukety, kompozytsiyi, podarunky, тощо',
      },
      emotional_tone: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['gentle', 'bold', 'classic', 'minimal', 'lush', 'natural'],
        },
      },
      for_whom: { type: 'string', enum: ['female', 'male', 'neutral'] },
      available_today: {
        type: 'boolean',
        description: 'true — тільки ті, що готуються за <2 годин',
      },
      limit: { type: 'number', default: 5 },
    },
    required: [],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();
    const where: any = { status: { equals: 'published' } };

    if (input.budget_min !== undefined || input.budget_max !== undefined) {
      where.price = {};
      if (input.budget_min !== undefined) where.price.greater_than_equal = input.budget_min;
      if (input.budget_max !== undefined) where.price.less_than_equal = input.budget_max;
    }

    if (input.available_today) {
      where.preparationHours = { less_than_equal: 2 };
    }

    if (input.flower_slug) {
      const flower = await payload.find({
        collection: 'flowers',
        where: { slug: { equals: input.flower_slug } },
        limit: 1,
      });
      if (flower.docs[0]) where.mainFlower = { equals: flower.docs[0].id };
    }

    if (input.occasion_slug) {
      const occ = await payload.find({
        collection: 'occasions',
        where: { slug: { equals: input.occasion_slug } },
        limit: 1,
      });
      if (occ.docs[0]) where.occasions = { contains: occ.docs[0].id };
    }

    if (input.type_slug) {
      const type = await payload.find({
        collection: 'categories-type',
        where: { slug: { equals: input.type_slug } },
        limit: 1,
      });
      if (type.docs[0]) where.type = { equals: type.docs[0].id };
    }

    if (input.emotional_tone?.length) {
      where.emotionalTone = { in: input.emotional_tone };
    }

    if (input.for_whom) {
      where.forWhom = { equals: input.for_whom };
    }

    const result = await payload.find({
      collection: 'bouquets',
      where,
      limit: input.limit ?? 5,
      depth: 1,
    });

    return {
      count: result.totalDocs,
      bouquets: result.docs.map((b: any) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        price: b.price,
        discountActive: b.discount?.enabled === true,
        priceWithDiscount: b.discount?.enabled
          ? b.discount.type === 'percent'
            ? Math.round(b.price * (1 - b.discount.amount / 100))
            : b.price - (b.discount.amount ?? 0)
          : b.price,
        url: `https://florenza-irpin.com/buket/${b.slug}`,
        descriptionShort: b.descriptionShort,
        emotionalTone: b.emotionalTone,
        preparationHours: b.preparationHours,
      })),
    };
  },
};
