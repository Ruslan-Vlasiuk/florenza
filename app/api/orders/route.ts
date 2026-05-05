import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPayloadClient } from '@/lib/payload-client';
import { sendNewOrderAdminAlert } from '@/lib/messengers/order-alert';

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
  paymentMethod: z.enum(['full_online', 'prepayment_50']),
});

// Order number generation lives in the Orders collection beforeChange hook
// (FL-YYYYMMDD-XXXXX format) — keeps the number unified between web checkout
// and create_pending_order tool.

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
        // orderNumber filled by beforeChange hook (FL-YYYYMMDD-XXXXX)
        status: 'new',
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
        paymentProvider: 'mono',
        createdBy: 'web_checkout',
      } as any,
    });

    // Telegram admin alert (best-effort; never blocks order success)
    await sendNewOrderAdminAlert({
      orderId: order.id,
      isSandbox,
      source: 'web_checkout',
      prepaymentRequired: data.paymentMethod === 'prepayment_50',
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
