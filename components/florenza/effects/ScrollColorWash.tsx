'use client';

import { useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';

/**
 * Scroll bands where the wash is dark and text needs to invert to light.
 * Most of the page is light; dark moments are short transitional flashes
 * plus the one full-section dark mood (Roses).
 */
const DARK_BANDS: Array<[number, number]> = [
  [0.12, 0.17],  // brief flash: Hero → Stats
  [0.30, 0.34],  // brief flash: Stats → Story
  [0.50, 0.68],  // Roses (sustained dark) + into Balloons dusky top
  [0.84, 0.88],  // brief flash: Balloons → Showcase
];

function progressIsDark(p: number): boolean {
  for (const [start, end] of DARK_BANDS) {
    if (p >= start && p <= end) return true;
  }
  return false;
}

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

  // Toggle the .is-mood-dark class on the body when wash is dark. CSS handles
  // the brand-token swaps (deep-forest, text-primary, text-secondary, etc.)
  // so any existing `text-[var(--color-deep-forest)]` etc. inverts automatically.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    document.body.classList.toggle('is-mood-dark', progressIsDark(p));
  });

  useEffect(() => {
    document.body.classList.toggle('is-mood-dark', progressIsDark(scrollYProgress.get()));
  }, [scrollYProgress]);

  // 6 main mood layers — light throughout, each fades in/out at its range
  const opacityHero = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const opacityStats = useTransform(scrollYProgress, [0.12, 0.22, 0.32], [0, 1, 0]);
  const opacityStory = useTransform(scrollYProgress, [0.28, 0.4, 0.5], [0, 1, 0]);
  const opacityRoses = useTransform(scrollYProgress, [0.46, 0.56, 0.7], [0, 1, 0]);
  const opacityBalloons = useTransform(scrollYProgress, [0.58, 0.74, 0.86], [0, 1, 0]);
  const opacityShowcase = useTransform(scrollYProgress, [0.82, 0.92, 1], [0, 1, 1]);

  // DARK FLASH layer — brief moody passes at section transitions where there
  // would otherwise be no dark moment. Three peaks across the page:
  //   ~14%  Hero → Stats boundary
  //   ~32%  Stats → Story boundary
  //   ~86%  Balloons → Showcase boundary
  // Roses already provides a sustained dark zone in the middle, no flash
  // needed there.
  const opacityDarkFlash = useTransform(
    scrollYProgress,
    [0.09, 0.14, 0.19, 0.28, 0.32, 0.37, 0.81, 0.86, 0.91],
    [0,    0.55, 0,    0,    0.45, 0,    0,    0.5,  0]
  );

  const layers = [
    // 1. HERO — Persimmon dawn: warm peach + soft rose (light throughout)
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
    // 2. STATS — Sage olive: dusty greens with mist (light throughout)
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
    // 3. STORY — Golden hour: saturated honey + caramel (light throughout)
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
    // 6. SHOWCASE — Cool fern garden (light throughout)
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
    // 7. DARK FLASH — brief moody overlay at section transitions.
    // Painted on top of the active mood, so it briefly darkens then clears.
    {
      opacity: reduced ? 0 : opacityDarkFlash,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 30%, rgba(40, 25, 30, 0.85) 0%, transparent 60%),
          radial-gradient(ellipse 90% 70% at 70% 70%, rgba(20, 15, 22, 0.95) 0%, transparent 65%),
          linear-gradient(180deg, #1a0d14 0%, #0d0608 100%)
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
