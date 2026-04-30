'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MagneticButton } from './MagneticButton';
import { Petals } from './effects/Petals';

interface EditorialHeroProps {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

/**
 * Hero with three layered cinematic mechanics:
 *  1. Image side: parallax (slower than scroll) + slow zoom on scroll
 *  2. Text side: word-by-word blur reveal with editorial timing
 *  3. Background: drifting petals overlay (canvas, GPU-friendly)
 *  4. Bottom: subtle scroll indicator that fades on scroll
 */
export function EditorialHero({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: EditorialHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const words = title.split(' ');

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[92svh] grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden"
    >
      {/* Petals drift across whole hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Petals count={10} />
      </div>

      {/* Text side */}
      <motion.div
        className="md:col-span-6 lg:col-span-7 order-2 md:order-1 flex items-center editorial-container py-16 md:py-24 relative z-10"
        style={reduced ? undefined : { y: textY }}
      >
        <div className="max-w-xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="section-eyebrow mb-8"
            >
              {eyebrow}
            </motion.p>
          )}
          <h1
            className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] text-[var(--color-deep-forest)]"
            aria-label={title}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.2 + i * 0.09,
                  duration: 0.95,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.22em] italic-fraunces"
                style={{
                  fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'wght' 350",
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-8 text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-md"
            >
              {subtitle}
            </motion.p>
          )}
          {(ctaPrimary || ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              {ctaPrimary && (
                <MagneticButton href={ctaPrimary.href} variant="primary">
                  {ctaPrimary.label}
                </MagneticButton>
              )}
              {ctaSecondary && (
                <MagneticButton href={ctaSecondary.href} variant="outline">
                  {ctaSecondary.label}
                </MagneticButton>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Image side */}
      <div className="md:col-span-6 lg:col-span-5 order-1 md:order-2 relative aspect-[4/5] md:aspect-auto md:min-h-[92svh] overflow-hidden">
        <motion.div
          className="absolute -inset-[8%]"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={reduced ? undefined : { y: imageY, scale: imageScale }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {/* Vignette overlay — concentrates focus, reduces image dominance */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(26,26,26,0.18) 100%)',
            }}
          />
          {/* Cream-side gradient — creates seamless transition into body */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none md:hidden"
            style={{
              background:
                'linear-gradient(90deg, rgba(245,240,232,0.6) 0%, transparent 100%)',
            }}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-[var(--color-sage-deep)]"
        style={reduced ? undefined : { opacity: indicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
        <motion.div
          className="w-px h-10 bg-current origin-top"
          animate={reduced ? undefined : { scaleY: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
