import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const CorporateInquiries: CollectionConfig = {
  slug: 'corporate-inquiries',
  labels: { singular: 'Корпоративна заявка', plural: '🏢 Корпоратив — заявки' },
  admin: {
    useAsTitle: 'companyName',
    group: '💍 Спецпроєкти',
    description: 'B2B заявки з форми /korporatyvna-floristyka.',
  },
  access: { read: isAdmin, create: () => true, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Разове оформлення події', value: 'event' },
        { label: 'Регулярні поставки в офіс', value: 'office_subscription' },
        { label: 'VIP-букети для клієнтів', value: 'vip_gifts' },
        { label: 'Відкриття магазину', value: 'opening' },
        { label: 'Корпоративні подарунки', value: 'gifts' },
        { label: 'Інше', value: 'other' },
      ],
    },
    { name: 'frequency', type: 'text', label: 'Періодичність',
      admin: { description: 'напр. "щотижня по п\'ятницях", "щомісяця"' } },
    {
      name: 'budgetPerInstance',
      type: 'select',
      options: [
        { label: 'до 3 000 грн', value: '<3k' },
        { label: '3 000 – 6 000 грн', value: '3-6k' },
        { label: '6 000 – 15 000 грн', value: '6-15k' },
        { label: '15 000+ грн', value: '15k+' },
      ],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новий', value: 'new' },
        { label: 'У роботі', value: 'in_progress' },
        { label: 'Договір', value: 'contract' },
        { label: 'Активний клієнт', value: 'active' },
        { label: 'Втрачено', value: 'lost' },
      ],
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
};
