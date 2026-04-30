'use client';

import { motion } from 'framer-motion';

const PRESS = [
  { name: 'VOGUE', subtitle: 'Україна', year: '2026' },
  { name: 'L\'OFFICIEL', subtitle: 'Київ', year: '2026' },
  { name: 'ELLE', subtitle: 'Україна', year: '2026' },
  { name: 'BAZAAR', subtitle: 'Ukraine', year: '2026' },
  { name: 'KINFOLK', subtitle: 'Issue 47', year: '2026' },
  { name: 'CEREAL', subtitle: 'Volume 24', year: '2026' },
];

/**
 * Trust-signal press logos. Set as TYPOGRAPHY (not bitmap logos) so the
 * unit looks intentional and editorial. Mock values today — real press
 * mentions can replace them when Florenza gets featured.
 */
export function PressStrip() {
  return (
    <section
      className="py-12 md:py-16 border-y"
      style={{ borderColor: 'rgba(44,62,45,0.08)' }}
    >
      <div className="editorial-container">
        <p className="text-center text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)] opacity-70 mb-8">
          ✦ As featured in ✦
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-16 gap-y-8">
          {PRESS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 0.55, y: 0 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className="text-center cursor-default transition-opacity"
            >
              <p
                className="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-deep-forest)] tracking-[0.08em]"
                style={{
                  fontVariationSettings: "'opsz' 144, 'wght' 320",
                }}
              >
                {p.name}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                {p.subtitle} · {p.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
