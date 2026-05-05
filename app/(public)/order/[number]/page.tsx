import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload-client';
import { formatPrice } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Замовлення',
  robots: { index: false, follow: false },
};

async function loadOrder(orderNumber: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      overrideAccess: true,
    });
    return (result.docs[0] as any) ?? null;
  } catch {
    return null;
  }
}

async function loadPaymentMode() {
  try {
    const payload = await getPayloadClient();
    const settings: any = await payload.findGlobal({ slug: 'brand-settings' as any });
    return (settings?.paymentMode ?? 'sandbox') as 'sandbox' | 'production';
  } catch {
    return 'sandbox' as const;
  }
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const [order, paymentMode] = await Promise.all([loadOrder(number), loadPaymentMode()]);
  if (!order) notFound();

  const isSandbox = paymentMode === 'sandbox';
  const items = (order.bouquetSnapshot?.items as any[]) ?? [];

  return (
    <article className="editorial-container py-12 md:py-20 max-w-3xl">
      <header className="mb-10 md:mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Замовлення прийнято
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)] mb-3">
          Дякуємо! 🌿
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          Номер замовлення: <strong className="text-[var(--color-deep-forest)]">{order.orderNumber}</strong>
        </p>
      </header>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-[var(--color-cream-soft)] p-6 md:p-8 mb-8">
        <p className="text-[var(--color-deep-forest)] leading-relaxed">
          {isSandbox ? (
            <>
              Це <strong>тестовий режим</strong> прийому онлайн-оплат. Ми отримали ваше
              замовлення та зв&apos;яжемось з вами протягом години для підтвердження
              деталей. Оплата — при доставці готівкою або карткою кур&apos;єру.
            </>
          ) : order.paymentProvider === 'mono' ? (
            <>
              Замовлення оформлено. Посилання на оплату надішлемо в Telegram /
              Viber через хвилину. Якщо не отримаєте — зателефонуємо.
            </>
          ) : (
            <>
              Замовлення оформлено. Ми зв&apos;яжемось з вами для підтвердження. Оплата
              — при доставці.
            </>
          )}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] mb-4">
          Що замовили
        </h2>
        <ul className="divide-y divide-[var(--color-border-soft)]">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-deep-forest)]">{item.name}</p>
                <p className="text-[var(--color-text-muted)]">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="tabular-nums text-[var(--color-deep-forest)]">
                {formatPrice(item.quantity * item.price)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
        <div className="rounded-md border border-[var(--color-border-soft)] p-5">
          <h3 className="font-medium text-[var(--color-deep-forest)] mb-3 uppercase tracking-wider text-xs">
            Доставка
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            {order.addressStreet}, {order.addressBuilding}
            {order.addressApartment ? `, кв. ${order.addressApartment}` : ''}
          </p>
          <p className="text-[var(--color-text-secondary)]">
            {order.deliveryDate} · {order.deliverySlot}
            {order.isUrgent ? ' · термінова' : ''}
          </p>
        </div>
        <div className="rounded-md border border-[var(--color-border-soft)] p-5">
          <h3 className="font-medium text-[var(--color-deep-forest)] mb-3 uppercase tracking-wider text-xs">
            Підсумок
          </h3>
          <dl className="space-y-1">
            <div className="flex justify-between">
              <dt className="text-[var(--color-text-secondary)]">Букети</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal ?? 0)}</dd>
            </div>
            {order.deliveryFee != null && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-secondary)]">Доставка</dt>
                <dd className="tabular-nums">
                  {order.deliveryFee === 0 ? 'Безкоштовно' : formatPrice(order.deliveryFee)}
                </dd>
              </div>
            )}
            {order.urgentSurcharge ? (
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-secondary)]">Термінова</dt>
                <dd className="tabular-nums">{formatPrice(order.urgentSurcharge)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-[var(--color-border-soft)] pt-2 mt-2 font-medium">
              <dt>Разом</dt>
              <dd className="tabular-nums">{formatPrice(order.totalAmount)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="flex gap-3 justify-center">
        <Link
          href="/buketu"
          className="inline-flex items-center px-6 py-3 rounded-md bg-[#2c3e2d] !text-[#f5f0e8] font-medium hover:bg-[#3d5240] transition-colors"
        >
          До каталогу
        </Link>
        <Link
          href="/contacts"
          className="inline-flex items-center px-6 py-3 rounded-md border border-[var(--color-deep-forest)] text-[var(--color-deep-forest)] font-medium hover:bg-[var(--color-deep-forest)] hover:!text-[var(--color-cream)] transition-colors"
        >
          Контакти
        </Link>
      </div>
    </article>
  );
}
