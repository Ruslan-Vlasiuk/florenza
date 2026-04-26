import { NextRequest, NextResponse } from 'next/server';
import { processDeliveryConfirmations } from '@/lib/re-engagement/scenarios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET ?? 'florenza_cron'}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const result = await processDeliveryConfirmations();
  return NextResponse.json(result);
}
