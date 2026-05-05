import type { Metadata } from 'next';
import { CartView } from '@/components/florenza/CartView';

export const metadata: Metadata = {
  title: 'Кошик',
  description: 'Кошик замовлень Florenza.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <article className="editorial-container py-12 md:py-20">
      <header className="mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Кошик
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)]">
          Ваше замовлення
        </h1>
      </header>

      <CartView />
    </article>
  );
}
