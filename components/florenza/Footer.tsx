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
    <footer className="border-t border-[var(--color-border-soft)] mt-32">
      <div className="editorial-container py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2">
            <Link
              href="/"
              className="font-[var(--font-display)] text-3xl tracking-tight text-[var(--color-deep-forest)]"
            >
              florenza
            </Link>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Преміум флористичний бутік у Ірпені. Тиха editorial-чутливість, авторські букети,
              доставка по ИБГ та ближньому Києву.
            </p>
            <p className="mt-6 text-xs text-[var(--color-text-muted)]">
              ФОП Каракой Варвара Олександрівна
              <br />
              м. Ірпінь, вул. Ірпінська 1
            </p>
          </div>

          <FooterColumn title="Магазин" items={FOOTER_LINKS.shop} />
          <FooterColumn title="Сервіси" items={FOOTER_LINKS.services} />
          <FooterColumn title="Бренд" items={FOOTER_LINKS.about} />
          <FooterColumn title="Юридичне" items={FOOTER_LINKS.legal} />
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border-soft)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Florenza. Усі права захищено.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Фото на сайті створені або стилізовані за допомогою AI на основі реальних букетів.
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
