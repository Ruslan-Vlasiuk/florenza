import type { Metadata } from 'next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/florenza/MagneticButton';

export const metadata: Metadata = {
  title: 'Про Florenza',
  description:
    'Авторський флористичний бутік в Ірпені. Тиха editorial-естетика, розуміння деталей, локальна команда.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article>
      <section className="relative w-full min-h-[80svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Майстерня Florenza в Ірпені"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)] via-transparent to-transparent" />
        </div>
        <div className="relative editorial-container py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
            Про нас
          </p>
          <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-deep-forest)] max-w-3xl leading-[1.05]">
            Тиха витонченість у деталях
          </h1>
        </div>
      </section>

      <section className="editorial-container py-16 md:py-24 max-w-3xl prose-editorial">
        <p className="text-xl md:text-2xl leading-relaxed text-[var(--color-text-primary)]">
          Florenza — авторський флористичний бутік в Ірпені. Ми не «продаємо квіти». Ми складаємо
          букети, які тримаються в одному ключі — від кольору до настрою. Кожен букет —
          співавторство, де клієнт ділиться приводом, а флористка — інтерпретує його через
          живий матеріал.
        </p>

        <h2>Наш підхід</h2>
        <p>
          Ми працюємо тільки з обраними сортами. Ми не використовуємо все, що є на ринку — ми
          обираємо те, що відповідає нашій естетиці: природні форми, м'яке світло, organic
          shadows. Композиції — асиметричні, не «причесані». Це Aesop для квітів: спокій,
          продуманість, повага до матеріалу.
        </p>

        <h2>Локальність</h2>
        <p>
          Бутік знаходиться в Ірпені на Ірпінській 1. Доставка — особисто або з нашими
          кур'єрами по Ірпеню, Бучі, Гостомелю та ближньому Києву. За годину-півтори. Без
          посередників, без шаблонів.
        </p>

        <h2>Як з нами зв'язатися</h2>
        <p>
          Замовлення приймаємо 24/7 у Telegram, Viber та в чаті на сайті. Підкажемо з вибором,
          порахуємо суму, оформимо доставку — швидко, у будь-який час. Якщо питання делікатне
          (весілля, складний привід, скарга) — підключаємо Варвару особисто. Це наша чесна гра:
          швидкість там, де потрібна швидкість, людський контакт там, де він важливий.
        </p>

        <h2>Варвара</h2>
        <p>
          За кожним букетом стоїть одна людина — Варвара Олександрівна, флористка-засновниця
          Florenza. Власне її смак, її руки, її стиль читаються в кожній композиції.
        </p>
      </section>

      <section className="editorial-container py-16 text-center">
        <MagneticButton href="/buketu" variant="primary">
          Перейти до каталогу
        </MagneticButton>
      </section>
    </article>
  );
}
