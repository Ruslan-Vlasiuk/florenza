import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Замовлення', plural: '📦 Замовлення' },
  admin: {
    useAsTitle: 'orderNumber',
    group: '📦 Замовлення',
    description: 'Замовлення. Лія створює, Варвара рухає по статусам.',
    defaultColumns: ['orderNumber', 'status', 'customer', 'totalAmount', 'deliveryDate', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: '№ заказу',
      required: true,
      unique: true,
      admin: { description: 'Авто-генерується. Format: F-YYMMDD-NNN' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Новий (TG не привʼязаний)', value: 'new' },
        { label: 'Очікує передоплати 50%', value: 'awaiting_prepayment' },
        { label: 'Очікує повної оплати', value: 'pending_payment' },
        { label: 'Передоплата отримана', value: 'prepayment_received' },
        { label: 'Оплачений', value: 'paid' },
        { label: 'Часткова оплата', value: 'paid_partial' },
        { label: 'У роботі', value: 'in_progress' },
        { label: 'Зібрано', value: 'assembled' },
        { label: 'Передано курʼєру', value: 'in_transit' },
        { label: 'Доставлено', value: 'delivered' },
        { label: 'Скасовано', value: 'cancelled' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Букет і ціна',
          fields: [
            { name: 'bouquet', type: 'relationship', relationTo: 'bouquets', required: true },
            { name: 'bouquetSnapshot', type: 'json', label: 'Snapshot букета на момент заказу',
              admin: { description: 'Замражуємо ціну, склад, фото — щоб не змінилось після оновлення картки.' } },
            { name: 'extras', type: 'array', label: 'Додатки',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'price', type: 'number' },
              ],
            },
            { name: 'subtotal', type: 'number', label: 'Сума букета' },
            { name: 'discountAmount', type: 'number', label: 'Знижка', defaultValue: 0 },
            { name: 'deliveryFee', type: 'number', label: 'Доставка' },
            { name: 'totalAmount', type: 'number', label: 'Підсумок', required: true },
          ],
        },
        {
          label: 'Замовник і отримувач',
          fields: [
            { name: 'customer', type: 'relationship', relationTo: 'customers' },
            { name: 'buyerName', type: 'text', label: "Замовник — ім'я" },
            { name: 'buyerPhone', type: 'text', label: 'Замовник — телефон', required: true },
            { name: 'recipientName', type: 'text', label: "Отримувач — ім'я" },
            { name: 'recipientPhone', type: 'text', label: 'Отримувач — телефон' },
            { name: 'isAnonymous', type: 'checkbox', label: 'Анонімне замовлення', defaultValue: false },
          ],
        },
        {
          label: 'Доставка',
          fields: [
            { name: 'deliveryZone', type: 'relationship', relationTo: 'delivery-zones' },
            { name: 'addressStreet', type: 'text', label: 'Вулиця' },
            { name: 'addressBuilding', type: 'text', label: 'Будинок' },
            { name: 'addressApartment', type: 'text', label: 'Квартира' },
            { name: 'addressFloor', type: 'text', label: 'Поверх' },
            { name: 'addressEntrance', type: 'text', label: 'Підʼїзд' },
            { name: 'addressIntercom', type: 'text', label: 'Домофон' },
            { name: 'courierInstructions', type: 'textarea', label: 'Інструкції кур’єру' },
            { name: 'deliveryDate', type: 'date', label: 'Дата доставки', required: true },
            { name: 'deliverySlot', type: 'text', label: 'Часовий слот', admin: { description: 'напр. "14:00–16:00"' } },
            { name: 'isUrgent', type: 'checkbox', label: 'Термінова (60–90 хв)', defaultValue: false },
            { name: 'urgentSurcharge', type: 'number', label: 'Доплата за термінову', defaultValue: 0 },
            { name: 'cardMessage', type: 'textarea', label: 'Текст листівки' },
          ],
        },
        {
          label: 'Оплата',
          fields: [
            {
              name: 'paymentProvider',
              type: 'select',
              options: [
                { label: 'Monobank', value: 'mono' },
                { label: 'LiqPay', value: 'liqpay' },
                { label: 'При доставці (готівка/картка)', value: 'cash_on_delivery' },
              ],
            },
            { name: 'paymentIntentId', type: 'text', label: 'ID payment intent' },
            { name: 'paymentLink', type: 'text', label: 'Посилання на оплату' },
            { name: 'paidAmount', type: 'number', label: 'Оплачено', defaultValue: 0 },
            { name: 'remainingAmount', type: 'number', label: 'Залишилось', defaultValue: 0 },
            { name: 'paidAt', type: 'date', label: 'Час оплати' },
            { name: 'fiscalReceiptUrl', type: 'text', label: 'Посилання на фіскальний чек (Checkbox)' },
            { name: 'fiscalReceiptId', type: 'text' },
          ],
        },
        {
          label: 'AI і комунікація',
          fields: [
            { name: 'conversation', type: 'relationship', relationTo: 'conversations',
              label: 'Розмова з якої створено',
              admin: { description: 'Якщо створено через Лію — посилання на діалог' } },
            { name: 'createdBy', type: 'select',
              defaultValue: 'liya',
              options: [
                { label: 'Лія (AI)', value: 'liya' },
                { label: 'Варвара (вручну)', value: 'varvara' },
                { label: 'Сайт чекаут', value: 'web_checkout' },
              ],
            },
            { name: 'liyaNotes', type: 'textarea', label: 'Нотатки Лії',
              admin: { description: 'Що Лія зрозуміла з діалогу і занотувала для Варвари' } },
          ],
        },
      ],
    },
    { name: 'isDemo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'adminAlertMessageId',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Telegram message_id новоприйшлого алерта в @djirickeosiifj832838bot — для thread-реплаїв на ті ж самі замовлення.',
      },
    },
    {
      name: 'followupSentAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Коли пішов 1-годинний нагадник адміну (cron orders-followup).',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          const d = new Date();
          const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
          const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
          data.orderNumber = `FL-${ymd}-${rand}`;
        }
        return data;
      },
    ],
  },
};
