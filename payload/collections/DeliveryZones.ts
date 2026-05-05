import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const DeliveryZones: CollectionConfig = {
  slug: 'delivery-zones',
  labels: { singular: 'Зона доставки', plural: '🚚 Зони доставки' },
  admin: {
    useAsTitle: 'name',
    group: '🚚 Доставка',
    description: 'Тарифи і населені пункти.',
    defaultColumns: ['name', 'tariff', 'isActive', 'urgentAvailable'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Назва зони', required: true },
    { name: 'slug', type: 'text', label: 'Slug', unique: true },
    {
      name: 'areas',
      type: 'array',
      label: 'Населені пункти / райони',
      fields: [{ name: 'place', type: 'text', label: 'Місце', required: true }],
    },
    { name: 'tariff', type: 'number', label: 'Тариф (грн)', required: true, defaultValue: 200 },
    { name: 'freeFromAmount', type: 'number', label: 'Безкоштовно від (грн)', defaultValue: 3000 },
    { name: 'timeFrom', type: 'text', label: 'Час від', defaultValue: '09:00' },
    { name: 'timeTo', type: 'text', label: 'Час до', defaultValue: '21:00' },
    { name: 'urgentAvailable', type: 'checkbox', label: 'Термінова доставка доступна', defaultValue: true },
    { name: 'urgentSurcharge', type: 'number', label: 'Доплата за термінову', defaultValue: 150 },
    { name: 'isActive', type: 'checkbox', label: 'Активна', defaultValue: true },
    {
      name: 'description',
      type: 'textarea',
      label: 'Editorial-опис для гео-сторінки',
      admin: { description: 'Використовується на /dostavka-kvitiv-{slug}' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
};
