import type { GlobalConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: '💳 Оплата',
  admin: { group: '⚙️ Налаштування' },
  access: { read: isAdmin, update: isAdmin },
  fields: [
    {
      name: 'monoEnabled',
      type: 'checkbox',
      label: 'Monobank Acquiring активний',
      defaultValue: true,
    },
    {
      name: 'liqpayEnabled',
      type: 'checkbox',
      label: 'LiqPay активний (резервний)',
      defaultValue: true,
    },
    {
      name: 'partialPrepaymentEnabled',
      type: 'checkbox',
      label: 'Дозволено часткову передоплату при оплаті кур\'єру',
      defaultValue: true,
    },
    {
      name: 'partialPrepaymentPercent',
      type: 'number',
      label: '% мінімальної передоплати',
      defaultValue: 30,
      min: 0,
      max: 100,
    },
    {
      name: 'fiscalReceiptEnabled',
      type: 'checkbox',
      label: 'Фіскальні чеки через ПРРО Checkbox',
      defaultValue: true,
    },
    {
      name: 'receiptDeliveryChannel',
      type: 'select',
      defaultValue: 'telegram_or_viber',
      options: [
        { label: 'Telegram або Viber (за каналом замовлення)', value: 'telegram_or_viber' },
        { label: 'Тільки Telegram', value: 'telegram_only' },
        { label: 'Тільки Viber', value: 'viber_only' },
      ],
    },
    {
      name: 'paymentExpiryMinutes',
      type: 'number',
      label: 'Час дії посилання на оплату (хв)',
      defaultValue: 60,
    },
  ],
};
