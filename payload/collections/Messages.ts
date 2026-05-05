import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    hidden: true,
    useAsTitle: 'preview',
    group: 'Лія / Інбокс',
    description: 'Повідомлення в діалогах. Унікальний рядок на повідомлення.',
    defaultColumns: ['conversation', 'role', 'preview', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Клієнт', value: 'user' },
        { label: 'Лія (AI)', value: 'assistant' },
        { label: 'Варвара (людина)', value: 'human_admin' },
        { label: 'Системне', value: 'system' },
      ],
    },
    { name: 'content', type: 'textarea', required: true, label: 'Текст' },
    {
      name: 'preview',
      type: 'text',
      admin: { readOnly: true, description: 'Перші 80 символів — для списку' },
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Фото', value: 'image' },
            { label: 'Голосове', value: 'voice' },
            { label: 'Файл', value: 'file' },
          ],
        },
        { name: 'url', type: 'text' },
        { name: 'mimeType', type: 'text' },
      ],
    },
    {
      name: 'voiceTranscription',
      type: 'textarea',
      admin: { description: 'Транскрипт голосового через Whisper' },
    },
    {
      name: 'aiMeta',
      type: 'group',
      label: 'AI метадані (для assistant-повідомлень)',
      fields: [
        { name: 'model', type: 'text', admin: { description: 'Який Claude використано (haiku/sonnet/opus)' } },
        { name: 'inputTokens', type: 'number' },
        { name: 'outputTokens', type: 'number' },
        { name: 'latencyMs', type: 'number' },
        { name: 'toolsCalled', type: 'json', label: 'Викликані tools' },
        { name: 'systemPromptVersion', type: 'text' },
      ],
    },
    {
      name: 'improvedPrompt',
      type: 'group',
      label: 'Feedback "Покращити промпт"',
      admin: { description: 'Якщо Варвара виправила відповідь Лії — заповнюється' },
      fields: [
        { name: 'wasIncorrect', type: 'checkbox', defaultValue: false },
        { name: 'correctAnswer', type: 'textarea' },
        { name: 'addedToFAQ', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.content) {
          data.preview = String(data.content).slice(0, 80);
        }
        return data;
      },
    ],
  },
  indexes: [
    { fields: ['conversation', 'createdAt'] },
  ],
};
