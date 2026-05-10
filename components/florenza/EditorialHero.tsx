'use client';

import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { Petals } from './effects/Petals';

interface EditorialHeroProps {
  imageUrl?: string;
  imageUrlMobile?: string;
  imageUrls?: string[];
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
  imageUrlMobile,
  imageUrls,
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
  // Single scroll-driven motion value reused for both image transforms
  // (avoids multiple subscribers on the same source).
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const words = title.split(' ');
  // Italicize the last word for editorial cadence
  const lastWordIndex = words.length - 1;

  // Carousel state — only when imageUrls provided
  const slides = imageUrls && imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const isCarousel = slides.length > 1;
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const next = () => setActiveIdx((i) => (i + 1) % slides.length);
  const prev = () => setActiveIdx((i) => (i - 1 + slides.length) % slides.length);

  // Auto-advance every 6s, paused on hover
  useEffect(() => {
    if (!isCarousel || paused || reduced) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [isCarousel, paused, reduced, slides.length]);

  return (
    <section
      ref={heroRef}
      className="relative w-full md:min-h-[92svh] grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden"
    >
      {/* Petals drift across whole hero — pauses when scrolled out */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Petals count={3} />
      </div>

      {/* Text side. Magazine-spread layout on mobile: image lives in its
          own card above (order-1), text card flows below on cream (order-2).
          On md+ it goes back to side-by-side. */}
      <div
        className="md:col-span-6 lg:col-span-7 order-2 md:order-1 flex items-center editorial-container py-10 md:py-24 relative z-10"
      >
        <div className="max-w-xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="section-eyebrow mb-6 md:mb-8"
            >
              {eyebrow}
            </motion.p>
          )}
          <h1
            className="font-[var(--font-display)] text-[clamp(2.25rem,9vw,5.5rem)] leading-[1.02] text-[var(--color-deep-forest)]"
            aria-label={title}
          >
            {words.map((word, i) => {
              const isItalic = i === lastWordIndex;
              return (
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
                  className="inline-block mr-[0.22em]"
                  style={{
                    fontVariationSettings: isItalic
                      ? "'opsz' 144, 'SOFT' 100, 'wght' 320"
                      : "'opsz' 144, 'SOFT' 50, 'wght' 350",
                    fontStyle: isItalic ? 'italic' : 'normal',
                    color: isItalic ? 'var(--color-sage-deep)' : undefined,
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-6 md:mt-8 text-base md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-md"
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
      </div>

      {/* Image side.
          Mobile (magazine spread): styled card with rounded corners,
          shadow, side margins; landscape 3:2 aspect (half the previous
          portrait height). Uses imageUrlMobile if provided.
          md+: full-bleed right column as before with the portrait image. */}
      <div
        className="md:col-span-6 lg:col-span-5 order-1 md:order-2 relative z-10 mt-6 mb-2 mx-5 md:mx-0 md:mt-0 md:mb-0 aspect-[3/2] md:aspect-auto md:min-h-[92svh] rounded-[var(--radius-lg)] md:rounded-none overflow-hidden shadow-[0_30px_60px_-20px_rgba(40,35,30,0.35)] md:shadow-none ring-1 ring-[var(--color-border-soft)] md:ring-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="absolute inset-x-0 -inset-y-[8%]"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={reduced ? undefined : { y: imageY, willChange: 'transform' }}
        >
          {/* Crossfade between slides. Renders TWO images — mobile-only
              (landscape 3:2) and desktop-only (portrait). Saves bandwidth on
              mobile and gives each viewport a properly-framed composition. */}
          <AnimatePresence mode="sync">
            <motion.div
              key={slides[activeIdx]}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mobile-only image (landscape) */}
              <Image
                src={imageUrlMobile ?? slides[activeIdx]}
                alt={imageAlt}
                fill
                priority={activeIdx === 0}
                sizes="100vw"
                className={`md:hidden object-cover transition-opacity duration-700 ease-out ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoadingComplete={() => setHeroImgLoaded(true)}
              />
              {/* Desktop-only image (portrait) */}
              <Image
                src={slides[activeIdx]}
                alt={imageAlt}
                fill
                priority={activeIdx === 0}
                sizes="50vw"
                className={`hidden md:block object-cover transition-opacity duration-700 ease-out ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoadingComplete={() => setHeroImgLoaded(true)}
              />
              {/* Shimmer skeleton until decoded */}
              <div
                className={`image-shimmer ${heroImgLoaded ? 'is-hidden' : ''}`}
                aria-hidden="true"
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle vignette — focuses attention without darkening the card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 60%, rgba(26,26,26,0.15) 100%)',
            }}
          />
        </motion.div>

        {/* Carousel controls — visible only when imageUrls > 1 */}
        {isCarousel && (
          <>
            {/* Arrow controls */}
            <button
              type="button"
              aria-label="Попереднє зображення"
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-3 md:left-4 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[var(--color-cream)]/80 backdrop-blur-sm hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center shadow-md transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              type="button"
              aria-label="Наступне зображення"
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-3 md:right-4 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[var(--color-cream)]/80 backdrop-blur-sm hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center shadow-md transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* Dots indicator + counter */}
            <div className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-cream)]/70 backdrop-blur-md">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Зображення ${i + 1}`}
                  onClick={() => setActiveIdx(i)}
                  className={
                    'transition-all rounded-full ' +
                    (i === activeIdx
                      ? 'w-6 h-1.5 bg-[var(--color-deep-forest)]'
                      : 'w-1.5 h-1.5 bg-[var(--color-deep-forest)]/35 hover:bg-[var(--color-deep-forest)]/60')
                  }
                />
              ))}
              <span className="ml-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-deep-forest)]/70 tabular-nums">
                {String(activeIdx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
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
