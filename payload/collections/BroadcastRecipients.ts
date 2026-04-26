import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const BroadcastRecipients: CollectionConfig = {
  slug: 'broadcast-recipients',
  admin: {
    group: 'Розсилки',
    description: 'Лог хто отримав розсилку (для frequency cap і аналітики).',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'broadcast', type: 'relationship', relationTo: 'broadcasts', required: true, index: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, index: true },
    { name: 'channel', type: 'select',
      options: [
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Очікує відправки', value: 'pending' },
        { label: 'Відправлено', value: 'sent' },
        { label: 'Доставлено', value: 'delivered' },
        { label: 'Прочитано', value: 'read' },
        { label: 'Відповіли', value: 'replied' },
        { label: 'Помилка', value: 'failed' },
        { label: 'Skip (cap)', value: 'skipped' },
      ],
    },
    { name: 'errorMessage', type: 'textarea' },
    { name: 'sentAt', type: 'date' },
    { name: 'deliveredAt', type: 'date' },
    { name: 'readAt', type: 'date' },
    { name: 'repliedAt', type: 'date' },
  ],
};
