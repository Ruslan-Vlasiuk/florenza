'use client';

import { useEffect, useRef } from 'react';

interface PetalsProps {
  count?: number;
  className?: string;
}

/**
 * Drifting petals — performant canvas particles.
 * Uses requestAnimationFrame, transform-only updates, respects reduced-motion.
 * Petals are abstract teardrop shapes in dusty-rose / sage tones.
 */
export function Petals({ count = 14, className }: PetalsProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    type Petal = {
      x: number;
      y: number;
      size: number;
      drift: number;
      vy: number;
      vx: number;
      rot: number;
      vrot: number;
      hue: 'rose' | 'sage' | 'cream';
      opacity: number;
    };

    const palette = {
      rose: 'rgba(201, 163, 149, 0.55)',
      sage: 'rgba(138, 154, 123, 0.45)',
      cream: 'rgba(245, 240, 232, 0.7)',
    };

    const init = (): Petal[] => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 6 + Math.random() * 12,
        drift: 0.4 + Math.random() * 0.6,
        vy: 0.15 + Math.random() * 0.35,
        vx: -0.2 + Math.random() * 0.4,
        rot: Math.random() * Math.PI * 2,
        vrot: -0.005 + Math.random() * 0.01,
        hue: (['rose', 'sage', 'cream'] as const)[Math.floor(Math.random() * 3)],
        opacity: 0.4 + Math.random() * 0.5,
      }));
    };

    let petals: Petal[] = [];
    const setup = () => {
      resize();
      petals = init();
    };
    setup();

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = palette[p.hue];
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.y * 0.01) * p.drift * 0.3;
        p.rot += p.vrot;
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;
        drawPetal(p);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => setup();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
