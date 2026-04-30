'use client';

import { type HTMLAttributes, type PropsWithChildren, type ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface MagneticButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: string;
  variant?: 'primary' | 'ghost' | 'outline';
  children: ReactNode;
}

/**
 * Magnetic CTA button.
 *  - Desktop: subtle pull toward cursor in 80px radius.
 *  - Mobile (coarse pointer): press-and-hold scale + haptic vibration.
 */
export function MagneticButton({
  children,
  variant = 'primary',
  className,
  href,
  ...rest
}: PropsWithChildren<MagneticButtonProps>) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function fireRipple(clientX: number, clientY: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    const ripple = {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }

  function onClickFire(e: React.MouseEvent) {
    fireRipple(e.clientX, e.clientY);
  }

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 22, stiffness: 220 });
  const sy = useSpring(y, { damping: 22, stiffness: 220 });

  function onMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 80) {
      x.set(dx * 0.25);
      y.set(dy * 0.25);
    }
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function onTouchStart() {
    setPressed(true);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate?.(8);
      } catch {}
    }
  }

  function onTouchEnd() {
    setPressed(false);
  }

  const base = 'relative inline-flex items-center justify-center px-6 py-3 rounded-md font-medium text-sm transition-colors overflow-hidden';
  const variants = {
    primary: 'bg-[var(--color-deep-forest)] text-[var(--color-cream)] hover:bg-[var(--color-deep-forest-soft)]',
    ghost: 'text-[var(--color-deep-forest)] hover:text-[var(--color-deep-forest-soft)]',
    outline:
      'border border-[var(--color-deep-forest)] text-[var(--color-deep-forest)] hover:bg-[var(--color-deep-forest)] hover:text-[var(--color-cream)]',
  };

  const Tag: any = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref as any}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClickFire}
      style={{ x: sx, y: sy }}
      animate={{ scale: pressed ? 0.96 : 1 }}
      transition={{ scale: { duration: 0.2 } }}
      className={cn(base, variants[variant], className)}
      {...(rest as any)}
    >
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: r.x,
              top: r.y,
              translateX: '-50%',
              translateY: '-50%',
              background:
                variant === 'primary'
                  ? 'rgba(245,240,232,0.45)'
                  : 'rgba(44,62,45,0.18)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 280, height: 280, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </Tag>
  );
}
