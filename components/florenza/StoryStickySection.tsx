'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BlurFade } from './effects/BlurFade';
import { BotanicalWatermark } from './effects/BotanicalWatermark';

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
}

interface StoryStickySectionProps {
  imageUrl: string;
  imageAlt: string;
  chapters: Chapter[];
  brand?: string;
}

/**
 * Aesop-style sticky-image scrollytelling.
 * The photo on the left stays pinned while paragraphs scroll past on the right.
 * Image subtly cross-fades as user passes between chapters (handled visually
 * via overlay opacity tied to scroll progress).
 */
export function StoryStickySection({
  imageUrl,
  imageAlt,
  chapters,
  brand = 'Florenza',
}: StoryStickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Image pans slightly during sticky range
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <BotanicalWatermark variant="fern" position="top-left" size={380} opacity={0.08} rotate={-8} />
      <BotanicalWatermark variant="wreath" position="bottom-right" size={320} opacity={0.07} />
      <div className="editorial-container relative z-10">
      <BlurFade>
        <p className="section-eyebrow mb-4">Філософія {brand}</p>
        <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] max-w-2xl mb-16 md:mb-24">
          Букет як редакторський жест,
          <br />
          а не товар з полиці
        </h2>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 lg:gap-24">
        {/* Sticky image — left column on desktop, top on mobile */}
        <div className="md:col-span-5 lg:col-span-5 order-1">
          <div className="md:sticky md:top-24">
            <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)]">
              <motion.div
                className="absolute -inset-[6%]"
                style={{ y: imageY }}
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              {/* Soft vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 60%, rgba(26,26,26,0.15) 100%)',
                }}
              />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--color-sage-deep)] opacity-80">
              Студія · Ірпінь
            </p>
          </div>
        </div>

        {/* Scrolling chapters */}
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7 order-2 space-y-24 md:space-y-32">
          {chapters.map((chapter, i) => (
            <BlurFade key={chapter.title} delay={0.1} yOffset={32}>
              <article>
                <p className="section-eyebrow mb-4">
                  {String(i + 1).padStart(2, '0')} · {chapter.eyebrow}
                </p>
                <h3 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[var(--color-deep-forest)] mb-6">
                  {chapter.title}
                </h3>
                <p className="text-lg leading-[1.75] text-[var(--color-text-secondary)] max-w-prose">
                  {chapter.body}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
