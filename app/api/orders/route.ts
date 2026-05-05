import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPayloadClient } from '@/lib/payload-client';
import { sendAdminAlert } from '@/lib/messengers/admin-notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cartItemSchema = z.object({
  bouquetId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().positive(),
  imageUrl: z.string().optional(),
  quantity: z.number().int().positive().max(50),
});

const orderRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(20),
  buyer: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().min(10).max(20),
  }),
  recipient: z
    .object({
      name: z.string().max(80).optional(),
      phone: z.string().max(20).optional(),
      sameAsBuyer: z.boolean().default(false),
    })
    .optional(),
  isAnonymous: z.boolean().default(false),
  delivery: z.object({
    addressStreet: z.string().min(2).max(200),
    addressBuilding: z.string().min(1).max(20),
    addressApartment: z.string().max(20).optional(),
    addressFloor: z.string().max(10).optional(),
    addressEntrance: z.string().max(10).optional(),
    addressIntercom: z.string().max(10).optional(),
    deliveryDate: z.string().min(8),
    deliverySlot: z.string().min(2).max(40),
    isUrgent: z.boolean().default(false),
    courierInstructions: z.string().max(500).optional(),
  }),
  cardMessage: z.string().max(500).optional(),
  paymentMethod: z.enum(['mono_online', 'cash_on_delivery', 'card_on_delivery']),
});

function makeOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FL-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const payload = await getPayloadClient();

    // Determine sandbox / production payment mode from BrandSettings.
    const brandSettings: any = await payload
      .findGlobal({ slug: 'brand-settings' as any })
      .catch(() => ({}));
    const isSandbox = brandSettings?.paymentMode !== 'production';

    const itemsSubtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const urgentSurcharge = data.delivery.isUrgent ? 150 : 0;
    const deliveryFee = itemsSubtotal >= 3000 ? 0 : 200;
    const totalAmount = itemsSubtotal + urgentSurcharge + deliveryFee;

    const primary = data.items[0];

    // Find or create customer by phone
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: { phone: { equals: data.buyer.phone } },
      limit: 1,
      overrideAccess: true,
    });
    let customerId: number | string | undefined = existingCustomer.docs[0]?.id;
    if (!customerId) {
      const created = await payload.create({
        collection: 'customers',
        overrideAccess: true,
        data: {
          name: data.buyer.name,
          phone: data.buyer.phone,
          preferredChannel: 'web_chat',
        } as any,
      });
      customerId = created.id as number | string;
    }

    // Payload+Postgres expects numeric IDs for relationships
    const bouquetIdNum = Number(primary.bouquetId);
    if (!Number.isFinite(bouquetIdNum)) {
      return NextResponse.json(
        { error: 'Невалідний ID букета' },
        { status: 400 },
      );
    }

    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderNumber: makeOrderNumber(),
        status: data.paymentMethod === 'mono_online' && !isSandbox ? 'pending_payment' : 'new',
        bouquet: bouquetIdNum,
        bouquetSnapshot: {
          items: data.items,
          itemsSubtotal,
        } as any,
        subtotal: itemsSubtotal,
        deliveryFee,
        urgentSurcharge,
        totalAmount,
        customer: customerId,
        buyerName: data.buyer.name,
        buyerPhone: data.buyer.phone,
        recipientName: data.recipient?.sameAsBuyer
          ? data.buyer.name
          : data.recipient?.name,
        recipientPhone: data.recipient?.sameAsBuyer
          ? data.buyer.phone
          : data.recipient?.phone,
        isAnonymous: data.isAnonymous,
        addressStreet: data.delivery.addressStreet,
        addressBuilding: data.delivery.addressBuilding,
        addressApartment: data.delivery.addressApartment,
        addressFloor: data.delivery.addressFloor,
        addressEntrance: data.delivery.addressEntrance,
        addressIntercom: data.delivery.addressIntercom,
        courierInstructions: data.delivery.courierInstructions,
        deliveryDate: data.delivery.deliveryDate,
        deliverySlot: data.delivery.deliverySlot,
        isUrgent: data.delivery.isUrgent,
        cardMessage: data.cardMessage,
        paymentProvider:
          data.paymentMethod === 'mono_online' ? 'mono' : 'cash_on_delivery',
        createdBy: 'web_checkout',
      } as any,
    });

    // Telegram admin alert (best-effort — never blocks order success).
    const itemsLine = data.items
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(', ');
    const paymentLabel =
      data.paymentMethod === 'mono_online'
        ? 'Mono online'
        : data.paymentMethod === 'card_on_delivery'
          ? 'картка кур\'єру'
          : 'готівка кур\'єру';
    const recipient = data.recipient?.sameAsBuyer
      ? 'отримувач = замовник'
      : `${data.recipient?.name ?? '—'} · ${data.recipient?.phone ?? '—'}`;
    const addressLine = `${data.delivery.addressStreet}, ${data.delivery.addressBuilding}${
      data.delivery.addressApartment ? `, кв. ${data.delivery.addressApartment}` : ''
    }`;

    sendAdminAlert({
      kind: 'new_paid_order',
      title: `🌸 Нове замовлення ${(order as any).orderNumber}${isSandbox ? ' · sandbox' : ''}`,
      body: [
        `Сума: ${totalAmount} грн (${paymentLabel})`,
        `Букети: ${itemsLine}`,
        `Замовник: ${data.buyer.name} · ${data.buyer.phone}`,
        `Отримувач: ${recipient}`,
        `Адреса: ${addressLine}`,
        `Доставка: ${data.delivery.deliveryDate} ${data.delivery.deliverySlot}${data.delivery.isUrgent ? ' · ТЕРМІНОВА' : ''}`,
        data.cardMessage ? `Листівка: ${data.cardMessage}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      urgency: data.delivery.isUrgent ? 'high' : 'normal',
      meta: { orderId: order.id, orderNumber: (order as any).orderNumber },
    }).catch((err) => {
      console.error('[admin-notify] failed to send Telegram alert:', err);
    });

    return NextResponse.json({
      ok: true,
      orderNumber: (order as any).orderNumber,
      orderId: order.id,
      isSandbox,
      paymentMethod: data.paymentMethod,
      totalAmount,
    });
  } catch (e) {
    console.error('[/api/orders] error:', e);
    return NextResponse.json(
      { error: 'Помилка обробки замовлення. Спробуйте ще раз.' },
      { status: 500 },
    );
  }
}
