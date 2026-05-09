import { NextRequest, NextResponse } from 'next/server';
import { generateNextBlogPost } from '@/lib/ai/blog-pipeline';
import { getPayloadClient } from '@/lib/payload-client';

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

  // Read brand settings to determine daily quota
  const payload = await getPayloadClient();
  const settings: any = await payload.findGlobal({ slug: 'brand-settings' as any });
  if (settings?.aiPauseEnabled) {
    return NextResponse.json({ skipped: true, reason: 'AI paused' });
  }

  // Default: 1 article per day
  const result = await generateNextBlogPost();
  return NextResponse.json(result);
}
