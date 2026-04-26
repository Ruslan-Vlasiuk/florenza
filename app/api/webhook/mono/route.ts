import { NextRequest, NextResponse } from 'next/server';
import { verifyMonoWebhook } from '@/lib/payments/mono';
import { getPayloadClient } from '@/lib/payload-client';
import { sendAdminAlert } from '@/lib/messengers/admin-notify';
import { issueFiscalReceiptForOrder } from '@/lib/payments/issue-receipt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get('x-sign') ?? '';
  const ok = await verifyMonoWebhook(rawBody, sigHeader);
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 403 });

  try {
    const data = JSON.parse(rawBody);
    const { invoiceId, status, reference, amount } = data;
    const payload = await getPayloadClient();

    const ordersResult = await payload.find({
      collection: 'orders',
      where: { paymentIntentId: { equals: invoiceId } },
      limit: 1,
    });
    const order: any = ordersResult.docs[0];
    if (!order) {
      console.warn('[mono] order not found for invoice', invoiceId);
      return NextResponse.json({ ok: true });
    }

    if (status === 'success') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: order.totalAmount === amount / 100 ? 'paid' : 'paid_partial',
          paidAmount: amount / 100,
          remainingAmount: order.totalAmount - amount / 100,
          paidAt: new Date().toISOString(),
        } as any,
      });

      // Issue ПРРО receipt + send to customer
      await issueFiscalReceiptForOrder(order.id).catch((e: any) =>
        console.error('[checkbox] receipt failed', e),
      );

      await sendAdminAlert({
        kind: 'new_paid_order',
        title: `💰 Новий ОПЛАЧЕНИЙ заказ ${order.orderNumber}`,
        body: `Сума: ${amount / 100} грн. Доставка: ${order.deliveryDate} ${order.deliverySlot}.\nГотуйте до збору.`,
        urgency: 'normal',
        meta: { orderId: order.id },
      });
    } else if (status === 'failure' || status === 'expired') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'cancelled' },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[mono webhook] error:', e);
    return NextResponse.json({ error: 'webhook error' }, { status: 500 });
  }
}
