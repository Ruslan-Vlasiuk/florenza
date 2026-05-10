'use client';

const ITEMS = [
  '✦ Сьогодні в наявності: півонії Sarah Bernhardt — 14 шт',
  'троянди David Austin — 22 шт',
  'еустоми білі — 30 шт',
  'гортензії блакитні — 8 шт',
  'тюльпани Ranunculus — 25 шт',
  'дельфініум — 12 шт',
  'диантуси рожеві — 28 шт',
  'фрезії — 16 шт',
  'оновлено о 06:30',
];

/**
 * Subtle inventory ticker. Soft marquee that runs continuously.
 * Builds trust — like seeing the morning chalkboard at a real florist.
 */
export function InventoryTicker() {
  // Repeat 3 times for seamless loop
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section
      className="overflow-hidden border-y border-[var(--color-border-soft)] py-3 bg-white/85"
      style={{
        // content-visibility: auto + intrinsic-size lets the browser skip
        // layout/paint/compositing for the ticker when it's off-screen.
        contentVisibility: 'auto',
        containIntrinsicSize: '40px',
      }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'florenza-ticker 25s linear infinite',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, i) => (
          <div
            key={i}
            className="px-6 text-[11px] uppercase tracking-[0.32em] text-[var(--color-sage-deep)] flex items-center gap-3"
          >
            {item}
            <span className="opacity-40">/</span>
          </div>
        ))}
      </div>
    </section>
  );
}
