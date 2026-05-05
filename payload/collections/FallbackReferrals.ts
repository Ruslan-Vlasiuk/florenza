import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const FallbackReferrals: CollectionConfig = {
  slug: 'fallback-referrals',
  admin: {
    hidden: true,
    useAsTitle: 'specialization',
    group: 'Налаштування',
    description: 'Куди Лія перенаправляє клієнтів коли ми не робимо (наприклад, жалобна флористика).',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'specialization',
      type: 'select',
      required: true,
      options: [
        { label: 'Жалобна флористика', value: 'funeral' },
        { label: 'Регіон поза зоною доставки', value: 'out_of_zone' },
        { label: 'Майстер-класи', value: 'workshops' },
        { label: 'Підписки', value: 'subscriptions' },
        { label: 'Інше', value: 'other' },
      ],
    },
    { name: 'partnerName', type: 'text', required: true },
    { name: 'partnerContact', type: 'text', required: true,
      admin: { description: 'Telegram / телефон / сайт' } },
    { name: 'note', type: 'textarea' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};
