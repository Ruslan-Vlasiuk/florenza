// NOTE: schema.org BuyAction is intentionally absent. Florenza has no public
// checkout URL — orders flow through Лія (web chat / Telegram / Viber), so
// BuyAction.target would have no valid handler. Product.offers covers Google
// rich results without it.
export function ProductSchema({
  bouquet,
  finalPrice,
}: {
  bouquet: any;
  finalPrice: number;
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://florenza-irpin.com/buket/${bouquet.slug}`,
    name: bouquet.name,
    description: bouquet.descriptionShort,
    image: bouquet.primaryImage?.url,
    brand: { '@type': 'Brand', name: 'Florenza' },
    offers: {
      '@type': 'Offer',
      url: `https://florenza-irpin.com/buket/${bouquet.slug}`,
      priceCurrency: 'UAH',
      price: finalPrice,
      availability:
        bouquet.status === 'published'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Florenza' },
    },
  };

  if (bouquet.discount?.enabled && bouquet.discount.endAt) {
    data.offers.priceValidUntil = new Date(bouquet.discount.endAt).toISOString().split('T')[0];
  }

  if (bouquet.faq?.length) {
    data.mainEntityOfPage = {
      '@type': 'FAQPage',
      mainEntity: bouquet.faq.map((q: any) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
