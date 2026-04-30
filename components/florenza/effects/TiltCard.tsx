'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Lower = more subtle. */
  intensity?: number;
  /** Optional Z-axis lift on hover (px). */
  lift?: number;
}

/**
 * Apple-style mouse-driven 3D tilt wrapper. Tracks pointer position over the
 * card and rotates X/Y to create a parallax-glass feel. Uses spring physics
 * so motion is silky, never twitchy. No-op on reduced motion.
 */
export function TiltCard({ children, className, intensity = 6, lift = 6 }: TiltCardProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 18, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const translateZ = useTransform(sx, [-0.5, 0.5], [lift / 2, lift / 2]);

  function handlePointerMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        translateZ,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
