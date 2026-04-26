import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const saveClientPreference: ToolDef = {
  name: 'save_client_preference',
  description:
    'Зберігає важливу преференцію клієнта (улюблені квіти, важливі дати, не любить конкретні запахи). Використовуй якщо клієнт явно сказав щось важливе про себе.',
  input_schema: {
    type: 'object',
    properties: {
      customer_phone: { type: 'string' },
      key: { type: 'string', description: 'напр. "favorite_flowers", "mother_birthday"' },
      value: { type: 'string', description: 'Значення преференції' },
    },
    required: ['customer_phone', 'key', 'value'],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'customers',
      where: { phone: { equals: input.customer_phone } },
      limit: 1,
    });
    const customer: any = r.docs[0];
    if (!customer) return { error: true, message: 'Клієнт не знайдений' };

    const existing = customer.preferences ?? [];
    existing.push({
      key: input.key,
      value: input.value,
      savedAt: new Date().toISOString(),
    });

    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: { preferences: existing },
    });

    return { saved: true };
  },
};
