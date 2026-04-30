'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin progress bar at the very top of the page that fills as user scrolls.
 * Editorial subtle: 1.5px tall, sage-deep, semi-transparent.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1.5px] z-50 origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--color-sage) 0%, var(--color-deep-forest) 50%, var(--color-sage) 100%)',
        opacity: 0.65,
      }}
      aria-hidden="true"
    />
  );
}
