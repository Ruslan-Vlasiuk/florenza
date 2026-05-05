'use client';

import { useEffect, useState } from 'react';

type Props = {
  enabled: boolean;
  text: string;
};

const STORAGE_KEY = 'florenza:sandbox-banner-dismissed';

export function SandboxPaymentBanner({ enabled, text }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setDismissed(true);
    }
  }, []);

  if (!enabled || dismissed || !mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="sandbox-payment-banner"
      className="sticky top-0 z-50 flex w-full items-center justify-center gap-3 border-b border-[var(--color-sage)]/30 bg-[var(--color-sage)]/15 px-4 py-2 text-center text-sm text-[var(--color-deep-forest)]"
    >
      <span className="max-w-2xl">{text}</span>
      <button
        type="button"
        aria-label="Сховати банер"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(STORAGE_KEY, 'true');
          } catch {
            /* sessionStorage blocked — accept dismissal in-memory only */
          }
        }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-[var(--color-sage)]/30"
      >
        ✕
      </button>
    </div>
  );
}
