'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 1200, suffix: '+', label: 'букетів зібрано вручну' },
  { value: 60, suffix: ' хв', label: 'термінова доставка' },
  { value: 4, label: 'міста зони покриття' },
  { value: 24, suffix: '/7', label: 'приймаємо замовлення' },
];

function AnimatedNumber({ value, suffix, durationMs = 1400 }: { value: number; suffix?: string; durationMs?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, durationMs, reduced]);

  return (
    <span ref={ref}>
      {display.toLocaleString('uk-UA')}
      {suffix}
    </span>
  );
}

export function StatsRibbon() {
  return (
    <section className="border-y border-[var(--color-border-soft)] py-16 md:py-20 relative">
      <div className="editorial-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left"
            >
              <p className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-none text-[var(--color-deep-forest)]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--color-sage-deep)] leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
