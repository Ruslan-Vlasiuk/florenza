'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    n: '01',
    title: 'Вибір квітів',
    body: 'Варвара починає день з ринку — обирає тільки квіти в найкращій формі. Сезонність вирішує склад.',
  },
  {
    n: '02',
    title: 'Композиція',
    body: 'Кожен букет складається в один прохід — без розбирання й перескладання. Ритм палітри, висот, фактур.',
  },
  {
    n: '03',
    title: 'Обгортка',
    body: 'Льон, японський крафт або шовк — обгортка обирається під настрій композиції, не механічно.',
  },
  {
    n: '04',
    title: 'Доставка',
    body: 'Кур\'єр забирає букет з рук — не з холодильника. Привозить за 60–90 хвилин.',
  },
];

// Curated bouquet-only photos — one per process step.
const IMAGES = [
  'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1200&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&q=85&auto=format&fit=crop',
];

/**
 * Scroll-pinned process section. The image stays sticky while the user
 * scrolls through 4 steps; the image cross-fades to match the active step.
 * Native CSS sticky + framer-motion opacity transforms — no JS scroll
 * thrashing, GPU-accelerated.
 */
export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Each step's image opacity peaks at its scroll segment
  const opacity1 = useTransform(scrollYProgress, [0.05, 0.15, 0.30, 0.40], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.30, 0.40, 0.50, 0.60], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.50, 0.60, 0.70, 0.80], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.70, 0.80, 0.90, 1], [0, 1, 1, 1]);
  const stepOpacities = [opacity1, opacity2, opacity3, opacity4];

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="editorial-container">
        <header className="mb-16 max-w-2xl">
          <p className="section-eyebrow mb-4">Процес</p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
            Як народжується букет.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Чотири кроки, які перетворюють квіти з ринку у те, що залишають як
            спогад. Жодних шаблонів — ні в композиції, ні в обгортці.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8 md:gap-16">
          {/* Sticky image stack */}
          <div className="col-span-12 md:col-span-5 lg:col-span-6 relative">
            <div className="md:sticky md:top-24">
              <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)]">
                {IMAGES.map((src, i) => (
                  <motion.div
                    key={src}
                    className="absolute inset-0"
                    style={{ opacity: stepOpacities[i] }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
                {/* Step counter badge */}
                <motion.div
                  className="absolute top-5 left-5 bg-[var(--color-cream)] px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(44,62,45,0.15)]"
                >
                  <motion.p
                    className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)]"
                  >
                    ✦ Process · 04 steps ✦
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scrolling steps */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6 space-y-32 md:space-y-40">
            {STEPS.map((s, i) => (
              <motion.article
                key={s.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-6 mb-6">
                  <span
                    className="font-[var(--font-display)] text-6xl md:text-7xl leading-none text-[var(--color-sage)]"
                    style={{ fontStyle: 'italic' }}
                  >
                    {s.n}
                  </span>
                  <h3 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-deep-forest)] leading-tight">
                    {s.title}
                  </h3>
                </div>
                <p className="text-base md:text-lg leading-[1.85] text-[var(--color-text-secondary)] max-w-prose">
                  {s.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
