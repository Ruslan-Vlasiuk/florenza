'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart, cartCount } from '@/lib/cart/store';

export function CartIcon({ className = '' }: { className?: string }) {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      aria-label={`Кошик${count ? `: ${count}` : ''}`}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-deep-forest)] hover:bg-[var(--color-cream-soft)] transition-colors ${className}`}
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-deep-forest)] text-[var(--color-cream)] text-[11px] font-medium flex items-center justify-center"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
