import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const PromptsVersions: CollectionConfig = {
  slug: 'prompts-versions',
  admin: {
    hidden: true,
    useAsTitle: 'label',
    group: 'AI / Налаштування',
    description: 'Версіонування системних промптів (Лія, AI-content, AI-фото). Для відтворюваності і відлагодки.',
    defaultColumns: ['promptType', 'version', 'isActive', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'promptType',
      type: 'select',
      required: true,
      options: [
        { label: 'Лія — system prompt', value: 'liya_system' },
        { label: 'AI-content — карточки', value: 'content_card' },
        { label: 'AI-content — блог draft', value: 'blog_draft' },
        { label: 'AI-content — блог critique', value: 'blog_critique' },
        { label: 'AI-фото — глобальний стиль', value: 'photo_global_style' },
        { label: 'Brand voice — компільований', value: 'brand_voice_compiled' },
      ],
    },
    { name: 'version', type: 'text', required: true,
      admin: { description: 'напр. "1.0", "1.1-experimental"' } },
    { name: 'label', type: 'text', label: 'Описова назва' },
    { name: 'content', type: 'textarea', required: true,
      admin: { rows: 20 } },
    { name: 'isActive', type: 'checkbox', defaultValue: false,
      admin: { description: 'Тільки одна версія може бути активною на одне промпт-тип' } },
    { name: 'changeNote', type: 'textarea', label: 'Що змінилось у цій версії' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users' },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
};
