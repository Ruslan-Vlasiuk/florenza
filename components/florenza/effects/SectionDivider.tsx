interface SectionDividerProps {
  variant?: 'wave' | 'line' | 'dots' | 'sprig';
  color?: string;
  flip?: boolean;
}

/**
 * SVG section dividers — hand-drawn organic shapes between sections.
 * Subtle, decorative, never demanding attention.
 */
export function SectionDivider({
  variant = 'sprig',
  color = 'currentColor',
  flip = false,
}: SectionDividerProps) {
  const transform = flip ? 'scaleY(-1)' : undefined;

  if (variant === 'wave') {
    return (
      <div
        className="w-full overflow-hidden"
        aria-hidden="true"
        style={{ transform, color: 'var(--color-sage-deep)', opacity: 0.25 }}
      >
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[60px]">
          <path
            d="M0,32 C240,8 480,56 720,32 C960,8 1200,56 1440,32 L1440,60 L0,60 Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <div
        className="editorial-container py-12 flex items-center gap-6"
        aria-hidden="true"
        style={{ color: 'var(--color-sage-deep)', opacity: 0.4 }}
      >
        <div className="flex-1 h-px bg-current" />
        <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
          <circle cx="16" cy="16" r="2" fill={color} />
          <circle cx="16" cy="16" r="9" fill="none" stroke={color} strokeWidth="0.6" />
        </svg>
        <div className="flex-1 h-px bg-current" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className="flex justify-center py-12 gap-3"
        aria-hidden="true"
        style={{ color: 'var(--color-sage-deep)', opacity: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-current" />
        ))}
      </div>
    );
  }

  // 'sprig' — small botanical sprig in centre
  return (
    <div
      className="flex justify-center py-12"
      aria-hidden="true"
      style={{ color: 'var(--color-sage-deep)', opacity: 0.55 }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round">
        <path d="M24 6 L24 42" />
        <path d="M24 14 C18 12, 14 14, 12 18 C16 18, 20 16, 24 14" fill={color} fillOpacity="0.18" />
        <path d="M24 22 C30 20, 34 22, 36 26 C32 26, 28 24, 24 22" fill={color} fillOpacity="0.18" />
        <path d="M24 30 C18 28, 14 30, 12 34 C16 34, 20 32, 24 30" fill={color} fillOpacity="0.18" />
      </svg>
    </div>
  );
}
