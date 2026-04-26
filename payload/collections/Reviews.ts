import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'authorName',
    group: 'Контент',
    description: 'Відгуки клієнтів. Власні + auto-pull з Google Business Profile.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'authorName', type: 'text', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
    { name: 'content', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Фото від клієнта' },
    { name: 'bouquetReference', type: 'relationship', relationTo: 'bouquets',
      label: "Прив'язаний букет" },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Власний сайт', value: 'website' },
        { label: 'Google Business Profile', value: 'gbp' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
        { label: 'Демо', value: 'demo' },
      ],
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: true },
    { name: 'isFeatured', type: 'checkbox', label: 'Featured (на головній)', defaultValue: false },
    { name: 'submittedAt', type: 'date' },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
};
