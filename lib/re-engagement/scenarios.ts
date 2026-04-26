/**
 * Two automatic re-engagement scenarios:
 *  1. Delivery confirmation — T+4h after order status changed to "delivered"
 *  2. Repeat recipient — real-time inside Лія chat (handled in conversation context)
 *
 * Cron entrypoint runs every 15 minutes via /api/cron/re-engagement.
 */
import { getPayloadClient } from '../payload-client';
import { sendTelegramMessage } from '../messengers/telegram';
import { sendViberMessage } from '../messengers/viber';

export async function processDeliveryConfirmations(): Promise<{ sent: number; skipped: number }> {
  const payload = await getPayloadClient();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  // Find orders delivered ~4h ago that haven't received confirmation yet
  const r = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'delivered' } },
        { updatedAt: { less_than: fourHoursAgo } },
      ],
    },
    limit: 50,
    depth: 1,
  });

  let sent = 0;
  let skipped = 0;

  for (const order of r.docs as any[]) {
    // Check if confirmation already sent
    const log = await payload.find({
      collection: 're-engagement-log',
      where: {
        and: [
          { order: { equals: order.id } },
          { scenario: { equals: 'delivery_confirmation' } },
        ],
      },
      limit: 1,
    });
    if (log.totalDocs > 0) {
      skipped++;
      continue;
    }

    const conv = order.conversation
      ? await payload.findByID({ collection: 'conversations', id: order.conversation })
      : null;
    if (!conv) {
      skipped++;
      continue;
    }

    const recipientName = order.recipientName ?? 'отримувач';
    const message = `Ваш букет вже у одержувача. Сподіваюсь, ${recipientName} усміхнулась 🤍\n\nЧи все було добре з нашого боку?`;

    try {
      if ((conv as any).channel === 'telegram') {
        await sendTelegramMessage((conv as any).externalId, message);
      } else if ((conv as any).channel === 'viber') {
        await sendViberMessage((conv as any).externalId, message);
      } else {
        skipped++;
        continue;
      }

      await payload.create({
        collection: 're-engagement-log',
        data: {
          customer: order.customer,
          order: order.id,
          scenario: 'delivery_confirmation',
          channel: (conv as any).channel,
          message,
          status: 'sent',
        } as any,
      });

      sent++;
    } catch (e) {
      console.error('[re-engagement] failed for order', order.orderNumber, e);
      skipped++;
    }
  }

  return { sent, skipped };
}
