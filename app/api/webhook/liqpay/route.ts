import { NextRequest, NextResponse } from 'next/server';
import { verifyLiqPayWebhook, decodeLiqPayPayload } from '@/lib/payments/liqpay';
import { getPayloadClient } from '@/lib/payload-client';
import { sendAdminAlert } from '@/lib/messengers/admin-notify';
import { issueFiscalReceiptForOrder } from '@/lib/payments/issue-receipt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = String(formData.get('data') ?? '');
  const signature = String(formData.get('signature') ?? '');

  if (!verifyLiqPayWebhook(data, signature)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 403 });
  }

  try {
    const payload = decodeLiqPayPayload(data);
    const { order_id, status, amount } = payload;
    const pl = await getPayloadClient();

    const r = await pl.find({
      collection: 'orders',
      where: { orderNumber: { equals: order_id } },
      limit: 1,
    });
    const order: any = r.docs[0];
    if (!order) return NextResponse.json({ ok: true });

    if (['success', 'sandbox', 'wait_accept', 'subscribed'].includes(status)) {
      await pl.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: order.totalAmount === amount ? 'paid' : 'paid_partial',
          paidAmount: amount,
          remainingAmount: order.totalAmount - amount,
          paidAt: new Date().toISOString(),
        } as any,
      });
      await issueFiscalReceiptForOrder(order.id).catch(() => {});
      await sendAdminAlert({
        kind: 'new_paid_order',
        title: `💰 Новий ОПЛАЧЕНИЙ заказ ${order.orderNumber}`,
        body: `Сума: ${amount} грн. Доставка: ${order.deliveryDate} ${order.deliverySlot}.`,
        urgency: 'normal',
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[liqpay webhook] error:', e);
    return NextResponse.json({ error: 'webhook error' }, { status: 500 });
  }
}
