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
    {
      opacity: reduced ? 1 : opacityHero,
      style: {
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, rgba(232, 200, 195, 0.55) 0%, transparent 60%),
          radial-gradient(ellipse 70% 80% at 80% 80%, rgba(201, 163, 149, 0.35) 0%, transparent 65%),
          linear-gradient(180deg, #f5f0e8 0%, #efe9dd 100%)
        `,
      },
    },
    {
      opacity: reduced ? 0 : opacityStats,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 50% 30%, rgba(218, 196, 168, 0.5) 0%, transparent 65%),
          radial-gradient(ellipse 60% 90% at 90% 90%, rgba(138, 154, 123, 0.25) 0%, transparent 70%),
          linear-gradient(180deg, #efe9dd 0%, #ece1cd 100%)
        `,
      },
    },
    {
      opacity: reduced ? 0 : opacityStory,
      style: {
        background: `
          radial-gradient(ellipse 100% 80% at 30% 50%, rgba(204, 167, 117, 0.55) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 90% 20%, rgba(201, 163, 149, 0.45) 0%, transparent 65%),
          radial-gradient(ellipse 60% 80% at 10% 90%, rgba(108, 90, 60, 0.35) 0%, transparent 70%),
          linear-gradient(180deg, #ece1cd 0%, #d8c8a8 100%)
        `,
      },
    },
    {
      opacity: reduced ? 0 : opacityRoses,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 70% 30%, rgba(120, 35, 50, 0.85) 0%, transparent 60%),
          radial-gradient(ellipse 70% 80% at 20% 80%, rgba(60, 20, 30, 0.95) 0%, transparent 65%),
          radial-gradient(ellipse 50% 50% at 50% 50%, rgba(180, 70, 90, 0.4) 0%, transparent 70%),
          linear-gradient(180deg, #2a0e16 0%, #1a0810 100%)
        `,
      },
    },
    {
      opacity: reduced ? 0 : opacityBalloons,
      style: {
        background: `
          radial-gradient(ellipse 80% 70% at 30% 30%, rgba(218, 196, 211, 0.6) 0%, transparent 65%),
          radial-gradient(ellipse 70% 80% at 80% 80%, rgba(180, 200, 220, 0.5) 0%, transparent 65%),
          radial-gradient(ellipse 60% 60% at 50% 60%, rgba(245, 220, 230, 0.5) 0%, transparent 70%),
          linear-gradient(180deg, #f7f1ee 0%, #ede5e9 100%)
        `,
      },
    },
    {
      opacity: reduced ? 0 : opacityShowcase,
      style: {
        background: `
          radial-gradient(ellipse 90% 70% at 30% 30%, rgba(218, 196, 168, 0.4) 0%, transparent 65%),
          radial-gradient(ellipse 70% 80% at 80% 80%, rgba(138, 154, 123, 0.3) 0%, transparent 65%),
          radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245, 240, 232, 0.6) 0%, transparent 70%),
          linear-gradient(180deg, #efe9dd 0%, #f5f0e8 100%)
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
