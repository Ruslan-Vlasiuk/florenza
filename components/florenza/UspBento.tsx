'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Custom SVG illustrations — hand-tuned for the Florenza palette,
// no off-the-shelf icons. Each one tells the story of its USP.

function ClockIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
      <circle cx="32" cy="32" r="26" strokeOpacity="0.4" />
      <circle cx="32" cy="32" r="22" />
      <path d="M32 14 L32 32 L42 38" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
      {/* Hour markers */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * 90 - 90) * (Math.PI / 180);
        const x1 = 32 + Math.cos(angle) * 22;
        const y1 = 32 + Math.sin(angle) * 22;
        const x2 = 32 + Math.cos(angle) * 18;
        const y2 = 32 + Math.sin(angle) * 18;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.6" />;
      })}
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
      {/* Hand-drawn florist sprig */}
      <path d="M32 8 L 32 56" />
      <path d="M32 18 C 22 16, 16 18, 14 22 C 18 22, 26 21, 32 18" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 28 C 42 26, 48 28, 50 32 C 46 32, 38 31, 32 28" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 38 C 22 36, 16 38, 14 42 C 18 42, 26 41, 32 38" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 48 C 42 46, 48 48, 50 52 C 46 52, 38 51, 32 48" fill="currentColor" fillOpacity="0.18" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
      {/* Two overlapping chat bubbles */}
      <path d="M14 18 H 44 a 4 4 0 0 1 4 4 V 36 a 4 4 0 0 1 -4 4 H 26 L 18 48 V 40 H 14 a 4 4 0 0 1 -4 -4 V 22 a 4 4 0 0 1 4 -4 z" />
      <circle cx="22" cy="29" r="1.5" fill="currentColor" />
      <circle cx="29" cy="29" r="1.5" fill="currentColor" />
      <circle cx="36" cy="29" r="1.5" fill="currentColor" />
      {/* Tiny notification dot */}
      <circle cx="50" cy="14" r="4" fill="currentColor" fillOpacity="0.4" />
      <circle cx="50" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
      {/* Folded paper map outline with three pin dots */}
      <path d="M8 16 L 22 12 L 42 18 L 56 14 L 56 50 L 42 54 L 22 48 L 8 52 Z" />
      <path d="M22 12 L 22 48" strokeOpacity="0.4" strokeDasharray="2 3" />
      <path d="M42 18 L 42 54" strokeOpacity="0.4" strokeDasharray="2 3" />
      {/* Three pins */}
      <circle cx="16" cy="32" r="2.5" fill="currentColor" />
      <circle cx="32" cy="28" r="2.5" fill="currentColor" />
      <circle cx="48" cy="34" r="2.5" fill="currentColor" />
    </svg>
  );
}

interface Item {
  illustration: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  metric?: { value: string; label: string };
}

const ITEMS: Item[] = [
  {
    illustration: <ClockIcon />,
    eyebrow: 'Швидкість',
    title: 'Доставка за 60–90 хвилин',
    body: 'Термінова доставка по Ірпеню, Бучі, Гостомелю — за годину після оплати. Жоден інший флорист в регіоні цього не пропонує.',
    metric: { value: '60′', label: 'Середній час' },
  },
  {
    illustration: <SparkIcon />,
    eyebrow: 'Підхід',
    title: 'Авторська флористика',
    body: 'Ми не «продаємо квіти». Ми складаємо букети, які тримаються в одному ключі — від кольору до настрою.',
    metric: { value: '36', label: 'Композицій' },
  },
  {
    illustration: <ChatIcon />,
    eyebrow: 'Доступність',
    title: 'Замовлення 24/7',
    body: 'Telegram або чат на сайті — підкажемо, оформимо, приймемо оплату. Швидко і у будь-який час дня і ночі.',
    metric: { value: '< 1 хв', label: 'Час відповіді' },
  },
  {
    illustration: <MapIcon />,
    eyebrow: 'Локація',
    title: 'Ірпінь, Буча, Гостомель, Київ',
    body: 'Бутік в Ірпені, доставка по всьому ИБГ та ближньому Києву. Локально, з рукою на пульсі.',
    metric: { value: '4 міста', label: 'Зона покриття' },
  },
];

export function UspBento() {
  return (
    <section className="editorial-container py-16 md:py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 md:p-10 rounded-[var(--radius-lg)] bg-white/70 backdrop-blur-[3px] border border-[var(--color-border-soft)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(44,62,45,0.12)]"
          >
            {/* Big number watermark in corner */}
            <span
              className="absolute -bottom-4 -right-2 font-[var(--font-display)] leading-none text-[8rem] md:text-[10rem] text-[var(--color-deep-forest)] opacity-[0.04] pointer-events-none select-none"
              style={{ fontVariationSettings: "'opsz' 144, 'wght' 600" }}
            >
              0{i + 1}
            </span>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 text-[var(--color-sage-deep)]">
                  {item.illustration}
                </div>
                <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)] mt-1">
                  {item.eyebrow}
                </p>
              </div>

              <h3 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-deep-forest)] leading-tight mb-3">
                {item.title}
              </h3>

              <p className="text-[var(--color-text-secondary)] leading-[1.7] mb-6">
                {item.body}
              </p>

              {item.metric && (
                <div className="pt-5 border-t border-[var(--color-border-soft)] flex items-baseline justify-between">
                  <p
                    className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]"
                    style={{ fontStyle: 'italic' }}
                  >
                    {item.metric.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                    {item.metric.label}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
