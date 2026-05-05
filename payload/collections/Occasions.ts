import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const Occasions: CollectionConfig = {
  slug: 'occasions',
  labels: { singular: 'Привід', plural: '🎁 Приводи' },
  admin: {
    useAsTitle: 'name',
    group: '🌸 Каталог',
    description: 'День народження, 8 березня, річниця, випускний тощо.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Назва', required: true },
    { name: 'slug', type: 'text', label: 'Slug', required: true, unique: true },
    {
      name: 'description',
      type: 'textarea',
      label: 'Editorial-есе про привід',
      admin: { description: '~200–300 слів. Рекомендації, культурні нотатки.' },
    },
    {
      name: 'recurringDate',
      type: 'group',
      label: 'Постійна дата (для свят)',
      fields: [
        { name: 'month', type: 'number', label: 'Місяць (1–12)', min: 1, max: 12 },
        { name: 'day', type: 'number', label: 'День (1–31)', min: 1, max: 31 },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
};
