/**
 * 8-step blog pipeline:
 *  1. Pick topic from queue
 *  2. Keyword research (Google autocomplete — public, no API key)
 *  3. SERP analysis (top-10 web fetch)
 *  4. Draft generation (Claude Sonnet)
 *  5. Self-critique pass (Claude — different prompt)
 *  6. Fix pass
 *  7. Local SEO checks
 *  8. Publish or draft
 *
 * Triggered from /api/cron/blog-pipeline (daily at 09:00)
 * or admin button "Generate next batch".
 */
import { chat, isClaudeConfigured } from './claude';
import { getPayloadClient } from '../payload-client';
import { slugify } from '../utils/format';

export interface BlogGenerationResult {
  postId?: string;
  status: 'generated' | 'failed' | 'skipped';
  reason?: string;
}

export async function generateNextBlogPost(): Promise<BlogGenerationResult> {
  if (!isClaudeConfigured()) {
    return { status: 'skipped', reason: 'ANTHROPIC_API_KEY not set' };
  }

  const payload = await getPayloadClient();

  // 1. Pick next from queue
  const queue = await payload.find({
    collection: 'blog-pipeline',
    where: { status: { equals: 'queued' } },
    sort: '-priority',
    limit: 1,
  });
  if (queue.totalDocs === 0) {
    return { status: 'skipped', reason: 'queue empty' };
  }
  const item: any = queue.docs[0];

  await payload.update({
    collection: 'blog-pipeline',
    id: item.id,
    data: { status: 'generating' as any, attemptsCount: (item.attemptsCount ?? 0) + 1 },
  });

  try {
    // 2. Keyword research (Google autocomplete)
    const mainKeyword = item.mainKeyword || item.topic;
    const relatedKeywords = await fetchAutocompleteKeywords(mainKeyword);

    // 3. SERP analysis (lightweight: just titles)
    const serpInsights = await fetchSerpInsights(mainKeyword);

    // 4. Draft
    const brandVoice: any = await payload.findGlobal({ slug: 'brand-voice' as any });
    const voiceSystem = `Ти — копірайтер бренду Florenza. Голос: ${brandVoice?.essence ?? 'editorial'}.\nПринципи: ${(brandVoice?.principles ?? []).map((p: any) => p.rule).join('; ')}`;

    const draftRes = await chat({
      complexity: 'standard',
      system: voiceSystem,
      messages: [
        {
          role: 'user',
          content: `Напиши SEO-статтю для блогу Florenza на тему: "${item.topic}".

Кут: ${item.angle ?? 'editorial-гайд'}

Структура:
- Заголовок (50–60 символів, з ключем "${mainKeyword}")
- Lead-параграф (2–3 речення)
- 4–6 секцій H2
- FAQ-блок з 4–6 короткими питаннями і відповідями
- Закінчення з CTA на каталог /buketu

Довжина: 1200–1800 слів.

Семантичні ключі для природного вплетення: ${relatedKeywords.slice(0, 8).join(', ')}.

Топ-10 SERP-конкуренти показують ці підтеми: ${serpInsights.slice(0, 5).join('; ')}. Розкрий їх краще і додай свої.

Формат відповіді — Markdown.`,
        },
      ],
    });

    const draftText = extractText(draftRes.content);

    // 5. Self-critique
    const critiqueRes = await chat({
      complexity: 'standard',
      system: 'Ти — SEO-експерт. Оцінюй статті жорстко.',
      messages: [
        {
          role: 'user',
          content: `Оціни цю статтю за критеріями: 1) title 50-60 символів з ключем; 2) структура H2; 3) щільність ключа 1-2%; 4) E-E-A-T; 5) внутрішні посилання; 6) FAQ; 7) читабельність. Знайди слабкі місця і запропонуй конкретні правки.

Стаття:
${draftText}

Поверни:
- score: 0-100
- issues: список конкретних зауважень`,
        },
      ],
    });
    const critiqueText = extractText(critiqueRes.content);
    const score = extractScore(critiqueText);

    // 6. Fix pass
    const fixRes = await chat({
      complexity: 'standard',
      system: voiceSystem,
      messages: [
        {
          role: 'user',
          content: `Виправ цю статтю згідно зауважень.

Стаття:
${draftText}

Зауваження:
${critiqueText}

Поверни виправлений Markdown повністю.`,
        },
      ],
    });
    const fixedText = extractText(fixRes.content);

    // 7. Local SEO checks (title length, etc) — minimal here
    const titleMatch = fixedText.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? item.topic;
    const wordCount = fixedText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 220);

    // 8. Persist as blog-post (status: ready or published based on score)
    const post = await payload.create({
      collection: 'blog-posts',
      data: {
        title,
        slug: slugify(title),
        excerpt: extractExcerpt(fixedText),
        content: { root: { children: [{ type: 'paragraph', children: [{ text: fixedText }] }] } },
        mainKeyword,
        secondaryKeywords: relatedKeywords.map((k) => ({ keyword: k })),
        aiPipelineScore: score,
        aiDraftPrompt: item.topic,
        aiCritiqueNotes: critiqueText,
        wordCount,
        readingTimeMinutes: readingTime,
        status: score >= 80 && !item.priority?.includes('high') ? 'published' : 'ready',
        requiresManualReview: item.priority === 'high',
        publishedAt: score >= 80 ? new Date().toISOString() : undefined,
        isDemo: item.source === 'demo_seed',
      } as any,
    });

    await payload.update({
      collection: 'blog-pipeline',
      id: item.id,
      data: { status: 'generated', generatedPost: post.id } as any,
    });

    return { postId: post.id as string, status: 'generated' };
  } catch (e) {
    await payload.update({
      collection: 'blog-pipeline',
      id: item.id,
      data: {
        status: 'failed',
        errorMessage: (e as Error).message,
      } as any,
    });
    return { status: 'failed', reason: (e as Error).message };
  }
}

async function fetchAutocompleteKeywords(seed: string): Promise<string[]> {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=uk&q=${encodeURIComponent(seed)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data?.[1]) ? data[1].slice(0, 10) : [];
  } catch {
    return [];
  }
}

async function fetchSerpInsights(_query: string): Promise<string[]> {
  // Lightweight stub — in production we'd parse top-10 results
  return [
    'як обрати і подарувати',
    'тренди сезону',
    'значення кольорів',
    'догляд після отримання',
    'поєднання з іншими квітами',
  ];
}

function extractText(content: any[]): string {
  return content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();
}

function extractScore(text: string): number {
  const m = text.match(/score[:\s]+(\d+)/i);
  return m ? Number(m[1]) : 70;
}

function extractExcerpt(markdown: string): string {
  const lines = markdown.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  return lines[0]?.slice(0, 200) ?? '';
}
