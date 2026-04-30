'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number; // 0..1, how strong the parallax effect is
  priority?: boolean;
  sizes?: string;
}

/**
 * Image with smooth scroll-driven parallax. Fixed within its parent's bounds,
 * shifts in opposite direction to scroll. Respects reduced-motion.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  intensity = 0.25,
  priority = false,
  sizes = '100vw',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yShift = 80 * intensity;
  const y = useTransform(scrollYProgress, [0, 1], [-yShift, yShift]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="absolute -inset-[10%]"
        style={reduced ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
