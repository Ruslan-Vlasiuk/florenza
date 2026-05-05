import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const SeoPages: CollectionConfig = {
  slug: 'seo-pages',
  admin: {
    hidden: true,
    useAsTitle: 'urlPath',
    group: 'SEO',
    description: 'Програмні гео- і комбінаційні SEO-сторінки.',
    defaultColumns: ['urlPath', 'pageType', 'status', 'updatedAt'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'urlPath', type: 'text', label: 'URL-шлях', required: true, unique: true,
      admin: { description: 'напр. "/buketu/pivonii-na-den-narodzhennya" або "/dostavka-kvitiv-irpin"' } },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [
        { label: 'Гео (доставка по місту)', value: 'geo' },
        { label: 'Категорія (тип)', value: 'category_type' },
        { label: 'Категорія (квітка)', value: 'category_flower' },
        { label: 'Категорія (привід)', value: 'category_occasion' },
        { label: 'Комбінаційна', value: 'combo' },
        { label: 'Особлива', value: 'special' },
      ],
    },
    { name: 'h1', type: 'text', label: 'H1 заголовок', required: true },
    { name: 'metaTitle', type: 'text', required: true },
    { name: 'metaDescription', type: 'textarea', required: true },
    { name: 'introText', type: 'richText', label: 'Editorial-вступ' },
    { name: 'bottomText', type: 'richText', label: 'Editorial-висновок' },
    { name: 'faq', type: 'array', label: 'FAQ для Schema.org',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'filterPreset', type: 'json',
      admin: { description: 'JSON-фільтри для фетчу букетів. Напр. {"flower": "pivonii", "occasion": "den-narodzhennya"}' } },
    { name: 'relatedBouquets', type: 'relationship', relationTo: 'bouquets', hasMany: true },
    { name: 'localContext', type: 'group', label: 'Локальний контекст (для гео)',
      fields: [
        { name: 'cityName', type: 'text' },
        { name: 'deliveryDescription', type: 'textarea' },
        { name: 'mapEmbed', type: 'text', admin: { description: 'iframe src або lat,lng' } },
      ],
    },
    { name: 'status', type: 'select', defaultValue: 'published',
      options: [
        { label: 'Опубліковано', value: 'published' },
        { label: 'Чернетка', value: 'draft' },
        { label: 'Прихована', value: 'hidden' },
      ],
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
};
