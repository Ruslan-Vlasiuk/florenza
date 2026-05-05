import type { Metadata } from 'next';
import Image from 'next/image';
import { WeddingBriefForm } from '@/components/florenza/WeddingBriefForm';

export const metadata: Metadata = {
  title: 'Весільна флористика',
  description:
    'Весільна флористика від Florenza — Ірпінь, Буча, Київ. Букети нареченої, бутоньєрки, арки, оформлення столів. Подайте бриф — зв&apos;яжемось із вами особисто.',
  alternates: { canonical: '/vesilna-floristyka' },
};

export default function WeddingPage() {
  return (
    <article>
      <section className="relative w-full min-h-[70svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/wedding-hero.jpg"
            alt="Весільна флористика Florenza"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)]/95 to-transparent" />
        </div>
        <div className="relative editorial-container py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
            Особлива пропозиція
          </p>
          <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-deep-forest)] max-w-3xl leading-[1.05]">
            Весільна флористика
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-text-secondary)]">
            Букет нареченої, бутоньєрки, арка, оформлення столів. Складаємо весь день в одному
            ключі — щоб флористика стала частиною історії, а не декорацією.
          </p>
        </div>
      </section>

      <section className="editorial-container py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]">
            Як ми працюємо
          </h2>
          <ol className="space-y-6 text-[var(--color-text-secondary)]">
            <Step n={1} title="Бриф">
              Ви заповнюєте форму праворуч: дата, локація, стиль (можна додати референси), бюджет, що
              потрібно.
            </Step>
            <Step n={2} title="Зустріч / онлайн-консультація">
              Зв&apos;яжемось із вами особисто протягом доби. Обговорюємо деталі — що зробить
              день особливим саме для вас.
            </Step>
            <Step n={3} title="Пропозиція">
              Складаємо персональну пропозицію з мудбордом, кошторисом і таймлайном.
            </Step>
            <Step n={4} title="Підтвердження">
              Узгоджуємо, підписуємо, бронюємо дату. Передоплата 30%.
            </Step>
            <Step n={5} title="День весілля">
              Привозимо, встановлюємо, прибираємо. Ви залишаєте телефон — ми все зробимо.
            </Step>
          </ol>

          <div className="pt-8 border-t border-[var(--color-border-soft)] space-y-3">
            <h3 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)]">
              Орієнтовні бюджети
            </h3>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              <li>• Mini (тільки букет нареченої + 2 бутоньєрки): 5 000–10 000 грн</li>
              <li>• Classic (букет + бутоньєрки + столи + лепестки): 25 000–50 000 грн</li>
              <li>• Full (плюс арка, оформлення локації): 60 000+ грн</li>
            </ul>
          </div>
        </div>

        <WeddingBriefForm />
      </section>
    </article>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="font-[var(--font-display)] text-3xl text-[var(--color-sage-deep)]">
        0{n}
      </span>
      <div>
        <h3 className="font-medium text-[var(--color-deep-forest)] mb-1">{title}</h3>
        <p className="leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
