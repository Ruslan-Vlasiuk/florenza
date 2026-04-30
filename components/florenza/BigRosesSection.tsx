'use client';

import { motion } from 'framer-motion';
import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';

/**
 * Big roses collection — stays transparent so the page-level
 * ScrollColorWash drives the background. The wash holds a deep burgundy
 * mood at this scroll position, so the section reads dramatic without
 * needing its own image overlay (which created a hard seam at section
 * boundaries when transitioning into Balloons).
 *
 * Cards float as glass tiles with subtle ivory tint so they remain
 * legible against whichever mood the wash provides at any scroll.
 */
export function BigRosesSection({ bouquets }: { bouquets: BouquetCardData[] }) {
  if (!bouquets.length) return null;

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <div className="editorial-container relative z-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 max-w-6xl">
          <div className="max-w-xl">
            <p className="section-eyebrow mb-4" style={{ color: '#d4a8a0' }}>
              Великі букети троянд
            </p>
            <h2
              className="font-[var(--font-display)] text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight"
              style={{ color: '#f5e8e0' }}
            >
              51, 101, 201 троянда
            </h2>
            <p
              className="mt-6 text-base md:text-lg leading-relaxed max-w-md"
              style={{ color: 'rgba(245,232,224,0.78)' }}
            >
              Преміум червоні троянди 60 см у класичному оформленні. Для річниць,
              освідчень та жестів, які запам&apos;ятовуються.
            </p>
          </div>
          <MagneticButton
            href="/buketu?type=veliki-troyandy"
            variant="ghost"
            className="self-start md:self-end shrink-0 [&]:text-[#f5e8e0] [&]:border-[#d4a8a0]"
          >
            Усі великі букети →
          </MagneticButton>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {bouquets.slice(0, 6).map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[rgba(245,232,224,0.93)] backdrop-blur-sm rounded-[var(--radius-lg)] p-3 shadow-[0_8px_30px_rgba(20,6,10,0.25)]"
            >
              <BouquetCard bouquet={b} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
