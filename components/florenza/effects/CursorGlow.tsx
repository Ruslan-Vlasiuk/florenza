'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Subtle cursor-following ambient glow. NOT a custom cursor (the previous
 * lag-cursor was scrapped) — this just emits a soft accent halo a few
 * hundred ms behind the actual cursor, blending against the background.
 *
 * Disabled on touch devices and reduced-motion.
 */
export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 80, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function move(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed pointer-events-none z-[5] mix-blend-multiply"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: 320,
        height: 320,
        background:
          'radial-gradient(circle, rgba(201,163,149,0.18) 0%, rgba(201,163,149,0) 60%)',
        filter: 'blur(8px)',
      }}
    />
  );
}
