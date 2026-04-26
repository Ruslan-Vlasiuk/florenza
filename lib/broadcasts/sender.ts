/**
 * Broadcast sender. Manual broadcasts triggered from admin.
 * Enforces hard caps:
 *  - 1 broadcast per customer per 30 days
 *  - 4 broadcasts per customer per year
 * Skips blacklisted customers.
 */
import { getPayloadClient } from '../payload-client';
import { sendTelegramMessage } from '../messengers/telegram';
import { sendViberMessage } from '../messengers/viber';

const FREQ_CAP_DAYS = 30;
const ANNUAL_CAP = 4;

export async function sendBroadcast(broadcastId: string): Promise<{
  total: number;
  sent: number;
  skippedCap: number;
  skippedBlacklist: number;
  failed: number;
}> {
  const payload = await getPayloadClient();
  const broadcast: any = await payload.findByID({
    collection: 'broadcasts',
    id: broadcastId,
  });

  await payload.update({
    collection: 'broadcasts',
    id: broadcastId,
    data: { status: 'sending' },
  });

  // Build recipients list based on segmentation
  const audience = await selectAudience(broadcast);

  let sent = 0;
  let skippedCap = 0;
  let skippedBlacklist = 0;
  let failed = 0;

  for (const customer of audience) {
    // Blacklist check
    const bl = await payload.find({
      collection: 'client-blacklist',
      where: { phone: { equals: customer.phone } },
      limit: 1,
    });
    if (bl.totalDocs > 0) {
      skippedBlacklist++;
      continue;
    }

    if (!customer.broadcastOptIn) {
      skippedBlacklist++;
      continue;
    }

    // Cap check
    const recentSends = await payload.find({
      collection: 'broadcast-recipients',
      where: {
        and: [
          { customer: { equals: customer.id } },
          { sentAt: { greater_than: new Date(Date.now() - FREQ_CAP_DAYS * 24 * 60 * 60 * 1000).toISOString() } },
        ],
      },
      limit: 1,
    });
    if (recentSends.totalDocs > 0) {
      skippedCap++;
      continue;
    }

    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const annualSends = await payload.find({
      collection: 'broadcast-recipients',
      where: {
        and: [
          { customer: { equals: customer.id } },
          { sentAt: { greater_than: yearAgo } },
        ],
      },
      limit: 100,
    });
    if (annualSends.totalDocs >= ANNUAL_CAP) {
      skippedCap++;
      continue;
    }

    // Send
    try {
      const channel = customer.preferredChannel ?? 'telegram';
      const personalizedText = personalize(broadcast.message, customer);

      if (channel === 'telegram' && customer.telegramChatId) {
        await sendTelegramMessage(customer.telegramChatId, personalizedText);
      } else if (channel === 'viber' && customer.viberId) {
        await sendViberMessage(customer.viberId, personalizedText);
      } else {
        skippedBlacklist++;
        continue;
      }

      await payload.create({
        collection: 'broadcast-recipients',
        data: {
          broadcast: broadcastId,
          customer: customer.id,
          channel,
          status: 'sent',
          sentAt: new Date().toISOString(),
        } as any,
      });
      sent++;
    } catch (e) {
      console.error('[broadcast] failed for customer', customer.id, e);
      failed++;
    }
  }

  await payload.update({
    collection: 'broadcasts',
    id: broadcastId,
    data: {
      status: 'completed',
      recipientsCount: audience.length,
      deliveredCount: sent,
      sentAt: new Date().toISOString(),
    },
  });

  return { total: audience.length, sent, skippedCap, skippedBlacklist, failed };
}

async function selectAudience(broadcast: any): Promise<any[]> {
  const payload = await getPayloadClient();
  const seg = broadcast.segmentation ?? {};
  const where: any = { broadcastOptIn: { equals: true } };

  if (seg.targetAudience === 'recent_buyers' && seg.recentMonths) {
    const since = new Date(Date.now() - seg.recentMonths * 30 * 24 * 60 * 60 * 1000).toISOString();
    where.lastOrderAt = { greater_than: since };
  } else if (seg.targetAudience === 'vip' && seg.vipThreshold) {
    where.totalSpent = { greater_than_equal: seg.vipThreshold };
  }

  const r = await payload.find({
    collection: 'customers',
    where,
    limit: 5000,
  });
  return r.docs as any[];
}

function personalize(template: string, customer: any): string {
  return template
    .replace(/\{name\}/g, customer.name ?? '')
    .replace(/\{last_bouquet\}/g, customer.preferences?.find((p: any) => p.key === 'last_bouquet')?.value ?? '');
}
