'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';

/**
 * Dramatic full-bleed dark section for the rose collection.
 * Burgundy mood, photographic backdrop with strong overlay, white type.
 * Inspired by Tom Ford / Bottega editorial product pages.
 */
export function BigRosesSection({ bouquets }: { bouquets: BouquetCardData[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  if (!bouquets.length) return null;

  return (
    <section ref={ref} className="relative py-24 md:py-36 overflow-hidden">
      {/* Photographic backdrop with parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: bgY, scale: bgScale }}
      >
        <Image
          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=2000&q=85&auto=format&fit=crop"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Multi-layered dark overlay — burgundy mood, vignette, gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 100% at 30% 30%, rgba(60, 20, 30, 0.55) 0%, rgba(20, 6, 10, 0.95) 80%),
            linear-gradient(180deg, rgba(20,6,10,0.4) 0%, rgba(20,6,10,0.85) 100%)
          `,
        }}
      />

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
            <p className="mt-6 text-base md:text-lg leading-relaxed max-w-md" style={{ color: 'rgba(245,232,224,0.78)' }}>
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
              className="bg-[rgba(245,232,224,0.04)] backdrop-blur-[3px] rounded-[var(--radius-lg)] p-3 border border-[rgba(245,232,224,0.08)]"
            >
              <BouquetCard bouquet={b} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
