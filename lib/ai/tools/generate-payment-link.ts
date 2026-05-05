import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';
import { createMonoPayment } from '../../payments/mono';
import { createLiqPayPayment } from '../../payments/liqpay';
import { recordPaymentLink } from '../../payments/order-db';

export const generatePaymentLink: ToolDef = {
  name: 'generate_payment_link',
  description:
    'Генерує посилання на оплату для замовлення. Повертає URL який клієнт відкриває.',
  input_schema: {
    type: 'object',
    properties: {
      order_id: { type: 'string' },
      provider: {
        type: 'string',
        enum: ['mono', 'liqpay'],
        default: 'mono',
        description: 'mono — основний, liqpay — резервний (якщо у клієнта проблеми з Mono)',
      },
      amount_override: {
        type: 'number',
        description:
          'Опційно: сума для часткової передоплати (% від total). Якщо не вказано — повна сума.',
      },
    },
    required: ['order_id'],
  },
  handler: async (input, _ctx) => {
    const payload = await getPayloadClient();

    // Sandbox guard — block real payment-link generation when paymentMode=sandbox.
    const brandSettings: any = await payload
      .findGlobal({ slug: 'brand-settings' as any })
      .catch(() => ({}));
    if (brandSettings?.paymentMode === 'sandbox') {
      return {
        sandbox: true,
        paymentUrl: null,
        message:
          'Sandbox: посилання на оплату не генерується. Скажи клієнту: "Замовлення прийнято, дякую! Зв\'яжемось протягом години для підтвердження. Оплата — готівкою або карткою кур\'єру при доставці." Не вживай особистих імен.',
      };
    }

    const order = (await payload.findByID({
      collection: 'orders',
      id: input.order_id,
    })) as any;

    const amount = input.amount_override ?? order.totalAmount;
    const provider = input.provider ?? 'mono';

    let result: { url: string; intentId: string };
    try {
      if (provider === 'mono') {
        result = await createMonoPayment({
          amount,
          orderRef: order.orderNumber,
          description: `Замовлення ${order.orderNumber} — Florenza`,
          redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order-thank-you?order=${order.orderNumber}`,
          webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mono`,
        });
      } else {
        result = await createLiqPayPayment({
          amount,
          orderRef: order.orderNumber,
          description: `Замовлення ${order.orderNumber} — Florenza`,
          resultUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order-thank-you?order=${order.orderNumber}`,
          serverUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/liqpay`,
        });
      }
    } catch (e) {
      return {
        error: true,
        message: `Не вдалось створити посилання: ${(e as Error).message}. Можете спробувати інший провайдер.`,
      };
    }

    await recordPaymentLink({
      orderId: input.order_id,
      intentId: result.intentId,
      url: result.url,
    });

    return {
      paymentUrl: result.url,
      provider,
      amount,
      message: `Ось посилання на оплату ${amount} грн через ${provider === 'mono' ? 'Monobank' : 'LiqPay (ПриватБанк)'}: ${result.url}`,
    };
  },
};
