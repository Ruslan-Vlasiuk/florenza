import { fetchFeaturedBouquets } from '@/lib/data';
import { BouquetCard } from './BouquetCard';
import { MagneticButton } from './MagneticButton';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';

interface Props {
  city: string;
  cityGenitive: string;
  cityDative: string;
  tariff: number;
  timeRange: string;
  areas: string[];
  h1Subtitle?: string;
}

export async function GeoLandingPage({
  city,
  cityGenitive,
  cityDative,
  tariff,
  timeRange,
  areas,
  h1Subtitle,
}: Props) {
  const bouquets = await fetchFeaturedBouquets(8);

  return (
    <>
      <LocalBusinessSchema />
      <section className="editorial-container py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Доставка по {cityDative}
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-deep-forest)] max-w-3xl leading-[1.05]">
          Доставка квітів {city}
        </h1>
        {h1Subtitle && (
          <p className="mt-4 text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl">
            {h1Subtitle}
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat label="Час доставки" value={timeRange} />
          <Stat label="Тариф" value={`${tariff} грн`} />
          <Stat label="Безкоштовно" value="від 3000 грн" />
        </div>

        <div className="mt-12">
          <MagneticButton href="/buketu" variant="primary">
            Перейти до каталогу
          </MagneticButton>
        </div>
      </section>

      <section className="editorial-container py-16 max-w-3xl prose-editorial">
        <h2>Куди доставляємо в {cityDative}</h2>
        <p>
          Florenza везе букети по всьому {cityDative} — від центру до окраїн. Серед районів, з якими
          ми працюємо щодня:
        </p>
        <ul>
          {areas.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p>
          Якщо ваша адреса не в цьому списку — впишіть її при оформленні замовлення. Ми обслуговуємо
          весь {city} і прилеглі райони.
        </p>

        <h2>Як замовити</h2>
        <p>
          Найшвидший спосіб — написати нам у Telegram, Viber або в чаті праворуч. Підберемо букет,
          приймемо оплату і будемо тримати в курсі статусу доставки. Це 24/7, без телефонних
          дзвінків.
        </p>

        <h2>Терміни</h2>
        <p>
          Стандартна доставка — у обраний слот (10–12, 12–14, 14–16, 16–18, 18–20). Прийом
          замовлень на сьогодні — до 19:00. Термінова доставка — за 60–90 хвилин з моменту
          оплати, доплата 150 грн.
        </p>

        <h2>Оплата</h2>
        <p>
          Apple Pay, Google Pay, картки через Monobank Acquiring. Резервний канал — LiqPay
          (ПриватБанк). Можлива часткова передоплата (від 30%) з доплатою кур&apos;єру при доставці.
          Фіскальний чек надсилаємо у Telegram або Viber після оплати.
        </p>
      </section>

      <section className="editorial-container py-16 md:py-24">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)] mb-10">
          Букети, які везе {city}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bouquets.slice(0, 8).map((b, i) => (
            <BouquetCard key={b.slug} bouquet={b} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)]">
      <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {label}
      </p>
      <p className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]">{value}</p>
    </div>
  );
}
