import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Escalations: CollectionConfig = {
  slug: 'escalations',
  admin: {
    group: 'Лія / Інбокс',
    description: 'Лог ескалацій від Лії до Варвари з контекстом.',
    defaultColumns: ['conversation', 'reason', 'urgency', 'resolvedAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'conversation', type: 'relationship', relationTo: 'conversations', required: true, index: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Весілля', value: 'wedding' },
        { label: 'Корпоратив', value: 'corporate' },
        { label: 'Жалобна тема', value: 'funeral' },
        { label: 'Скарга', value: 'complaint' },
        { label: 'Кастом', value: 'custom' },
        { label: 'Зависла оплата', value: 'unpaid' },
        { label: 'Прямий запит', value: 'human_requested' },
        { label: 'AI не справилась', value: 'ai_stuck' },
      ],
    },
    {
      name: 'urgency',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Низька', value: 'low' },
        { label: 'Стандартна', value: 'normal' },
        { label: 'Висока', value: 'high' },
        { label: 'Терміново', value: 'urgent' },
      ],
    },
    { name: 'context', type: 'textarea', label: 'Контекст від Лії',
      admin: { description: 'Що вже зрозуміло, що потрібно від Варвари' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Відкрита', value: 'open' },
        { label: 'Варвара взяла', value: 'taken' },
        { label: 'Вирішена', value: 'resolved' },
        { label: 'Закрита (без дії)', value: 'dismissed' },
      ],
    },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'resolvedAt', type: 'date' },
    { name: 'resolution', type: 'textarea' },
  ],
};
