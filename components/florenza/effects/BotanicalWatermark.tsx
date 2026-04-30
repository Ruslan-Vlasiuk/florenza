interface BotanicalWatermarkProps {
  variant: 'fern' | 'peony' | 'eucalyptus' | 'wreath' | 'branch';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: number; // px
  opacity?: number;
  rotate?: number;
}

const SVG_PATHS: Record<BotanicalWatermarkProps['variant'], React.ReactNode> = {
  // Vintage botanical fern — vertical with paired leaflets
  fern: (
    <svg viewBox="0 0 200 320" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round">
      <path d="M100 20 L100 300" />
      {Array.from({ length: 14 }, (_, i) => {
        const y = 40 + i * 18;
        const len = 50 - i * 1.2;
        return (
          <g key={i}>
            <path d={`M100 ${y} Q ${100 - len / 2} ${y - 8}, ${100 - len} ${y - 4}`} />
            <path d={`M100 ${y} Q ${100 + len / 2} ${y - 8}, ${100 + len} ${y - 4}`} />
          </g>
        );
      })}
    </svg>
  ),

  // Stylized peony — concentric petal layers
  peony: (
    <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="0.6">
      <circle cx="120" cy="120" r="14" fill="currentColor" fillOpacity="0.15" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <ellipse
            key={`inner-${i}`}
            cx={120 + Math.cos(angle) * 22}
            cy={120 + Math.sin(angle) * 22}
            rx="14"
            ry="22"
            transform={`rotate(${(angle * 180) / Math.PI + 90} ${120 + Math.cos(angle) * 22} ${120 + Math.sin(angle) * 22})`}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12 + Math.PI / 12;
        return (
          <ellipse
            key={`outer-${i}`}
            cx={120 + Math.cos(angle) * 50}
            cy={120 + Math.sin(angle) * 50}
            rx="18"
            ry="32"
            transform={`rotate(${(angle * 180) / Math.PI + 90} ${120 + Math.cos(angle) * 50} ${120 + Math.sin(angle) * 50})`}
          />
        );
      })}
    </svg>
  ),

  // Eucalyptus stem — round leaves alternating
  eucalyptus: (
    <svg viewBox="0 0 200 360" fill="none" stroke="currentColor" strokeWidth="0.6">
      <path d="M100 10 Q 95 180, 100 350" />
      {Array.from({ length: 14 }, (_, i) => {
        const y = 30 + i * 24;
        const side = i % 2 === 0 ? 1 : -1;
        const cx = 100 + side * 26;
        return (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={y}
              rx="14"
              ry="11"
              transform={`rotate(${side * -25} ${cx} ${y})`}
              fill="currentColor"
              fillOpacity="0.2"
            />
            <line x1="100" y1={y} x2={cx - side * 4} y2={y} />
          </g>
        );
      })}
    </svg>
  ),

  // Wreath — circular twig wreath
  wreath: (
    <svg viewBox="0 0 280 280" fill="none" stroke="currentColor" strokeWidth="0.6">
      <circle cx="140" cy="140" r="100" />
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 36;
        const x1 = 140 + Math.cos(angle) * 100;
        const y1 = 140 + Math.sin(angle) * 100;
        const x2 = 140 + Math.cos(angle) * 116;
        const y2 = 140 + Math.sin(angle) * 116;
        const x3 = 140 + Math.cos(angle + 0.08) * 110;
        const y3 = 140 + Math.sin(angle + 0.08) * 110;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            <ellipse cx={x3} cy={y3} rx="3" ry="6" transform={`rotate(${(angle * 180) / Math.PI} ${x3} ${y3})`} fill="currentColor" fillOpacity="0.3" />
          </g>
        );
      })}
    </svg>
  ),

  // Diagonal branch — sweeping curve with leaves
  branch: (
    <svg viewBox="0 0 320 200" fill="none" stroke="currentColor" strokeWidth="0.7">
      <path d="M10 180 Q 100 100, 310 30" />
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i + 1) / 11;
        const x = 10 + (310 - 10) * t;
        const y = 180 - (180 - 30) * t * t;
        const angle = Math.atan2(-(180 - 30) * 2 * t, 310 - 10);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y - 8}
            rx="18"
            ry="6"
            transform={`rotate(${(angle * 180) / Math.PI - 25} ${x} ${y - 8})`}
            fill="currentColor"
            fillOpacity="0.18"
          />
        );
      })}
    </svg>
  ),
};

const POSITION_STYLES: Record<NonNullable<BotanicalWatermarkProps['position']>, React.CSSProperties> = {
  'top-left': { top: '-2%', left: '-3%' },
  'top-right': { top: '-2%', right: '-3%' },
  'bottom-left': { bottom: '-3%', left: '-3%' },
  'bottom-right': { bottom: '-3%', right: '-3%' },
  center: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
};

export function BotanicalWatermark({
  variant,
  position = 'top-right',
  size = 320,
  opacity = 0.1,
  rotate = 0,
}: BotanicalWatermarkProps) {
  const baseTransform = POSITION_STYLES[position].transform;
  const finalTransform = rotate
    ? `${baseTransform ?? ''} rotate(${rotate}deg)`
    : baseTransform;
  return (
    <div
      className="botanical-watermark"
      style={{
        ...POSITION_STYLES[position],
        width: size,
        height: size,
        opacity,
        transform: finalTransform,
      }}
      aria-hidden="true"
    >
      {SVG_PATHS[variant]}
    </div>
  );
}
