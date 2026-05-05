import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Broadcasts: CollectionConfig = {
  slug: 'broadcasts',
  labels: { singular: 'Розсилка', plural: '📢 Розсилки' },
  admin: {
    useAsTitle: 'title',
    group: '📢 Розсилки',
    description: 'Розсилки клієнтам у Telegram/Viber. Cap: 1/30 днів + 4/рік на одного.',
    defaultColumns: ['title', 'status', 'recipientsCount', 'sentAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', label: 'Назва (внутрішня)', required: true },
    { name: 'message', type: 'textarea', label: 'Текст повідомлення', required: true,
      admin: { description: 'Підтримує перемінні: {name}, {last_bouquet}, {city}' } },
    {
      name: 'attachments',
      type: 'array',
      label: 'Вкладення (опційно, до 3)',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
      maxRows: 3,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Посилання (опційно)',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'segmentation',
      type: 'group',
      label: 'Сегментація',
      fields: [
        {
          name: 'targetAudience',
          type: 'select',
          defaultValue: 'all',
          options: [
            { label: 'Всі підписані', value: 'all' },
            { label: 'Покупали останні N міс.', value: 'recent_buyers' },
            { label: 'VIP (LTV > X грн)', value: 'vip' },
            { label: 'Купували на цей привід торік', value: 'bought_for_occasion' },
            { label: 'Конкретний канал', value: 'channel_specific' },
          ],
        },
        { name: 'recentMonths', type: 'number', defaultValue: 6,
          admin: { condition: (d) => d.segmentation?.targetAudience === 'recent_buyers' } },
        { name: 'vipThreshold', type: 'number', defaultValue: 10000,
          admin: { condition: (d) => d.segmentation?.targetAudience === 'vip' } },
        { name: 'occasion', type: 'relationship', relationTo: 'occasions',
          admin: { condition: (d) => d.segmentation?.targetAudience === 'bought_for_occasion' } },
        { name: 'channels', type: 'select', hasMany: true,
          options: [
            { label: 'Telegram', value: 'telegram' },
            { label: 'Viber', value: 'viber' },
          ],
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'sendStrategy',
          type: 'select',
          defaultValue: 'now',
          options: [
            { label: 'Зараз', value: 'now' },
            { label: 'Запланувати', value: 'scheduled' },
          ],
        },
        { name: 'scheduledFor', type: 'date',
          admin: { condition: (d) => d.schedule?.sendStrategy === 'scheduled' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Чернетка', value: 'draft' },
        { label: 'Запланована', value: 'scheduled' },
        { label: 'Відправляється', value: 'sending' },
        { label: 'Завершена', value: 'completed' },
        { label: 'Скасована', value: 'cancelled' },
        { label: 'Помилка', value: 'failed' },
      ],
    },
    { name: 'recipientsCount', type: 'number', admin: { readOnly: true } },
    { name: 'deliveredCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'readCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'repliedCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'unsubscribedCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'orders7dCount', type: 'number', defaultValue: 0, admin: { readOnly: true,
      description: 'Замовлень з рассилки за 7 днів' } },
    { name: 'sentAt', type: 'date', admin: { readOnly: true } },
  ],
};
