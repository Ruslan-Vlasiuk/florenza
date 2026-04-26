import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await getPayloadClient();
  const auth = await payload.auth({ headers: req.headers });
  if (!auth.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await payload.find({
    collection: 'orders',
    where: { createdAt: { greater_than_equal: today.toISOString() } },
    limit: 0,
  });

  const todayPaid = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { createdAt: { greater_than_equal: today.toISOString() } },
        { status: { in: ['paid', 'paid_partial', 'in_progress', 'in_transit', 'delivered'] } },
      ],
    },
    limit: 200,
  });
  const todayRevenue = (todayPaid.docs as any[]).reduce(
    (sum, o) => sum + (o.totalAmount ?? 0),
    0,
  );

  const unreadEscalations = await payload.find({
    collection: 'escalations',
    where: { status: { equals: 'open' } },
    limit: 0,
  });

  const pendingPayments = await payload.find({
    collection: 'orders',
    where: { status: { equals: 'pending_payment' } },
    limit: 0,
  });

  const settings: any = await payload.findGlobal({ slug: 'brand-settings' as any });

  return NextResponse.json({
    todayOrders: todayOrders.totalDocs,
    todayRevenue,
    unreadEscalations: unreadEscalations.totalDocs,
    pendingPayments: pendingPayments.totalDocs,
    aiSpentThisMonthUSD: settings?.currentMonthSpentUSD ?? 0,
    aiBudgetUSD: settings?.monthlyAIBudgetUSD ?? 30,
  });
}
