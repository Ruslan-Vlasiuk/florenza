'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const TYPES = [
  { slug: 'avtorski', label: 'Авторські' },
  { slug: 'monobukety', label: 'Монобукети' },
  { slug: 'kompozytsiyi', label: 'Композиції' },
  { slug: 'podarunky', label: 'Подарунки' },
];

const FLOWERS = [
  { slug: 'troyandy', label: 'Троянди' },
  { slug: 'pivonii', label: 'Півонії' },
  { slug: 'khryzantemy', label: 'Хризантеми' },
  { slug: 'tyulpany', label: 'Тюльпани' },
  { slug: 'gortenziyi', label: 'Гортензії' },
  { slug: 'sezonni', label: 'Сезонні' },
];

const OCCASIONS = [
  { slug: 'na-den-narodzhennya', label: 'День народження' },
  { slug: 'na-richnytsiu', label: 'Річниця' },
  { slug: 'bez-pryvodu', label: 'Без приводу' },
  { slug: 'na-vypusknyi', label: 'Випускний' },
  { slug: 'narodzhennia-dytyny', label: 'Народження дитини' },
];

export function CatalogFilters() {
  const params = useSearchParams();

  return (
    <div className="space-y-8 sticky top-24">
      <FilterGroup title="Тип букета" items={TYPES} />
      <FilterGroup title="Головна квітка" items={FLOWERS} />
      <FilterGroup title="Привід" items={OCCASIONS} />
      <div>
        <h3 className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] font-medium mb-3">
          Швидко
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/buketu?available_today=true"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)]"
            >
              Готові на сьогодні
            </Link>
          </li>
          <li>
            <Link
              href="/buketu?discount=true"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)]"
            >
              Зі знижкою
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  items,
}: {
  title: string;
  items: { slug: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] font-medium mb-3">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/buketu/${item.slug}`}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
