import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const BlogPipeline: CollectionConfig = {
  slug: 'blog-pipeline',
  admin: {
    hidden: true,
    useAsTitle: 'topic',
    group: 'Журнал',
    description: 'Черга тем для AI-генерації блогу. Cron щоденно вибирає наступну.',
    defaultColumns: ['topic', 'status', 'priority', 'scheduledFor', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'topic', type: 'text', label: 'Тема статті', required: true },
    { name: 'mainKeyword', type: 'text', label: 'Головне ключове слово' },
    { name: 'angle', type: 'textarea', label: 'Кут / акцент', admin: { description: 'Що саме розкрити' } },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Висока (топ-10 SEO)', value: 'high' },
        { label: 'Стандартна', value: 'normal' },
        { label: 'Низька (заповнення)', value: 'low' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'queued',
      options: [
        { label: 'У черзі', value: 'queued' },
        { label: 'Генерується', value: 'generating' },
        { label: 'Згенеровано → blog-post', value: 'generated' },
        { label: 'Опубліковано', value: 'published' },
        { label: 'Помилка', value: 'failed' },
        { label: 'Заборонено', value: 'banned' },
      ],
    },
    { name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Ручна', value: 'manual' },
        { label: 'AI (тренди)', value: 'auto_trends' },
        { label: 'AI (сезон)', value: 'auto_seasonal' },
        { label: 'Демо seed', value: 'demo_seed' },
      ],
    },
    { name: 'scheduledFor', type: 'date', label: 'Запланована публікація' },
    { name: 'generatedPost', type: 'relationship', relationTo: 'blog-posts',
      label: 'Згенерована стаття' },
    { name: 'errorMessage', type: 'textarea', admin: { condition: (d) => d.status === 'failed' } },
    { name: 'attemptsCount', type: 'number', defaultValue: 0 },
  ],
};
