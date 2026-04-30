'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurFade } from './effects/BlurFade';

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'За скільки можна замовити сьогодні?',
    a: 'Стандартні букети з каталогу — на сьогодні до 19:00. Термінова доставка в Ірпінь / Бучу / Гостомель — 60–90 хвилин з моменту оплати. Великі букети троянд (від 151 шт) збираються за добу.',
  },
  {
    q: 'Як ви гарантуєте свіжість?',
    a: 'Усі квіти проходять денний відбір вранці. Якщо протягом 5 днів букет втратить вигляд — ми безкоштовно замінюємо. Безкоштовний пакетик cryzal (поживний засіб) ідеть з кожним замовленням.',
  },
  {
    q: 'Чи можна замовити персональну композицію?',
    a: 'Так. Опишіть привід / отримувача / бюджет в чаті — Варвара особисто складе пропозицію за 30 хвилин. Для весіль та корпоративних подій — окрема форма брифу.',
  },
  {
    q: 'Як платити?',
    a: 'Apple Pay, Google Pay, картки через Monobank Acquiring. Резервний канал — LiqPay (ПриватБанк). Можлива часткова передоплата (від 30%) з доплатою кур\'єру при доставці.',
  },
  {
    q: 'Чи доставляєте за межі ИБГ?',
    a: 'Так — ближнє Київ (Святошинський, Подільський райони). Для решти Києва — від 200 грн доплата. Інші міста — за запитом, узгоджуємо індивідуально.',
  },
  {
    q: 'А якщо отримувача не було вдома?',
    a: 'Кур\'єр чекає 15 хвилин і телефонує. Якщо не вдається доставити — ми зберігаємо букет у холодильнику до наступного дня без додаткової оплати.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="editorial-container py-24 md:py-32">
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="col-span-12 md:col-span-4">
          <BlurFade>
            <p className="section-eyebrow mb-4">FAQ · 06 questions</p>
            <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
              Що зазвичай питають.
            </h2>
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
              Якщо тут немає відповіді на ваше питання — напишіть в чаті. Зазвичай
              відповідаємо за хвилину.
            </p>
          </BlurFade>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ul className="space-y-px border-y border-[var(--color-border-soft)]">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={f.q}
                  className="border-b border-[var(--color-border-soft)] last:border-b-0"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-[var(--font-display)] text-lg md:text-xl text-[var(--color-deep-forest)] leading-snug pr-4">
                      <span className="text-[var(--color-sage-deep)] mr-3 font-mono text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {f.q}
                    </span>
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'bg-[var(--color-deep-forest)] text-[var(--color-cream)] border-[var(--color-deep-forest)] rotate-45'
                          : 'group-hover:border-[var(--color-deep-forest)]'
                      }`}
                    >
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 1 V11 M1 6 H11" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-base leading-[1.85] text-[var(--color-text-secondary)] pb-7 max-w-prose pr-12">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
