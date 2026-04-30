import Link from 'next/link';

const FOOTER_LINKS = {
  shop: [
    { label: 'Каталог', href: '/buketu' },
    { label: 'Авторські букети', href: '/buketu/avtorski' },
    { label: 'Монобукети', href: '/buketu/monobukety' },
    { label: 'Композиції', href: '/buketu/kompozytsiyi' },
  ],
  services: [
    { label: 'Весільна флористика', href: '/vesilna-floristyka' },
    { label: 'Корпоративна', href: '/korporatyvna-floristyka' },
    { label: 'Доставка по Ірпеню', href: '/dostavka-kvitiv-irpin' },
    { label: 'Доставка по Бучі', href: '/dostavka-kvitiv-bucha' },
    { label: 'Доставка по Гостомелю', href: '/dostavka-kvitiv-hostomel' },
  ],
  about: [
    { label: 'Про нас', href: '/about' },
    { label: 'Журнал', href: '/zhurnal' },
    { label: 'Контакти', href: '/contacts' },
  ],
  legal: [
    { label: 'Публічна оферта', href: '/oferta' },
    { label: 'Політика конфіденційності', href: '/polityka-konfidentsiynosti' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Умови використання', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] mt-24 relative overflow-hidden">
      {/* Massive editorial sign-off — magazine colophon */}
      <div className="editorial-container pt-24 pb-12 md:pt-32 md:pb-16">
        <p
          className="font-[var(--font-display)] text-[clamp(4rem,16vw,16rem)] leading-[0.85] tracking-[-0.04em] text-[var(--color-deep-forest)]"
          style={{
            fontVariationSettings: "'opsz' 144, 'wght' 320",
            fontStyle: 'italic',
          }}
        >
          florenza<span style={{ color: 'var(--color-dusty-rose)' }}>.</span>
        </p>
      </div>

      <div className="editorial-container pb-16 md:pb-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Преміум флористичний бутік у Ірпені. Тиха editorial-чутливість,
              авторські букети, доставка по ИБГ та ближньому Києву.
            </p>
            <div className="mt-8 space-y-1 text-xs text-[var(--color-text-muted)]">
              <p className="uppercase tracking-[0.22em] text-[var(--color-sage-deep)] mb-1">
                Бутік
              </p>
              <p>м. Ірпінь, вул. Ірпінська 1</p>
              <p>Прийом замовлень 24/7</p>
            </div>
            <div className="mt-6 space-y-1 text-xs text-[var(--color-text-muted)]">
              <p className="uppercase tracking-[0.22em] text-[var(--color-sage-deep)] mb-1">
                Юридична
              </p>
              <p>ФОП Каракой Варвара Олександрівна</p>
            </div>
          </div>

          <FooterColumn title="Магазин" items={FOOTER_LINKS.shop} />
          <FooterColumn title="Сервіси" items={FOOTER_LINKS.services} />
          <FooterColumn title="Бренд" items={FOOTER_LINKS.about} />
          <FooterColumn title="Юридичне" items={FOOTER_LINKS.legal} />
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border-soft)] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Florenza · Made in Ірпінь
          </p>
          <p className="text-xs text-[var(--color-text-muted)] text-center hidden md:block">
            ✦ Без email · Без cookies · Без трекерів ✦
          </p>
          <p className="text-xs text-[var(--color-text-muted)] md:text-right">
            Code: Next.js 15 + Payload CMS · Photos: AI &amp; archives
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] font-medium mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-deep-forest)] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
