import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchBlogPostBySlug } from '@/lib/data';
import { formatDateUk } from '@/lib/utils/format';
import { ArticleSchema } from '@/components/seo/ArticleSchema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await fetchBlogPostBySlug(slug)) as any;
  if (!post) return { title: 'Не знайдено' };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/zhurnal/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage?.url ?? post.heroImage?.url].filter(Boolean) as string[],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await fetchBlogPostBySlug(slug)) as any;
  if (!post) notFound();

  return (
    <>
      <ArticleSchema post={post} />
      <article className="editorial-narrow py-12 md:py-20">
        <header className="mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
            {post.publishedAt ? formatDateUk(post.publishedAt) : ''}
            {post.readingTimeMinutes && ` · ${post.readingTimeMinutes} хв читання`}
          </p>
          <h1 className="font-[var(--font-display)] text-3xl md:text-5xl text-[var(--color-deep-forest)] leading-[1.05]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 text-xl text-[var(--color-text-secondary)] leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.heroImage?.url && (
          <div className="relative aspect-[16/9] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] mb-10">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt ?? post.title}
              fill
              priority
              sizes="(min-width: 1024px) 880px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose-editorial">
          {/* Lexical/RichText is rendered server-side; fallback to plain text */}
          {typeof post.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <RichTextRenderer content={post.content} />
          )}
        </div>

        {post.faq?.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[var(--color-border-soft)]">
            <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] mb-6">
              Часто запитують
            </h2>
            <dl className="space-y-6">
              {post.faq.map((q: any, i: number) => (
                <div key={i}>
                  <dt className="font-medium text-[var(--color-deep-forest)] mb-2">
                    {q.question}
                  </dt>
                  <dd className="text-[var(--color-text-secondary)] leading-relaxed">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>
    </>
  );
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;
  // Minimal Lexical rendering — extract text from root.children
  if (content.root?.children) {
    return (
      <>
        {content.root.children.map((node: any, i: number) => {
          if (node.type === 'heading') {
            const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4';
            return <Tag key={i}>{extractText(node)}</Tag>;
          }
          if (node.type === 'paragraph') {
            return <p key={i}>{extractText(node)}</p>;
          }
          if (node.type === 'list') {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul';
            return (
              <ListTag key={i}>
                {(node.children ?? []).map((li: any, j: number) => (
                  <li key={j}>{extractText(li)}</li>
                ))}
              </ListTag>
            );
          }
          return null;
        })}
      </>
    );
  }
  return null;
}

function extractText(node: any): string {
  if (!node) return '';
  if (node.text) return node.text;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}
