'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagneticButton } from './MagneticButton';
import { useCart } from '@/lib/cart/store';

type Props = {
  bouquetSlug: string;
  bouquetId: string;
  bouquetName: string;
  bouquetPrice: number;
  bouquetImageUrl: string;
  variant?: 'primary' | 'outline' | 'ghost';
  children?: ReactNode;
  className?: string;
  /**
   * 'cart' (default) — add to cart, navigate to /cart.
   * 'checkout' — add to cart, navigate to /checkout immediately.
   */
  flow?: 'cart' | 'checkout';
};

export function OrderButton({
  bouquetSlug,
  bouquetId,
  bouquetName,
  bouquetPrice,
  bouquetImageUrl,
  variant = 'primary',
  children,
  className,
  flow = 'cart',
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <MagneticButton
      data-testid="order-button"
      onClick={() => {
        if (busy) return;
        setBusy(true);
        addItem({
          bouquetId,
          slug: bouquetSlug,
          name: bouquetName,
          price: bouquetPrice,
          imageUrl: bouquetImageUrl,
        });
        router.push(flow === 'checkout' ? '/checkout' : '/cart');
      }}
      variant={variant}
      className={className}
    >
      {children ?? 'Замовити'}
    </MagneticButton>
  );
}
