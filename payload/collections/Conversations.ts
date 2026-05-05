import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  labels: { singular: 'Розмова', plural: '💬 Розмови' },
  admin: {
    useAsTitle: 'externalId',
    group: '💬 Інбокс',
    description: 'Усі діалоги — Telegram, Viber, чат на сайті.',
    defaultColumns: ['channel', 'externalId', 'status', 'lastMessageAt', 'tags'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'channel',
      type: 'select',
      label: 'Канал',
      required: true,
      options: [
        { label: 'Сайт-чат', value: 'web_chat' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
      ],
    },
    {
      name: 'externalId',
      type: 'text',
      label: 'Зовнішній ID (chat_id Telegram, тощо)',
      required: true,
      index: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Клієнт',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Активна', value: 'active' },
        { label: 'Ескальована', value: 'escalated' },
        { label: 'Закрита', value: 'closed' },
        { label: 'Замовлення оформлене', value: 'order_placed' },
      ],
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Весілля', value: 'wedding' },
        { label: 'Корпоратив', value: 'corporate' },
        { label: 'Скарга', value: 'complaint' },
        { label: 'Жалобна тема', value: 'funeral_sensitive' },
        { label: 'VIP', value: 'vip' },
        { label: 'Кастом', value: 'custom' },
        { label: 'Зависла оплата', value: 'unpaid_followup' },
      ],
    },
    {
      name: 'escalationReason',
      type: 'select',
      options: [
        { label: 'Весілля / складне замовлення', value: 'wedding_or_complex' },
        { label: 'Корпоратив >5000 грн', value: 'corporate_high_value' },
        { label: 'Скарга / спір', value: 'complaint' },
        { label: 'Делікатна тема', value: 'sensitive_topic' },
        { label: 'Кастом', value: 'custom_request' },
        { label: 'Зависла оплата', value: 'unpaid_stuck' },
        { label: 'Прямий запит на людину', value: 'human_requested' },
        { label: 'Лія не справилась', value: 'ai_stuck' },
      ],
    },
    {
      name: 'escalatedAt',
      type: 'date',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: "Прив'язане замовлення",
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'lastMessagePreview',
      type: 'textarea',
      admin: { readOnly: true, description: 'Прев’ю останнього повідомлення для inbox-листа' },
    },
    {
      name: 'unreadByAdmin',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'true → червоний індикатор в адмінці' },
    },
    {
      name: 'systemPromptVersion',
      type: 'text',
      admin: { description: 'Версія системного промпту, з якою стартував діалог (для відладки)' },
    },
    {
      name: 'entryContext',
      type: 'json',
      admin: {
        description:
          'Контекст входу користувача в розмову (з якого CTA прийшов: букет, інтент order/question/general).',
        readOnly: true,
      },
      required: false,
    },
    {
      name: 'firstTurnHandled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Прапорець: чи відпрацьовано перший turn з entryContext-секцією у системному промпті. Після true секція не повторюється.',
        readOnly: true,
      },
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false },
  ],
  indexes: [
    { fields: ['channel', 'externalId'], unique: true },
    { fields: ['status'] },
    { fields: ['lastMessageAt'] },
  ],
};
