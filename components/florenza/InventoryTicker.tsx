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
      className="overflow-hidden border-y border-[var(--color-border-soft)] py-3"
      style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex animate-[florenza-ticker_60s_linear_infinite] whitespace-nowrap">
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
      <style jsx>{`
        @keyframes florenza-ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
