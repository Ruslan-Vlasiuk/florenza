import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const CategoriesType: CollectionConfig = {
  slug: 'categories-type',
  admin: {
    useAsTitle: 'name',
    group: 'Каталог',
    description: 'Тип букета: Авторські, Монобукети, Композиції, Весільна, Корпоративна, Жалобні, Подарунки.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Назва', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL)', required: true, unique: true },
    {
      name: 'description',
      type: 'textarea',
      label: 'Editorial-опис',
      admin: { description: '~200–300 слів. Використовується на категорійній сторінці.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Заголовкове фото' },
    { name: 'metaTitle', type: 'text', label: 'Meta title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta description' },
    { name: 'sortOrder', type: 'number', label: 'Порядок сортування', defaultValue: 0 },
    { name: 'isDemo', type: 'checkbox', label: 'Демо-контент', defaultValue: false },
  ],
};
