'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MagneticButton } from './MagneticButton';

interface EditorialHeroProps {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export function EditorialHero({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: EditorialHeroProps) {
  const words = title.split(' ');

  return (
    <section className="relative w-full min-h-[90svh] grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
      <div className="md:col-span-6 lg:col-span-7 order-2 md:order-1 flex items-center editorial-container py-16 md:py-24">
        <div className="max-w-xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-6"
            >
              {eyebrow}
            </motion.p>
          )}
          <h1 className="font-[var(--font-display)] text-[var(--text-4xl)] md:text-[var(--text-display)] leading-[1.05] text-[var(--color-deep-forest)]">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-md"
            >
              {subtitle}
            </motion.p>
          )}
          {(ctaPrimary || ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
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
      <motion.div
        className="md:col-span-6 lg:col-span-5 order-1 md:order-2 relative aspect-[4/5] md:aspect-auto md:min-h-[90svh]"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
