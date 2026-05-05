'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart, cartTotal } from '@/lib/cart/store';
import { formatPrice } from '@/lib/utils/format';

export function CartView() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = cartTotal(items);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-start">
      <ul className="divide-y divide-[var(--color-border-soft)]">
        {items.map((item) => (
          <li key={item.bouquetId} className="flex gap-4 md:gap-6 py-5">
            <Link
              href={`/buket/${item.slug}`}
              className="relative w-20 h-24 md:w-28 md:h-32 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-cream-soft)]"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(min-width: 768px) 112px, 80px"
                className="object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/buket/${item.slug}`}
                    className="font-[var(--font-display)] text-lg text-[var(--color-deep-forest)] leading-tight hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {formatPrice(item.price)} / шт
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.bouquetId)}
                  aria-label={`Видалити ${item.name}`}
                  className="p-1 -mr-1 text-[var(--color-text-muted)] hover:text-[var(--color-deep-forest)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 mt-3">
                <div className="inline-flex items-center rounded-full border border-[var(--color-border-soft)]">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.bouquetId, item.quantity - 1)}
                    aria-label="Зменшити"
                    className="w-9 h-9 flex items-center justify-center text-[var(--color-deep-forest)] disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[28px] text-center text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.bouquetId, item.quantity + 1)}
                    aria-label="Збільшити"
                    className="w-9 h-9 flex items-center justify-center text-[var(--color-deep-forest)]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-medium text-[var(--color-deep-forest)] tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-white shadow-sm p-6 md:p-8">
        <h2 className="font-[var(--font-display)] text-xl text-[var(--color-deep-forest)] mb-5">
          Підсумок
        </h2>

        <dl className="space-y-2 text-sm mb-5">
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-secondary)]">Сума букетів</dt>
            <dd className="tabular-nums text-[var(--color-deep-forest)]">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-secondary)]">Доставка</dt>
            <dd className="text-[var(--color-text-muted)]">Розрахунок на чекауті</dd>
          </div>
        </dl>

        <div className="flex items-baseline justify-between border-t border-[var(--color-border-soft)] pt-4 mb-6">
          <span className="text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            Разом
          </span>
          <span className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="block w-full text-center px-6 py-3.5 rounded-md bg-[#2c3e2d] !text-[#f5f0e8] font-medium hover:bg-[#3d5240] transition-colors"
        >
          Оформити замовлення
        </Link>

        <Link
          href="/buketu"
          className="block w-full text-center mt-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)]"
        >
          ← Продовжити покупки
        </Link>
      </aside>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-16 md:py-24">
      <p className="text-[var(--color-text-secondary)] text-lg mb-6">Кошик порожній.</p>
      <Link
        href="/buketu"
        className="inline-flex items-center px-6 py-3 rounded-md bg-[#2c3e2d] !text-[#f5f0e8] font-medium hover:bg-[#3d5240] transition-colors"
      >
        До каталогу
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 rounded-[var(--radius-md)] bg-[var(--color-cream-soft)]" />
      <div className="h-24 rounded-[var(--radius-md)] bg-[var(--color-cream-soft)]" />
    </div>
  );
}
