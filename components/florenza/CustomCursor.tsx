'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom petal cursor — desktop only.
 * Mobile gets tap-ripple effect via TapRipple component (separate).
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 280 });
  const springY = useSpring(y, { damping: 30, stiffness: 280 });

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || reduce) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.body.style.cursor = '';
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      style={{ left: springX, top: springY }}
      animate={{
        scale: hovering ? 2.4 : 1,
      }}
      transition={{ duration: 0.25 }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {/* Single soft petal */}
        <path
          d="M10 2 C 13 4, 16 7, 14 12 C 12 16, 8 16, 6 12 C 4 7, 7 4, 10 2 Z"
          fill="rgba(44, 62, 45, 0.85)"
        />
      </svg>
    </motion.div>
  );
}
