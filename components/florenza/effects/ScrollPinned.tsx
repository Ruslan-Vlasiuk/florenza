'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollPinnedProps {
  children: ReactNode;
  intensity?: number;
}

/**
 * Pin-style scroll wrapper: child stays sticky and gently scales/y-shifts
 * with scroll progress. Used for Apple/Stripe-style hero sections.
 */
export function ScrollPinned({ children, intensity = 0.15 }: ScrollPinnedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * intensity]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + 0.04 * intensity, 1]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={reduced ? undefined : { y, scale }}>{children}</motion.div>
    </div>
  );
}
