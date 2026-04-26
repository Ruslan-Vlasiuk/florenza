import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';
import { sendAdminAlert } from '@/lib/messengers/admin-notify';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const payload = await getPayloadClient();
    const created = await payload.create({
      collection: 'corporate-inquiries',
      data: {
        companyName: data.companyName,
        contactName: data.contactName,
        phone: data.phone,
        serviceType: data.serviceType,
        frequency: data.frequency,
        budgetPerInstance: data.budgetPerInstance,
        notes: data.notes,
        status: 'new',
      } as any,
    });

    await sendAdminAlert({
      kind: 'escalation',
      title: '🏢 Новий корпоративний запит',
      body: `${data.companyName} (${data.contactName}): ${data.serviceType}. Тел: ${data.phone}.`,
      urgency: 'high',
      meta: { inquiryId: created.id },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    console.error('[corporate-inquiry]', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
