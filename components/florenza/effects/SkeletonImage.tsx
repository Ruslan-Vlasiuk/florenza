'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * next/image wrapper that shows a tinted skeleton with sweeping shimmer
 * (.image-shimmer in globals.css) until the image is decoded, then fades it
 * out smoothly. Identical API to next/image — drop-in replacement.
 *
 * MUST be used inside a positioned (relative/absolute) parent so the
 * shimmer overlay (position:absolute) and Image fill correctly.
 */
type Props = ImageProps & { className?: string };

export function SkeletonImage({ className, onLoadingComplete, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <Image
        {...props}
        className={[
          className ?? '',
          'transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onLoadingComplete={(img) => {
          setLoaded(true);
          onLoadingComplete?.(img);
        }}
      />
      <div
        className={`image-shimmer ${loaded ? 'is-hidden' : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
