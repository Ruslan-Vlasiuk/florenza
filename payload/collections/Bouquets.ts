import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const Bouquets: CollectionConfig = {
  slug: 'bouquets',
  labels: { singular: 'Букет', plural: '🌸 Букети' },
  admin: {
    useAsTitle: 'name',
    group: '🌸 Каталог',
    description:
      'Усі букети магазину. Створіть новий → одразу додайте фото на вкладці «Фото» → опублікуйте.',
    defaultColumns: ['name', 'price', 'status', 'discount', 'updatedAt'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  fields: [
    // --- Tabs ---
    {
      type: 'tabs',
      tabs: [
        // === Опис ===
        {
          label: '📝 Опис',
          description: 'Назва, опис, склад, ціна.',
          fields: [
            { name: 'name', type: 'text', label: 'Назва', required: true },
            { name: 'slug', type: 'text', label: 'Slug (URL)', required: true, unique: true,
              admin: { description: 'Транслітерація з української, без пробілів. Напр. "ispanska-nich"' } },
            {
              name: 'descriptionShort',
              type: 'textarea',
              label: 'Короткий опис (для каталогу, 1–2 речення)',
              admin: { description: 'Показується в картці на /buketu' },
            },
            {
              name: 'descriptionFull',
              type: 'textarea',
              label: 'Розгорнутий опис (для сторінки букета)',
              admin: {
                description: 'Кілька абзаців — настрій, склад, для якого приводу.',
                rows: 6,
              },
            },
            {
              name: 'composition',
              type: 'array',
              label: 'Склад букета',
              admin: { description: 'Список квітів і додатків' },
              fields: [
                { name: 'item', type: 'text', label: 'Що', required: true,
                  admin: { description: 'напр. "Троянда David Austin", "Евкаліпт", "Шовкова стрічка"' } },
                { name: 'count', type: 'number', label: 'Кількість', defaultValue: 1 },
                { name: 'note', type: 'text', label: 'Примітка' },
              ],
            },
            {
              name: 'price',
              type: 'number',
              label: 'Ціна (грн)',
              required: true,
              min: 0,
            },
            {
              name: 'currency',
              type: 'text',
              defaultValue: 'UAH',
              admin: { hidden: true },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Чернетка', value: 'draft' },
                { label: 'Опубліковано', value: 'published' },
                { label: 'Прихований', value: 'hidden' },
                { label: 'Розпродано', value: 'sold_out' },
              ],
            },
          ],
        },
        // === Фото ===
        {
          label: '📸 Фото',
          description: 'Перетягніть фото сюди або натисніть кнопку «Завантажити». Перше фото — головне.',
          fields: [
            {
              name: 'primaryImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Головне фото',
              admin: {
                description: 'Це фото показується в каталозі. Натисніть «Upload» — оберіть з комп\'ютера.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Додаткові фото (для галереї на сторінці букета)',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
              ],
            },
            {
              name: 'photoSequence',
              type: 'array',
              label: '3D photo-sequence (8–12 ракурсів)',
              admin: {
                description: 'Опційно: для вау-ефекту 3D обертання на сторінці букета. Якщо порожньо — ефект не показується.',
              },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'angle', type: 'number', label: 'Кут (0–360)', min: 0, max: 360 },
              ],
            },
            {
              name: 'imageGenerationContext',
              type: 'textarea',
              label: 'AI-промпт фото (для AI-кнопок текстів)',
              admin: {
                description:
                  'Заповнюється автоматично, коли фото генерується через Студію фото. AI-кнопки "Запропонувати назву / опис" використовують цей контекст для відповідності тексту фото.',
              },
            },
          ],
        },
        // === Категорії ===
        {
          label: '🏷 Категорії',
          description: 'Тип, головна квітка, привід — для пошуку та фільтрів.',
          fields: [
            {
              name: 'type',
              type: 'relationship',
              relationTo: 'categories-type',
              label: 'Тип букета',
              required: true,
            },
            {
              name: 'mainFlower',
              type: 'relationship',
              relationTo: 'flowers',
              label: 'Головна квітка',
            },
            {
              name: 'occasions',
              type: 'relationship',
              relationTo: 'occasions',
              hasMany: true,
              label: 'Приводи',
            },
            {
              name: 'emotionalTone',
              type: 'select',
              hasMany: true,
              label: 'Емоційний тон',
              options: [
                { label: 'Ніжний', value: 'gentle' },
                { label: 'Дерзкий', value: 'bold' },
                { label: 'Класичний', value: 'classic' },
                { label: 'Мінімалістичний', value: 'minimal' },
                { label: 'Розкішний', value: 'lush' },
                { label: 'Природний', value: 'natural' },
              ],
            },
            {
              name: 'forWhom',
              type: 'select',
              label: 'Для кого',
              defaultValue: 'neutral',
              options: [
                { label: 'Жінці', value: 'female' },
                { label: 'Чоловіку', value: 'male' },
                { label: 'Нейтрально', value: 'neutral' },
              ],
            },
          ],
        },
        // === Розмір/час/знижка/SEO/звʼязані — об'єднано в одну вкладку ===
        {
          label: '⚙️ Додатково',
          description: 'Розмір, знижка, SEO, схожі букети — заповнюйте за бажанням.',
          fields: [
            {
              name: 'size',
              type: 'group',
              label: 'Розмір',
              fields: [
                { name: 'heightCm', type: 'number', label: 'Висота (см)' },
                { name: 'diameterCm', type: 'number', label: 'Діаметр (см)' },
                {
                  name: 'tShirtSize',
                  type: 'select',
                  label: 'T-Shirt size',
                  options: [
                    { label: 'S', value: 'S' },
                    { label: 'M', value: 'M' },
                    { label: 'L', value: 'L' },
                    { label: 'XL', value: 'XL' },
                  ],
                },
              ],
            },
            {
              name: 'preparationHours',
              type: 'number',
              label: 'Час підготовки (годин)',
              defaultValue: 1,
              admin: { description: '1 = можна на сьогодні, 3 = на завтра, 24 = на наступний день' },
            },
            {
              name: 'seasonality',
              type: 'group',
              label: 'Сезонність',
              fields: [
                { name: 'yearRound', type: 'checkbox', defaultValue: true },
                { name: 'availableFrom', type: 'date', label: 'Доступний з' },
                { name: 'availableTo', type: 'date', label: 'Доступний до' },
              ],
            },
            {
              name: 'discount',
              type: 'group',
              label: 'Знижка',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Активна', defaultValue: false },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Тип',
                  defaultValue: 'percent',
                  options: [
                    { label: 'Відсоток (%)', value: 'percent' },
                    { label: 'Фіксована сума (грн)', value: 'fixed' },
                  ],
                },
                { name: 'amount', type: 'number', label: 'Розмір', min: 0 },
                { name: 'startAt', type: 'date', label: 'Початок дії' },
                { name: 'endAt', type: 'date', label: 'Кінець дії' },
                { name: 'campaignName', type: 'text', label: 'Назва акції (для UI лейбла)' },
              ],
            },
            { name: 'metaTitle', type: 'text', label: 'SEO title (50–60 символів)',
              admin: { description: 'Опційно. Якщо порожньо — використається назва букета.' } },
            { name: 'metaDescription', type: 'textarea', label: 'SEO description (140–160 символів)',
              admin: { description: 'Опційно. Якщо порожньо — використається короткий опис.' } },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Картинка для соцмереж (1200×630)',
              admin: { description: 'Опційно. Якщо порожньо — головне фото.' } },
            {
              name: 'faq',
              type: 'array',
              label: 'Питання-відповіді (опційно)',
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Питання' },
                { name: 'answer', type: 'textarea', required: true, label: 'Відповідь' },
              ],
            },
            {
              name: 'relatedBouquets',
              type: 'relationship',
              relationTo: 'bouquets',
              hasMany: true,
              label: '«З цим часто замовляють» (опційно)',
            },
          ],
        },
      ],
    },
    // --- Демо-флаг (поза табами) ---
    {
      name: 'isDemo',
      type: 'checkbox',
      label: 'Демонстраційний контент',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Якщо ON — буде видалено через "Очистити демо" в адмінці.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set publishedAt
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};
