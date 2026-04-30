'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
}

/**
 * Wrapper that fades + blurs in when scrolled into view.
 * Tuned for editorial pacing: slow, intentional, never twitchy.
 */
export function BlurFade({
  children,
  delay = 0,
  duration = 0.9,
  yOffset = 24,
  blur = 8,
  className,
  once = true,
}: BlurFadeProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
