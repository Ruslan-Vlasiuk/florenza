import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const getDeliveryZones: ToolDef = {
  name: 'get_delivery_zones',
  description: 'Список активних зон доставки з тарифами.',
  input_schema: { type: 'object', properties: {} },
  handler: async (_input, _ctx) => {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'delivery-zones',
      where: { isActive: { equals: true } },
      limit: 100,
    });
    return {
      zones: r.docs.map((z: any) => ({
        name: z.name,
        tariff: z.tariff,
        freeFromAmount: z.freeFromAmount,
        timeFrom: z.timeFrom,
        timeTo: z.timeTo,
        urgentAvailable: z.urgentAvailable,
        urgentSurcharge: z.urgentSurcharge,
        areas: (z.areas ?? []).map((a: any) => a.place),
      })),
    };
  },
};
