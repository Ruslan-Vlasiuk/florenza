'use client';

import { type ReactNode } from 'react';

/**
 * Lenis smooth-scroll was disabled because it competed with multiple
 * scroll-driven framer-motion subscribers (ScrollColorWash 7 layers +
 * sticky StoryStickySection + ProcessSection cross-fade). The combined
 * cost made scroll feel laggy from the Story section onwards.
 *
 * Native scroll is now used. The wash, parallax, blur-fade reveals and
 * sticky photo all keep working — they just read native scroll position
 * instead of Lenis-throttled position. Visually identical, much lighter.
 *
 * Component kept as a passthrough so we can re-enable Lenis with one
 * useEffect change later if profiling shows native is choppy.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
