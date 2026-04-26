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
      <div className="editorial-container flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-deep-forest)]"
          aria-label="Florenza — головна"
        >
          florenza
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-[var(--color-deep-forest)]"
          onClick={() => setOpen(true)}
          aria-label="Відкрити меню"
        >
          <Menu size={24} />
        </button>
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
