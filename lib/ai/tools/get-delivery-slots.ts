import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const getDeliverySlots: ToolDef = {
  name: 'get_delivery_slots',
  description:
    'Доступні часові слоти на конкретну дату. Показує вільні (з урахуванням ємності і вже оформлених заказів).',
  input_schema: {
    type: 'object',
    properties: {
      date: { type: 'string', description: 'YYYY-MM-DD' },
      zone_slug: { type: 'string', description: 'Опційно: фільтр по зоні' },
      urgent: { type: 'boolean', description: 'Чи треба термінова (60–90 хв)' },
    },
    required: ['date'],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();
    const date = new Date(input.date);
    const dow = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getUTCDay()];

    const slots = await payload.find({
      collection: 'delivery-slots',
      where: {
        and: [
          { isActive: { equals: true } },
          { daysOfWeek: { contains: dow } },
        ],
      },
      limit: 50,
      sort: 'sortOrder',
    });

    // For each slot, count current orders on that date in that slot
    const orders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { deliveryDate: { equals: input.date } },
          { status: { not_in: ['cancelled'] } },
        ],
      },
      limit: 1000,
    });

    const slotsWithAvailability = slots.docs.map((s: any) => {
      const ordersInSlot = orders.docs.filter(
        (o: any) => o.deliverySlot === s.label,
      ).length;
      return {
        label: s.label,
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: s.capacity,
        booked: ordersInSlot,
        available: ordersInSlot < s.capacity,
      };
    });

    return {
      date: input.date,
      slots: slotsWithAvailability,
      urgentAvailable: input.urgent ? true : undefined, // Лія перевіряє через check_today_availability
    };
  },
};
