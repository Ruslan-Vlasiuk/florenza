'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Photo-sequence "3D rotation" component.
 * Mobile: swipe gesture changes frames.
 * Desktop: drag mouse to rotate.
 */
export function Bouquet3DRotation({ images, alt }: { images: string[]; alt: string }) {
  const [frame, setFrame] = useState(0);
  const startX = useRef<number | null>(null);
  const startFrame = useRef(0);

  if (!images.length) return null;

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    startFrame.current = frame;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    const sensitivity = 24; // pixels per frame
    const delta = Math.round(dx / sensitivity);
    const next = (startFrame.current + delta) % images.length;
    setFrame(next < 0 ? images.length + next : next);
  }

  function onPointerUp(e: React.PointerEvent) {
    startX.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] cursor-grab active:cursor-grabbing select-none touch-none"
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ opacity: i === frame ? 1 : 0 }}
          transition={{ duration: 0.05 }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority={i === 0}
            draggable={false}
          />
        </motion.div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-cream)]/90 text-[var(--color-deep-forest)] text-xs uppercase tracking-wider rounded-full pointer-events-none">
        ↻ обертайте
      </div>
    </div>
  );
}
