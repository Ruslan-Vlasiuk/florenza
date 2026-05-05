import type { Metadata } from 'next';
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { MagneticButton } from '@/components/florenza/MagneticButton';

export const metadata: Metadata = {
  title: 'Контакти',
  description:
    'Florenza — м. Ірпінь, вул. Ірпінська 1. Доставка по ИБГ та ближньому Києву. Замовлення через Telegram, Viber, чат на сайті.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsPage() {
  return (
    <div className="editorial-container py-12 md:py-20">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Контакти
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)] max-w-2xl">
          Як з нами зв&apos;язатися
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
        <div className="space-y-10">
          <ContactItem
            icon={MapPin}
            title="Адреса"
            body={
              <>
                м. Ірпінь, вул. Ірпінська 1
                <br />
                Київська область, Україна
              </>
            }
          />
          <ContactItem
            icon={Clock}
            title="Графік"
            body={
              <>
                Прийом замовлень: 24/7 у месенджерах і чаті
                <br />
                Доставка: щодня з 09:00 до 21:00
                <br />
                Термінова доставка: 60–90 хв (до 19:00)
              </>
            }
          />
          <ContactItem
            icon={MessageCircle}
            title="Месенджери"
            body={
              <div className="flex flex-wrap gap-3 mt-2">
                <a
                  href="https://t.me/FLORENZA_irpin_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-md border border-[#2c3e2d] !text-[#2c3e2d] hover:bg-[#2c3e2d] hover:!text-[#f5f0e8] font-medium text-sm transition-colors"
                >
                  Telegram
                </a>
              </div>
            }
          />
          <ContactItem
            icon={Phone}
            title="Телефон"
            body={<>Напишіть у чаті — підключимо живу флористку за необхідності</>}
          />
        </div>

        <div className="aspect-square lg:aspect-auto lg:min-h-[500px] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2546.5!2d30.246!3d50.5126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sFlorenza!2sUkraine!5e0!3m2!1suk!2sua"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Карта розташування Florenza в Ірпені"
          />
        </div>
      </div>

      <section className="mt-24 pt-16 border-t border-[var(--color-border-soft)]">
        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-deep-forest)] mb-8">
          Реквізити
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <dt className="text-[var(--color-text-muted)] uppercase tracking-wider text-xs mb-1">
              Юридична особа
            </dt>
            <dd>ФОП Каракой В. О.</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)] uppercase tracking-wider text-xs mb-1">
              Юр.адреса
            </dt>
            <dd>08200, Київська обл., м. Ірпінь, вул. Ірпінська 1</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  body,
}: {
  icon: any;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon
        className="text-[var(--color-sage-deep)] shrink-0"
        size={22}
        strokeWidth={1.4}
      />
      <div>
        <h3 className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] mb-2">
          {title}
        </h3>
        <div className="text-[var(--color-text-primary)] leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
