'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { label: 'Каталог', href: '/buketu' },
  { label: 'Весільна', href: '/vesilna-floristyka' },
  { label: 'Корпоратив', href: '/korporatyvna-floristyka' },
  { label: 'Журнал', href: '/zhurnal' },
  { label: 'Про нас', href: '/about' },
  { label: 'Контакти', href: '/contacts' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-md bg-[var(--color-cream)]/80 border-b border-[var(--color-border-soft)]'
          : 'bg-transparent',
      )}
    >
      <div className="editorial-container flex items-center justify-between py-4 gap-6">
        <Link
          href="/"
          className="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-deep-forest)] flex items-center gap-2 group"
          aria-label="Florenza — головна"
        >
          {/* Tiny F monogram in a circle */}
          <span
            className="hidden md:inline-flex w-9 h-9 rounded-full items-center justify-center bg-[var(--color-deep-forest)] text-[var(--color-cream)] text-base font-[var(--font-display)] transition-transform duration-500 group-hover:rotate-[-12deg]"
            style={{ fontStyle: 'italic', fontVariationSettings: "'opsz' 36, 'wght' 320" }}
            aria-hidden="true"
          >
            F
          </span>
          florenza
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)] transition-colors group/link"
            >
              <span>{item.label}</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-deep-forest)] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
              />
            </Link>
          ))}
        </nav>

        {/* Right rail: live availability + CTA + mobile menu */}
        <div className="flex items-center gap-4">
          {/* Live indicator — desktop only */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--color-sage-deep)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="uppercase tracking-[0.18em]">Сьогодні · 60 хв</span>
          </div>

          <Link
            href="/buketu"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-medium bg-[var(--color-deep-forest)] text-[var(--color-cream)] hover:bg-[var(--color-deep-forest-soft)] transition-colors"
          >
            Замовити →
          </Link>

          <button
            className="md:hidden p-2 -mr-2 text-[var(--color-deep-forest)]"
            onClick={() => setOpen(true)}
            aria-label="Відкрити меню"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--color-cream)] md:hidden"
          >
            <div className="editorial-container flex items-center justify-between py-4">
              <Link
                href="/"
                className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)]"
                onClick={() => setOpen(false)}
              >
                florenza
              </Link>
              <button
                className="p-2 -mr-2"
                onClick={() => setOpen(false)}
                aria-label="Закрити меню"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="editorial-container flex flex-col gap-6 mt-12 text-2xl font-[var(--font-display)]">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[var(--color-deep-forest)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
