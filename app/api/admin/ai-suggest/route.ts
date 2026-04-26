import { NextRequest, NextResponse } from 'next/server';
import {
  suggestBouquetName,
  suggestBouquetDescription,
  suggestSeoMeta,
} from '@/lib/ai/content-helpers';
import { getPayloadClient } from '@/lib/payload-client';

export const runtime = 'nodejs';

/**
 * Admin-only endpoint for AI suggestions in card editors.
 * Auth: requires Payload session cookie.
 */
export async function POST(req: NextRequest) {
  // Trust Payload auth: check user via cookie
  const payload = await getPayloadClient();
  const result = await payload.auth({ headers: req.headers });
  if (!result.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const { type, context } = body;

  try {
    switch (type) {
      case 'bouquet_name': {
        const names = await suggestBouquetName(context);
        return NextResponse.json({ suggestions: names });
      }
      case 'bouquet_description_short': {
        const desc = await suggestBouquetDescription({ ...context, short: true });
        return NextResponse.json({ suggestion: desc });
      }
      case 'bouquet_description_full': {
        const desc = await suggestBouquetDescription({ ...context, short: false });
        return NextResponse.json({ suggestion: desc });
      }
      case 'seo_meta': {
        const meta = await suggestSeoMeta(context);
        return NextResponse.json(meta);
      }
      default:
        return NextResponse.json({ error: 'Unknown suggestion type' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
