import { getPayloadClient } from '@/lib/payload-client';
import { notFound } from 'next/navigation';

export async function LegalDocumentPage({ slug }: { slug: string }) {
  let doc: any = null;
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'legal-documents',
      where: { slug: { equals: slug } },
      limit: 1,
    });
    doc = r.docs[0];
  } catch (e) {
    console.error('[legal] failed to load', slug, e);
  }

  if (!doc) {
    return (
      <div className="editorial-narrow py-16">
        <p className="text-[var(--color-text-secondary)]">
          Документ підготовлюється. Зайдіть пізніше.
        </p>
      </div>
    );
  }

  return (
    <article className="editorial-narrow py-12 md:py-20 prose-editorial">
      <header className="mb-8">
        <h1 className="font-[var(--font-display)] text-3xl md:text-5xl text-[var(--color-deep-forest)]">
          {doc.title}
        </h1>
        {doc.effectiveDate && (
          <p className="mt-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Чинна з {new Date(doc.effectiveDate).toLocaleDateString('uk-UA')} · версія{' '}
            {doc.version ?? '1.0'}
          </p>
        )}
        {doc.requiresLawyerReview && (
          <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
            ⚠️ Це AI-чернетка документа. До запуску потребує перевірки юристом.
          </div>
        )}
      </header>

      <div>
        {typeof doc.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: doc.content }} />
        ) : (
          <RichRender content={doc.content} />
        )}
      </div>
    </article>
  );
}

function RichRender({ content }: { content: any }) {
  if (!content?.root?.children) return null;
  return (
    <>
      {content.root.children.map((node: any, i: number) => {
        if (node.type === 'heading') {
          const Tag = (node.tag ?? 'h2') as any;
          return <Tag key={i}>{extractText(node)}</Tag>;
        }
        if (node.type === 'paragraph') {
          return <p key={i}>{extractText(node)}</p>;
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'number' ? 'ol' : 'ul';
          return (
            <Tag key={i}>
              {(node.children ?? []).map((li: any, j: number) => (
                <li key={j}>{extractText(li)}</li>
              ))}
            </Tag>
          );
        }
        return null;
      })}
    </>
  );
}

function extractText(node: any): string {
  if (!node) return '';
  if (node.text) return node.text;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}
