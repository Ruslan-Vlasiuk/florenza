import { NextRequest, NextResponse } from 'next/server';
import { processDeliveryConfirmations } from '@/lib/re-engagement/scenarios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const result = await processDeliveryConfirmations();
  return NextResponse.json(result);
}
