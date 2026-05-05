import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const DeliverySettings: GlobalConfig = {
  slug: 'delivery-settings',
  label: '🚚 Доставка — правила',
  admin: { group: '⚙️ Налаштування' },
  access: { read: publicRead, update: isAdmin },
  fields: [
    {
      name: 'urgentDeliveryDefault',
      type: 'group',
      label: 'Термінова доставка (за замовчуванням)',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'minMinutes', type: 'number', defaultValue: 60 },
        { name: 'maxMinutes', type: 'number', defaultValue: 90 },
        { name: 'surcharge', type: 'number', defaultValue: 150 },
        { name: 'cutoffTime', type: 'text', defaultValue: '19:00',
          admin: { description: 'Останній час прийому термінових замовлень' } },
      ],
    },
    {
      name: 'standardDelivery',
      type: 'group',
      label: 'Стандартна доставка',
      fields: [
        { name: 'todayCutoff', type: 'text', defaultValue: '19:00' },
        { name: 'workingHoursFrom', type: 'text', defaultValue: '09:00' },
        { name: 'workingHoursTo', type: 'text', defaultValue: '21:00' },
      ],
    },
    {
      name: 'freeDeliveryRadius',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'radiusKm', type: 'number', defaultValue: 1 },
        { name: 'description', type: 'text', defaultValue: 'Безкоштовна доставка в радіусі 1 км від магазину' },
      ],
    },
    {
      name: 'holidayBlackouts',
      type: 'array',
      label: 'Календар винятків (вихідні, святкові паузи)',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'reason', type: 'text' },
        { name: 'mode', type: 'select',
          options: [
            { label: 'Закрито повністю', value: 'closed' },
            { label: 'Тільки прийом на завтра', value: 'tomorrow_only' },
            { label: 'Скорочений графік', value: 'short_hours' },
          ],
        },
      ],
    },
    {
      name: 'holidayMode',
      type: 'group',
      label: 'Святковий режим (8 березня, 14 лютого тощо)',
      fields: [
        { name: 'active', type: 'checkbox', defaultValue: false },
        { name: 'name', type: 'text' },
        { name: 'extendedCutoff', type: 'text', label: 'Розширений cutoff (напр. "23:00")' },
        { name: 'capacityMultiplier', type: 'number', defaultValue: 2,
          admin: { description: 'У скільки разів збільшити ємність слотів' } },
      ],
    },
  ],
};
