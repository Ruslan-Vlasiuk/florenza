import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const DeliverySlots: CollectionConfig = {
  slug: 'delivery-slots',
  admin: {
    useAsTitle: 'label',
    group: 'Доставка',
    description: 'Стандартні часові слоти на день.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'label', type: 'text', label: 'Назва (для UI)', required: true,
      admin: { description: 'напр. "10:00–12:00"' } },
    { name: 'startTime', type: 'text', label: 'Початок (HH:MM)', required: true },
    { name: 'endTime', type: 'text', label: 'Кінець (HH:MM)', required: true },
    { name: 'capacity', type: 'number', label: 'Ємність (макс заказів у слоті)', defaultValue: 5 },
    {
      name: 'daysOfWeek',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Пн', value: 'mon' },
        { label: 'Вт', value: 'tue' },
        { label: 'Ср', value: 'wed' },
        { label: 'Чт', value: 'thu' },
        { label: 'Пт', value: 'fri' },
        { label: 'Сб', value: 'sat' },
        { label: 'Нд', value: 'sun' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
};
