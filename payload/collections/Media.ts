import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hidden: true,
    group: 'Контент',
    description: 'Усі фото і медіа-файли.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*', 'audio/*'],
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 320, position: 'center' },
      { name: 'card', width: 640, height: 800, position: 'center' },
      { name: 'gallery', width: 1280, height: 1600, position: 'center' },
      { name: 'hero', width: 1920, height: 1280, position: 'center' },
      { name: 'og', width: 1200, height: 630, position: 'center' },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 88 },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-текст (для accessibility і SEO)',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Підпис (для editorial-блоків)',
    },
    {
      name: 'aiGenerated',
      type: 'checkbox',
      label: 'Згенеровано AI',
      defaultValue: false,
      admin: { description: 'true якщо створено через Студію фото (Gemini)' },
    },
    {
      name: 'aiGenerationContext',
      type: 'textarea',
      label: 'AI-промпт яким згенеровано',
      admin: {
        description: 'Зберігається для відтворюваності + для AI-кнопок генерації описів',
        condition: (data) => data?.aiGenerated === true,
      },
    },
    {
      name: 'sourceReferenceMedia',
      type: 'relationship',
      relationTo: 'media',
      label: 'Референс-фото (якщо AI трансформувало існуюче)',
      admin: { condition: (data) => data?.aiGenerated === true },
    },
    {
      name: 'sourceProvenance',
      type: 'select',
      label: 'Джерело',
      defaultValue: 'real_photo',
      options: [
        { label: 'Реальне фото магазину', value: 'real_photo' },
        { label: 'AI: з нуля', value: 'ai_generated' },
        { label: 'AI: з референсу', value: 'ai_transformed' },
        { label: 'CC0 / Unsplash', value: 'cc0_unsplash' },
        { label: 'Демо плейсхолдер', value: 'demo_placeholder' },
      ],
    },
  ],
};
