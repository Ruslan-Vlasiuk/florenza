import type { Metadata } from 'next';
import Image from 'next/image';
import { CorporateInquiryForm } from '@/components/florenza/CorporateInquiryForm';

export const metadata: Metadata = {
  title: 'Корпоративна флористика',
  description:
    'B2B-флористика для офісів, готелів, ресторанів. Регулярні поставки, оформлення подій, VIP-букети для клієнтів. Ірпінь, Буча, Київ.',
  alternates: { canonical: '/korporatyvna-floristyka' },
};

export default function CorporatePage() {
  return (
    <article>
      <section className="editorial-container py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Для бізнесу
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-deep-forest)] max-w-3xl leading-[1.05]">
          Корпоративна флористика
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
          Для офісів, готелів, ресторанів і агенцій, які хочуть, щоб флористика працювала на бренд,
          а не просто «була у вазі». Регулярні поставки, події, подарунки клієнтам.
        </p>
      </section>

      <section className="editorial-container pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <ServiceItem
            title="Регулярні поставки в офіс"
            description="Щотижнева або щомісячна доставка свіжих композицій. Один договір — і у вас завжди свіжі квіти на ресепшні, в переговорних, у CEO."
          />
          <ServiceItem
            title="Оформлення подій"
            description="Корпоративи, конференції, відкриття, нагороджування. Складаємо концепцію разом з event-агенцією або вашим маркетингом."
          />
          <ServiceItem
            title="VIP-букети для клієнтів"
            description="Подарунки топовим клієнтам на ДН, річниці, важливі дати. Особиста картка, узгоджений стиль, доставка кур'єром від Florenza."
          />
          <ServiceItem
            title="Корпоративні подарунки"
            description="Святкові набори (квіти + шоколад + листівка) під ваш брендбук. Партнерські умови від 20+ одиниць."
          />
        </div>

        <CorporateInquiryForm />
      </section>
    </article>
  );
}

function ServiceItem({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] mb-3">
        {title}
      </h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
