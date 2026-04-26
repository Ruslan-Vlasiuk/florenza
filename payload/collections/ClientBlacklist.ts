import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const ClientBlacklist: CollectionConfig = {
  slug: 'client-blacklist',
  admin: {
    useAsTitle: 'phone',
    group: 'Розсилки',
    description: 'Клієнти які відписались (/stop) або забанені.',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'phone', type: 'text', label: 'Телефон', required: true, unique: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    { name: 'reason', type: 'select',
      options: [
        { label: '/stop команда', value: 'stop_command' },
        { label: 'Прямий запит', value: 'direct_request' },
        { label: 'Спам / зловживання', value: 'abuse' },
        { label: 'Помилковий контакт', value: 'wrong_contact' },
      ],
    },
    { name: 'addedAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'note', type: 'textarea' },
  ],
};
