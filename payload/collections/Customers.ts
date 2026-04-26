import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'phone',
    group: 'Клієнти',
    description: 'Унікальні клієнти ідентифікуються за телефоном.',
    defaultColumns: ['phone', 'name', 'totalOrders', 'totalSpent', 'lastOrderAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'phone', type: 'text', label: 'Телефон (E.164)', required: true, unique: true,
      admin: { description: '+380XXXXXXXXX формат' } },
    { name: 'name', type: 'text', label: "Ім'я" },
    {
      name: 'preferredChannel',
      type: 'select',
      label: 'Бажаний канал',
      options: [
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
        { label: 'Сайт-чат', value: 'web_chat' },
      ],
    },
    { name: 'telegramChatId', type: 'text' },
    { name: 'viberId', type: 'text' },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Постійний', value: 'returning' },
        { label: 'Корпоратив', value: 'corporate' },
        { label: 'Весілля', value: 'wedding' },
        { label: 'Скаржився', value: 'complained' },
      ],
    },
    {
      name: 'preferences',
      type: 'array',
      label: 'Преференції',
      admin: { description: 'Лія сама зберігає сюди (улюблені квіти, важливі дати, тощо)' },
      fields: [
        { name: 'key', type: 'text', label: 'Ключ' },
        { name: 'value', type: 'textarea', label: 'Значення' },
        { name: 'savedAt', type: 'date', defaultValue: () => new Date().toISOString() },
      ],
    },
    { name: 'totalOrders', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'totalSpent', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'firstOrderAt', type: 'date', admin: { readOnly: true } },
    { name: 'lastOrderAt', type: 'date', admin: { readOnly: true } },
    {
      name: 'broadcastOptIn',
      type: 'checkbox',
      label: 'Підписаний на розсилки',
      defaultValue: true,
      admin: { description: '/stop команда → false назавжди' },
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  indexes: [
    { fields: ['phone'], unique: true },
  ],
};
