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
  // Roses → Balloons overlap is wider (8% instead of 4%) so the burgundy
  // bleeds into the dusky-rose top of Balloons without showing a seam.
  const opacityHero = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const opacityStats = useTransform(scrollYProgress, [0.12, 0.22, 0.32], [0, 1, 0]);
  const opacityStory = useTransform(scrollYProgress, [0.28, 0.4, 0.5], [0, 1, 0]);
  const opacityRoses = useTransform(scrollYProgress, [0.46, 0.56, 0.7], [0, 1, 0]);
  const opacityBalloons = useTransform(scrollYProgress, [0.58, 0.74, 0.86], [0, 1, 0]);
  const opacityShowcase = useTransform(scrollYProgress, [0.82, 0.92, 1], [0, 1, 1]);

  const layers = [
    // 1. HERO — Twilight persimmon: dusky bronze at top, peach below
    {
      opacity: reduced ? 1 : opacityHero,
      style: {
        background: `
          radial-gradient(ellipse 100% 70% at 30% 15%, rgba(120, 60, 50, 0.55) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 45%, rgba(220, 145, 125, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 80% 90% at 80% 80%, rgba(245, 200, 180, 0.7) 0%, transparent 65%),
          linear-gradient(180deg, #6b3328 0%, #c08775 25%, #e8b8a5 55%, #f5d8c8 85%, #f8e3d9 100%)
        `,
      },
    },
    // 2. STATS — Forest twilight: deep moss top, drifting to soft sage below
    {
      opacity: reduced ? 0 : opacityStats,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 20%, rgba(28, 50, 38, 0.75) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 50%, rgba(60, 90, 65, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(120, 150, 115, 0.6) 0%, transparent 65%),
          linear-gradient(180deg, #1f3328 0%, #3a5a45 35%, #6a8870 65%, #a8bfa3 100%)
        `,
      },
    },
    // 3. STORY — Golden dusk: chestnut at top fading down to honey
    {
      opacity: reduced ? 0 : opacityStory,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 15%, rgba(80, 45, 25, 0.75) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 45%, rgba(180, 110, 60, 0.75) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(220, 160, 80, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 70% 60% at 30% 80%, rgba(245, 200, 130, 0.6) 0%, transparent 70%),
          linear-gradient(180deg, #4a2818 0%, #8a4f28 25%, #c08850 55%, #d8a868 80%, #e8c08c 100%)
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
    // 5. BALLOONS — Dusky rose dawn fading to pastel sky.
    // Top of viewport keeps burgundy/plum tones (so the Roses transition
    // never shows a colour seam); bottom drifts toward cotton-candy.
    {
      opacity: reduced ? 0 : opacityBalloons,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 20%, rgba(140, 60, 90, 0.55) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 50%, rgba(220, 160, 180, 0.7) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(170, 195, 220, 0.75) 0%, transparent 65%),
          radial-gradient(ellipse 70% 60% at 50% 70%, rgba(245, 220, 230, 0.7) 0%, transparent 70%),
          linear-gradient(180deg, #5e2030 0%, #c8a0b0 35%, #e0c8d4 65%, #d8e0eb 100%)
        `,
      },
    },
    // 6. SHOWCASE — Evening garden: deep forest at top, mint-cream at bottom
    {
      opacity: reduced ? 0 : opacityShowcase,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 20%, rgba(30, 50, 35, 0.7) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 50%, rgba(80, 110, 85, 0.65) 0%, transparent 65%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(155, 185, 150, 0.6) 0%, transparent 65%),
          radial-gradient(ellipse 70% 60% at 50% 80%, rgba(220, 230, 210, 0.6) 0%, transparent 70%),
          linear-gradient(180deg, #233628 0%, #4a6b50 30%, #88a890 60%, #c8d8be 100%)
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
