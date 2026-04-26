import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const WeddingBriefs: CollectionConfig = {
  slug: 'wedding-briefs',
  admin: {
    useAsTitle: 'brideName',
    group: 'Особливі секції',
    description: 'Брифи з форми /vesilna-floristyka. Завжди ескалація Варварі.',
    defaultColumns: ['brideName', 'weddingDate', 'budget', 'status'],
  },
  access: { read: isAdmin, create: () => true, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'brideName', type: 'text', label: "Ім'я нареченої", required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'weddingDate', type: 'date', required: true },
    { name: 'venue', type: 'text', label: 'Локація' },
    { name: 'guestCount', type: 'number' },
    { name: 'styleNotes', type: 'textarea', label: 'Стиль (опис)' },
    {
      name: 'styleReferences',
      type: 'array',
      label: 'Фото-референси (до 5)',
      maxRows: 5,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: 'до 15 000 грн', value: '<15k' },
        { label: '15 000 – 30 000 грн', value: '15-30k' },
        { label: '30 000 – 60 000 грн', value: '30-60k' },
        { label: '60 000+ грн', value: '60k+' },
      ],
    },
    {
      name: 'whatNeeded',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Букет нареченої', value: 'bridal_bouquet' },
        { label: 'Бутоньєрки', value: 'boutonnieres' },
        { label: 'Арка / весільний задник', value: 'arch' },
        { label: 'Композиції на столи', value: 'table_arrangements' },
        { label: 'Декорування виходу', value: 'aisle' },
        { label: 'Лепестки', value: 'petals' },
        { label: 'Букет на кидання', value: 'toss_bouquet' },
        { label: 'Інше (вказати в нотатках)', value: 'other' },
      ],
    },
    { name: 'additionalNotes', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Новий', value: 'new' },
        { label: 'Варвара взяла', value: 'in_progress' },
        { label: 'Запропоновано', value: 'proposal_sent' },
        { label: 'Підтверджено', value: 'confirmed' },
        { label: 'Виконано', value: 'completed' },
        { label: 'Втрачено', value: 'lost' },
      ],
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
};
