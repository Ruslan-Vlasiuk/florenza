import type { GlobalConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const GlobalPhotoStyle: GlobalConfig = {
  slug: 'global-photo-style',
  label: 'AI-фото стиль',
  admin: {
    group: 'AI / Налаштування',
    description: 'Глобальний стилевий промпт для Gemini. Версіонується. Калібрується перші 1–2 тижні після запуску.',
  },
  access: { read: isAdmin, update: isAdmin },
  fields: [
    {
      name: 'currentVersion',
      type: 'text',
      defaultValue: '1.0',
      admin: { description: 'Поточна активна версія' },
    },
    {
      name: 'globalStylePrompt',
      type: 'textarea',
      label: 'Глобальний стилевий промпт',
      required: true,
      admin: {
        rows: 12,
        description: 'Додається до КОЖНОЇ AI-генерації фото. Плюс persona-промпт картки букета зверху.',
      },
      defaultValue: `Editorial florist boutique photography.
Soft diffused daylight, neutral linen / aged plaster / raw wood backgrounds.
Organic shadows, painterly composition, no glossy retouching.
Subtle film grain. Muted palette of cream, sage, deep forest, dusty rose.
Shot on Hasselblad medium format, 80mm lens, shallow depth of field.
Mood reminiscent of Aesop and Studio Mondine.`,
    },
    {
      name: 'negativePrompt',
      type: 'textarea',
      label: 'Negative prompt (чого уникати)',
      defaultValue: `no plastic wrapping, no neon, no bright synthetic colors,
no studio softbox lighting, no cheesy stock photo aesthetic,
no glossy retouching, no Christmas / Halloween motifs unless requested,
no watermarks, no text overlays, no oversaturation`,
      admin: { rows: 6 },
    },
    {
      name: 'positiveModifiers',
      type: 'textarea',
      label: 'Positive modifiers (підсилювачі стилю)',
      defaultValue: 'soft daylight, natural shadows, painterly, editorial magazine quality, intimate composition, warm tones',
    },
    {
      name: 'aspectRatios',
      type: 'array',
      label: 'Доступні співвідношення сторін',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'ratio', type: 'text' },
        { name: 'usage', type: 'text', label: 'Де використовується' },
      ],
      defaultValue: [
        { name: 'Square', ratio: '1:1', usage: 'Картки каталогу' },
        { name: 'Portrait', ratio: '4:5', usage: 'Сторінка букета (mobile)' },
        { name: 'Landscape', ratio: '16:9', usage: 'Hero-секції' },
        { name: 'Wide', ratio: '3:2', usage: 'Editorial-блоки' },
      ],
    },
    {
      name: 'calibrationStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Очікує калібрування (стартова версія)', value: 'pending' },
        { label: 'У процесі калібрування', value: 'calibrating' },
        { label: 'Закалібрована (v1.0 baseline)', value: 'calibrated' },
      ],
    },
    {
      name: 'calibrationNotes',
      type: 'textarea',
      admin: { description: 'Що Варвара змінила і чому, у процесі калібрування' },
    },
    {
      name: 'lastUpdatedAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
};
