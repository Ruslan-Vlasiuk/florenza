'use client';

import { motion } from 'framer-motion';

const POINTS = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
        <path d="M24 6 L 24 42" />
        <path d="M24 16 C 16 14, 12 16, 10 20 C 14 20, 20 19, 24 16" fill="currentColor" fillOpacity="0.18" />
        <path d="M24 24 C 32 22, 36 24, 38 28 C 34 28, 28 27, 24 24" fill="currentColor" fillOpacity="0.18" />
        <path d="M24 32 C 16 30, 12 32, 10 36 C 14 36, 20 35, 24 32" fill="currentColor" fillOpacity="0.18" />
      </svg>
    ),
    title: 'Тільки сезонні квіти',
    body: 'Не зберігаємо застаре. Що не було продано за день — не стане завтра букетом.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
        <circle cx="24" cy="24" r="18" />
        <path d="M6 24 H 42 M24 6 Q 14 24, 24 42 Q 34 24, 24 6" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>
    ),
    title: 'Імпорт Голландія + Еквадор',
    body: 'Свіжий завоз двічі на тиждень. Преміум-сорти, які не доступні масовим квіткаркам.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
        <path d="M24 8 L 24 28" strokeWidth="1.4" />
        <path d="M24 28 L 16 38" />
        <path d="M24 28 L 32 38" />
        <circle cx="24" cy="14" r="6" fill="currentColor" fillOpacity="0.18" />
        <path d="M14 28 L 34 28" strokeWidth="0.6" strokeOpacity="0.5" />
      </svg>
    ),
    title: 'Складає Варвара особисто',
    body: 'Не цех і не складальник. Кожен букет проходить через її руки — і це видно.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
        <path d="M8 32 H 38 V 24 L 32 18 H 30 L 28 24 V 32" />
        <circle cx="16" cy="32" r="3" fill="currentColor" />
        <circle cx="34" cy="32" r="3" fill="currentColor" />
        <path d="M28 24 H 38" strokeOpacity="0.4" />
      </svg>
    ),
    title: 'Кур\'єр з рук в руки',
    body: 'Не Нова Пошта і не таксі. Власна доставка по Ірпеню за 60 хвилин з моменту оплати.',
  },
];

/**
 * "Чому Florenza" — 4 honest differentiators replacing the fake press
 * mentions strip. Concrete, brand-truthful, editorial-feeling.
 */
export function WhyFlorenza() {
  return (
    <section className="py-16 md:py-20 border-y border-[var(--color-border-soft)]">
      <div className="editorial-container">
        <header className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)] opacity-80 mb-3">
            ✦ Чому Florenza ✦
          </p>
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-deep-forest)]">
            Чотири речі, яких немає у решти.
          </h2>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 md:gap-x-10">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left"
            >
              <div className="w-10 h-10 mx-auto md:mx-0 mb-5 text-[var(--color-sage-deep)]">
                {p.icon}
              </div>
              <h3 className="font-[var(--font-display)] text-lg text-[var(--color-deep-forest)] leading-tight mb-2">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
