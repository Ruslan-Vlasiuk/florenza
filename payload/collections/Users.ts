import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Адмін', plural: '👥 Адміни' },
  admin: {
    useAsTitle: 'email',
    group: '👥 Адміни',
    description: 'Адміністратори сайту.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 днів
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  fields: [
    { name: 'name', type: 'text', label: "Ім'я", required: true },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      defaultValue: 'admin',
      options: [
        { label: 'Власник (Варвара)', value: 'owner' },
        { label: 'Адміністратор', value: 'admin' },
        { label: 'Помічник', value: 'assistant' },
      ],
      required: true,
    },
    {
      name: 'telegramChatId',
      type: 'text',
      label: 'Telegram Chat ID',
      admin: { description: 'Для notifications про ескалації, оплати, дайджест' },
    },
  ],
};
