import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const ReEngagementLog: CollectionConfig = {
  slug: 're-engagement-log',
  admin: {
    hidden: true,
    group: 'Розсилки',
    description: 'Лог автоматичних дотиків (delivery confirmation, repeat recipient).',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, index: true },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    {
      name: 'scenario',
      type: 'select',
      required: true,
      options: [
        { label: 'Підтвердження отримання (T+4h)', value: 'delivery_confirmation' },
        { label: 'Повторний адресат', value: 'repeat_recipient' },
      ],
    },
    { name: 'channel', type: 'select',
      options: [
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'sent',
      options: [
        { label: 'Відправлено', value: 'sent' },
        { label: 'Відповіли', value: 'replied' },
        { label: 'Помилка', value: 'failed' },
      ],
    },
    { name: 'sentAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'response', type: 'textarea' },
  ],
};
