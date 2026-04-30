'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

/** Drop-in wrapper that fades and slides children up when they enter view. */
export function FadeUp({
  children,
  delay = 0,
  y = 32,
  duration = 0.85,
  className,
  once = true,
}: FadeUpProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children with FadeUp animation. */
export function FadeStagger({
  children,
  stagger = 0.1,
  className,
}: {
  children: ReactNode[];
  stagger?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <FadeUp key={i} delay={i * stagger}>
          {child}
        </FadeUp>
      ))}
    </div>
  );
}
