import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_IP_SALT ?? 'florenza_default_salt';
  // Truncate IPv4 last octet (/24) for additional anonymization
  const truncated = ip.split('.').length === 4 ? ip.split('.').slice(0, 3).join('.') + '.0' : ip;
  return crypto.createHash('sha256').update(truncated + salt).digest('hex').slice(0, 16);
}

function hashSession(sid: string): string {
  return crypto.createHash('sha256').update(sid).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, sessionId, pagePath, referrer, utm, meta } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0';
    const userAgent = req.headers.get('user-agent') ?? '';

    const payload = await getPayloadClient();
    await payload.create({
      collection: 'analytics-events',
      data: {
        eventType,
        sessionHash: sessionId ? hashSession(sessionId) : undefined,
        ipHash: hashIp(ip),
        pagePath,
        referrer,
        userAgent,
        utmSource: utm?.source,
        utmMedium: utm?.medium,
        utmCampaign: utm?.campaign,
        meta,
        channel: 'web',
        createdAt: new Date().toISOString(),
      } as any,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[analytics]', e);
    return NextResponse.json({ ok: true }); // never block client
  }
}
