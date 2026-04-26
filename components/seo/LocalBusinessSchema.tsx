/**
 * Schema.org LocalBusiness for Florenza, Ірпінь.
 * Rendered into <head> of every page (via root layout).
 */
export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': 'https://florenza-irpin.com/#business',
    name: 'Florenza',
    legalName: 'ФОП Каракой Варвара Олександрівна',
    url: 'https://florenza-irpin.com',
    image: 'https://florenza-irpin.com/og-default.png',
    logo: 'https://florenza-irpin.com/logo.svg',
    description:
      'Преміум флористичний бутік в Ірпені. Авторські букети, доставка по ИБГ та ближньому Києву.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Ірпінська 1',
      addressLocality: 'Ірпінь',
      addressRegion: 'Київська область',
      postalCode: '08200',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.5126,
      longitude: 30.2464,
    },
    areaServed: [
      { '@type': 'City', name: 'Ірпінь' },
      { '@type': 'City', name: 'Буча' },
      { '@type': 'City', name: 'Гостомель' },
      { '@type': 'City', name: 'Київ' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    priceRange: '₴₴₴',
    paymentAccepted: ['Credit Card', 'Apple Pay', 'Google Pay', 'Cash'],
    currenciesAccepted: 'UAH',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
