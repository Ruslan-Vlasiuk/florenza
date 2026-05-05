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

export function AskInChatButton({
  bouquetSlug,
  bouquetId,
  bouquetName,
  variant = 'outline',
  children,
  className,
}: Props) {
  return (
    <MagneticButton
      data-testid="ask-in-chat-button"
      onClick={() =>
        openLiya({
          intent: 'question',
          source: 'web_card',
          bouquetSlug,
          bouquetId,
          bouquetName,
        })
      }
      variant={variant}
      className={className}
    >
      {children ?? 'Запитати в чаті'}
    </MagneticButton>
  );
}
