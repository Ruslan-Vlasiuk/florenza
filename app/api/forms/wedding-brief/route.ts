import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';
import { sendAdminAlert } from '@/lib/messengers/admin-notify';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const lim = rateLimit(`form-wedding:${ip}`, 3, 10 * 60_000); // 3 per 10 min
    if (!lim.allowed) {
      return NextResponse.json(
        { error: 'Забагато спроб. Спробуйте через 10 хвилин.' },
        { status: 429, headers: { 'Retry-After': String(lim.retryAfterSec) } },
      );
    }
    const data = await req.json();
    const payload = await getPayloadClient();

    const created = await payload.create({
      collection: 'wedding-briefs',
      data: {
        brideName: data.brideName,
        phone: data.phone,
        weddingDate: data.weddingDate,
        venue: data.venue,
        guestCount: Number(data.guestCount) || undefined,
        styleNotes: data.styleNotes,
        budget: data.budget,
        whatNeeded: Array.isArray(data.whatNeeded) ? data.whatNeeded : [data.whatNeeded].filter(Boolean),
        additionalNotes: data.additionalNotes,
        status: 'new',
      } as any,
    });

    await sendAdminAlert({
      kind: 'escalation',
      title: '👰 Новий весільний бриф',
      body: `${data.brideName}, дата ${data.weddingDate}. Бюджет: ${data.budget}. Телефон: ${data.phone}`,
      urgency: 'high',
      meta: { briefId: created.id },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    console.error('[wedding-brief]', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
