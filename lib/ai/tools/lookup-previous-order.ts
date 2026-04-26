import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const lookupPreviousOrder: ToolDef = {
  name: 'lookup_previous_order',
  description:
    'Шукає попередні замовлення клієнта (за телефоном замовника або отримувача). Використовуй для real-time повторного адресата: "Я бачу, букет знову для Світлани на ту ж адресу. Повторити?"',
  input_schema: {
    type: 'object',
    properties: {
      phone: { type: 'string', description: 'Телефон для пошуку' },
      recipient_name: { type: 'string', description: "Опційно: ім'я отримувача" },
    },
    required: ['phone'],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();

    const where: any = {
      or: [
        { buyerPhone: { equals: input.phone } },
        { recipientPhone: { equals: input.phone } },
      ],
      status: { in: ['delivered', 'paid', 'in_progress'] },
    };

    if (input.recipient_name) {
      where.and = [{ recipientName: { like: input.recipient_name } }];
    }

    const orders = await payload.find({
      collection: 'orders',
      where,
      limit: 5,
      sort: '-createdAt',
      depth: 1,
    });

    return {
      count: orders.totalDocs,
      orders: orders.docs.map((o: any) => ({
        orderNumber: o.orderNumber,
        date: o.createdAt,
        recipientName: o.recipientName,
        addressShort: `${o.addressStreet} ${o.addressBuilding}`,
        bouquetName: o.bouquetSnapshot?.name,
        amount: o.totalAmount,
      })),
    };
  },
};
