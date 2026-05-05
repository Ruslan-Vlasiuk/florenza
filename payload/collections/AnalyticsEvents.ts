import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  admin: {
    hidden: true,
    group: 'Аналітика',
    description: 'Server-side analytics. IP захешований, без cookies, без third-party. GDPR-safe без banner.',
    defaultColumns: ['eventType', 'pagePath', 'createdAt'],
    pagination: { defaultLimit: 50 },
  },
  access: { read: isAdmin, create: () => true, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Pageview', value: 'pageview' },
        { label: 'Bouquet view', value: 'bouquet_view' },
        { label: 'Add to cart', value: 'add_to_cart' },
        { label: 'Begin checkout', value: 'begin_checkout' },
        { label: 'Order created', value: 'order_created' },
        { label: 'Order paid', value: 'order_paid' },
        { label: 'Chat opened', value: 'chat_opened' },
        { label: 'Chat message sent', value: 'chat_message_sent' },
        { label: 'Escalated', value: 'escalated' },
        { label: 'Form submitted', value: 'form_submitted' },
      ],
    },
    { name: 'sessionHash', type: 'text', label: 'Session hash (без user ID)', index: true },
    { name: 'ipHash', type: 'text', label: 'IP hash (SHA-256, salt-rotated, /24 truncated)', index: true },
    { name: 'pagePath', type: 'text', label: 'URL шлях', index: true },
    { name: 'referrer', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'utmSource', type: 'text', index: true },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'cityHint', type: 'text', label: 'Місто (з IP geo, ±5 км)' },
    {
      name: 'channel',
      type: 'select',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
      ],
    },
    { name: 'meta', type: 'json', label: 'Метадані події (bouquet_id, order_value, etc)' },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date().toISOString(), index: true },
  ],
  timestamps: false, // використовуємо власний createdAt
  indexes: [
    { fields: ['eventType', 'createdAt'] },
    { fields: ['pagePath', 'createdAt'] },
  ],
};
