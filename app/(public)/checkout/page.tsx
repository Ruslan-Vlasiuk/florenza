import type { Metadata } from 'next';
import { CheckoutFlow } from '@/components/florenza/CheckoutFlow';
import { getPayloadClient } from '@/lib/payload-client';

export const metadata: Metadata = {
  title: 'Оформлення замовлення',
  description: 'Оформіть замовлення в Florenza.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

async function loadCheckoutContext() {
  try {
    const payload = await getPayloadClient();
    const settings: any = await payload.findGlobal({ slug: 'brand-settings' as any });
    return {
      paymentMode: (settings?.paymentMode ?? 'sandbox') as 'sandbox' | 'production',
      sandboxBannerText: settings?.sandboxBannerText ?? '',
    };
  } catch {
    return { paymentMode: 'sandbox' as const, sandboxBannerText: '' };
  }
}

export default async function CheckoutPage() {
  const ctx = await loadCheckoutContext();

  return (
    <article className="editorial-container py-12 md:py-20">
      <header className="mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Оформлення
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)]">
          Останній крок
        </h1>
      </header>

      <CheckoutFlow paymentMode={ctx.paymentMode} />
    </article>
  );
}
