'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface DiscountTimerProps {
  endAt: string | Date;
  compact?: boolean;
  prefix?: string;
}

export function DiscountTimer({ endAt, compact = false, prefix }: DiscountTimerProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const end = typeof endAt === 'string' ? new Date(endAt) : endAt;
  const diff = Math.max(0, end.getTime() - now.getTime());
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (compact) {
    let text: string;
    if (days >= 1) text = `діє ще ${days} ${pluralize(days, ['день', 'дні', 'днів'])}`;
    else if (hours >= 1) text = `діє ${hours} ${pluralize(hours, ['година', 'години', 'годин'])}`;
    else text = `діє ${minutes} хв`;
    return (
      <p className="mt-2 text-xs text-[var(--color-sage-deep)] uppercase tracking-wider">
        ⏱ {text}
      </p>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 text-[var(--color-deep-forest)]')}>
      {prefix && <span className="text-sm">{prefix}</span>}
      <TimerCell value={days} label="днів" />
      <Separator />
      <TimerCell value={hours} label="годин" />
      <Separator />
      <TimerCell value={minutes} label="хв" />
      <Separator />
      <TimerCell value={seconds} label="сек" />
    </div>
  );
}

function TimerCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[40px]">
      <span className="font-[var(--font-display)] text-2xl tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return <span className="text-2xl text-[var(--color-text-muted)]">:</span>;
}

function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
