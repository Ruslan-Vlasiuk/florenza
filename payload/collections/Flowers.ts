import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const Flowers: CollectionConfig = {
  slug: 'flowers',
  labels: { singular: 'Квітка', plural: '🌷 Квіти' },
  admin: {
    useAsTitle: 'name',
    group: '🌸 Каталог',
    description: 'Троянди, півонії, хризантеми, тюльпани тощо.',
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
      label: 'Editorial-опис квітки',
      admin: { description: 'Характер, сезон, історія, поєднання' },
    },
    {
      name: 'seasonality',
      type: 'group',
      label: 'Сезонність',
      fields: [
        { name: 'yearRound', type: 'checkbox', label: 'Цілорічна', defaultValue: false },
        { name: 'fromMonth', type: 'number', label: 'Доступна з місяця (1–12)', min: 1, max: 12 },
        { name: 'toMonth', type: 'number', label: 'Доступна до місяця (1–12)', min: 1, max: 12 },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Фото квітки' },
    { name: 'metaTitle', type: 'text', label: 'Meta title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta description' },
    { name: 'isDemo', type: 'checkbox', label: 'Демо', defaultValue: false },
  ],
};
