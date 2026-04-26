import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Журнал',
    description: 'Editorial-блог. AI-генерація через 8-крокову pipeline.',
    defaultColumns: ['title', 'status', 'aiPipelineScore', 'publishedAt'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 10,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок', required: true },
            { name: 'slug', type: 'text', label: 'Slug', required: true, unique: true },
            { name: 'excerpt', type: 'textarea', label: 'Lead-параграф (2–3 речення)' },
            { name: 'content', type: 'richText', label: 'Текст статті' },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Заголовкове фото' },
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
            { name: 'relatedBouquets', type: 'relationship', relationTo: 'bouquets', hasMany: true,
              label: "Зв'язані букети", admin: { description: 'Внутрішнє лінкування для SEO' } },
            { name: 'faq', type: 'array', label: 'FAQ',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'AI Pipeline',
          fields: [
            { name: 'mainKeyword', type: 'text', label: 'Головне ключове слово' },
            { name: 'secondaryKeywords', type: 'array',
              fields: [{ name: 'keyword', type: 'text' }] },
            { name: 'aiPipelineScore', type: 'number', label: 'SEO-score (self-critique)', min: 0, max: 100 },
            { name: 'aiDraftPrompt', type: 'textarea', admin: { description: 'Промпт яким згенеровано' } },
            { name: 'aiCritiqueNotes', type: 'textarea', admin: { description: 'Зауваження self-critique' } },
            { name: 'aiSerpAnalysis', type: 'json', admin: { description: 'Аналіз топ-10 SERP' } },
            { name: 'wordCount', type: 'number', admin: { readOnly: true } },
            { name: 'readingTimeMinutes', type: 'number', admin: { readOnly: true } },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            { name: 'canonical', type: 'text' },
          ],
        },
        {
          label: 'Метрики (post-publish)',
          fields: [
            { name: 'gscImpressions', type: 'number', defaultValue: 0 },
            { name: 'gscClicks', type: 'number', defaultValue: 0 },
            { name: 'gscPosition', type: 'number' },
            { name: 'gscCtr', type: 'number' },
            { name: 'gscLastSyncAt', type: 'date' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Чернетка', value: 'draft' },
        { label: 'Готовий до публікації', value: 'ready' },
        { label: 'Опубліковано', value: 'published' },
        { label: 'Архів', value: 'archived' },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'requiresManualReview', type: 'checkbox', defaultValue: false,
      admin: { position: 'sidebar', description: 'Топ-10 SEO-важливі статті — ручна доводка перед публікацією' } },
    { name: 'isDemo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
};
