'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Scroll-driven color morphing background.
 * Fixed-positioned full-screen layers with cinematic gradients fade in/out
 * based on scroll progress, choreographing 6 distinct moods through the page:
 *
 *  0–12%   Hero      cream + warm rose dawn
 * 12–28%   Stats     warm parchment
 * 28–48%   Story     deep golden honey
 * 48–62%   Roses     dramatic dark burgundy
 * 62–78%   Balloons  soft pastel sky
 * 78–100%  Bottom    forest evening
 *
 * Each layer is a layered radial-gradient mesh — not flat — so the transitions
 * never look like "color blocks", they breathe.
 */
export function ScrollColorWash() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  // 6 mood layers, each fades in/out at its scroll range.
  const opacityHero = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const opacityStats = useTransform(scrollYProgress, [0.12, 0.22, 0.32], [0, 1, 0]);
  const opacityStory = useTransform(scrollYProgress, [0.28, 0.4, 0.5], [0, 1, 0]);
  const opacityRoses = useTransform(scrollYProgress, [0.46, 0.56, 0.66], [0, 1, 0]);
  const opacityBalloons = useTransform(scrollYProgress, [0.62, 0.72, 0.82], [0, 1, 0]);
  const opacityShowcase = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);

  const layers = [
    // 1. HERO — Persimmon dawn: warm peach + soft rose
    {
      opacity: reduced ? 1 : opacityHero,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 20% 20%, rgba(245, 195, 175, 0.85) 0%, transparent 60%),
          radial-gradient(ellipse 80% 90% at 80% 80%, rgba(220, 165, 145, 0.7) 0%, transparent 65%),
          linear-gradient(180deg, #f8e3d9 0%, #f0d4c5 100%)
        `,
      },
    },
    // 2. STATS — Sage olive: dusty greens with mist
    {
      opacity: reduced ? 0 : opacityStats,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 50% 30%, rgba(170, 195, 155, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 70% 90% at 90% 90%, rgba(110, 140, 105, 0.6) 0%, transparent 70%),
          linear-gradient(180deg, #d8e0ce 0%, #c4d2b8 100%)
        `,
      },
    },
    // 3. STORY — Golden hour: saturated honey + caramel
    {
      opacity: reduced ? 0 : opacityStory,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 50%, rgba(220, 160, 80, 0.85) 0%, transparent 60%),
          radial-gradient(ellipse 80% 70% at 90% 20%, rgba(180, 110, 60, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 70% 80% at 10% 90%, rgba(140, 85, 40, 0.6) 0%, transparent 70%),
          linear-gradient(180deg, #d8a868 0%, #b87838 100%)
        `,
      },
    },
    // 4. ROSES — Burgundy night: deep wine with crimson accents
    {
      opacity: reduced ? 0 : opacityRoses,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 70% 30%, rgba(140, 35, 55, 0.95) 0%, transparent 60%),
          radial-gradient(ellipse 70% 80% at 20% 80%, rgba(50, 12, 22, 1) 0%, transparent 65%),
          radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200, 60, 90, 0.55) 0%, transparent 70%),
          linear-gradient(180deg, #28080f 0%, #14040a 100%)
        `,
      },
    },
    // 5. BALLOONS — Cotton-candy sky: pastel pink + powder blue
    {
      opacity: reduced ? 0 : opacityBalloons,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 30% 30%, rgba(230, 175, 195, 0.85) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(155, 195, 225, 0.8) 0%, transparent 65%),
          radial-gradient(ellipse 70% 60% at 50% 60%, rgba(250, 220, 230, 0.7) 0%, transparent 70%),
          linear-gradient(180deg, #f0d8e0 0%, #d8e0eb 100%)
        `,
      },
    },
    // 6. SHOWCASE — Cool fern garden: soft sage greens with cream highlights
    {
      opacity: reduced ? 0 : opacityShowcase,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 30%, rgba(155, 185, 145, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(90, 125, 85, 0.55) 0%, transparent 65%),
          radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220, 230, 210, 0.7) 0%, transparent 70%),
          linear-gradient(180deg, #c8d8be 0%, #a0bb98 100%)
        `,
      },
    },
  ];

  return (
    <div
      data-bg-layer
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {layers.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: layer.opacity,
            ...layer.style,
          }}
        />
      ))}
    </div>
  );
}
