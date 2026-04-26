export function ArticleSchema({ post }: { post: any }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage?.url,
    author: { '@type': 'Organization', name: 'Florenza' },
    publisher: {
      '@type': 'Organization',
      name: 'Florenza',
      logo: {
        '@type': 'ImageObject',
        url: 'https://florenza-irpin.com/logo.svg',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://florenza-irpin.com/zhurnal/${post.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
