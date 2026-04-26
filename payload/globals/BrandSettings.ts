import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const BrandSettings: GlobalConfig = {
  slug: 'brand-settings',
  label: 'Налаштування бренду',
  admin: { group: 'Налаштування' },
  access: { read: publicRead, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'brandName', type: 'text', defaultValue: 'Florenza' },
            { name: 'legalEntity', type: 'text', defaultValue: 'ФОП Каракой Варвара Олександрівна' },
            { name: 'edrpou', type: 'text', label: 'ЄДРПОУ / РНОКПП' },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип (SVG)' },
            { name: 'logoLight', type: 'upload', relationTo: 'media', label: 'Логотип (на темному)' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'ogDefault', type: 'upload', relationTo: 'media', label: 'OG image за замовчуванням' },
          ],
        },
        {
          label: 'Контакти',
          fields: [
            { name: 'address', type: 'text', defaultValue: 'м. Ірпінь, вул. Ірпінська 1' },
            { name: 'addressLat', type: 'number' },
            { name: 'addressLng', type: 'number' },
            { name: 'phone', type: 'text' },
            { name: 'telegramUsername', type: 'text', defaultValue: 'florenza_bot' },
            { name: 'viberDeepLink', type: 'text', label: 'Viber deep link' },
            { name: 'instagramUrl', type: 'text', admin: { description: 'Опційно — для footer-link якщо буде' } },
            {
              name: 'workingHours',
              type: 'array',
              label: 'Графік роботи (для відображення на /contacts)',
              fields: [
                { name: 'day', type: 'text', label: 'День (Пн-Пт, Сб, Нд)' },
                { name: 'hours', type: 'text', label: 'Години (напр. "9:00–21:00")' },
              ],
            },
          ],
        },
        {
          label: 'AI бюджети',
          fields: [
            { name: 'monthlyAIBudgetUSD', type: 'number', defaultValue: 30,
              admin: { description: 'Мах витрати на AI (Claude+Gemini) на місяць у USD. Перевищення → пауза' } },
            { name: 'currentMonthSpentUSD', type: 'number', defaultValue: 0, admin: { readOnly: true } },
            { name: 'aiPauseEnabled', type: 'checkbox', defaultValue: false,
              admin: { description: 'true → AI-фічі тимчасово паузнуті (досягнуто бюджету)' } },
          ],
        },
        {
          label: 'Демо-режим',
          fields: [
            { name: 'demoModeEnabled', type: 'checkbox', defaultValue: true,
              admin: { description: 'Якщо ON — на сайті є badge "демо" і AI-кнопки seeding доступні' } },
            { name: 'demoLastSeededAt', type: 'date', admin: { readOnly: true } },
          ],
        },
        {
          label: 'Час прийому замовлень',
          fields: [
            { name: 'todayCutoffTime', type: 'text', defaultValue: '19:00',
              admin: { description: 'До якого часу приймаємо замовлення на сьогодні' } },
            { name: 'urgentDeliveryEnabled', type: 'checkbox', defaultValue: true,
              admin: { description: 'Чи доступна термінова доставка зараз' } },
            { name: 'emergencyMode', type: 'checkbox', defaultValue: false,
              admin: { description: 'Аварійний режим — не приймаємо замовлення зовсім' } },
            { name: 'emergencyMessage', type: 'textarea',
              admin: { condition: (d) => d.emergencyMode } },
            { name: 'holidayMode', type: 'select',
              options: [
                { label: 'Без свята', value: 'none' },
                { label: '8 березня', value: 'march8' },
                { label: '14 лютого', value: 'feb14' },
                { label: 'День матері', value: 'mothers_day' },
                { label: 'Новий рік', value: 'new_year' },
                { label: 'Користувацький', value: 'custom' },
              ],
              defaultValue: 'none',
            },
          ],
        },
      ],
    },
  ],
};
