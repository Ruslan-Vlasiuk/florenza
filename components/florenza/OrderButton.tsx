'use client';

import type { ReactNode } from 'react';
import { MagneticButton } from './MagneticButton';
import { openLiya } from '@/lib/liya-bridge';

type Props = {
  bouquetSlug: string;
  bouquetId: string;
  bouquetName: string;
  variant?: 'primary' | 'outline' | 'ghost';
  children?: ReactNode;
  className?: string;
};

export function OrderButton({
  bouquetSlug,
  bouquetId,
  bouquetName,
  variant = 'primary',
  children,
  className,
}: Props) {
  return (
    <MagneticButton
      data-testid="order-button"
      onClick={() =>
        openLiya({
          intent: 'order',
          source: 'web_card',
          bouquetSlug,
          bouquetId,
          bouquetName,
        })
      }
      variant={variant}
      className={className}
    >
      {children ?? 'Замовити'}
    </MagneticButton>
  );
}
