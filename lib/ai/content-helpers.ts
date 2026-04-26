/**
 * Helper functions for AI-assisted card editing.
 * Used by admin "🤖 Suggest" buttons in bouquet card editor.
 */
import { chat, isClaudeConfigured } from './claude';
import { getPayloadClient } from '../payload-client';

export async function suggestBouquetName(context: {
  imageGenerationContext?: string;
  composition?: Array<{ item: string; count: number }>;
  emotionalTone?: string[];
}): Promise<string[]> {
  if (!isClaudeConfigured()) return ['(додайте ANTHROPIC_API_KEY)'];

  const payload = await getPayloadClient();
  const brandVoice: any = await payload.findGlobal({ slug: 'brand-voice' as any }).catch(() => ({}));

  const compositionStr = (context.composition ?? [])
    .map((c) => `${c.count} ${c.item}`)
    .join(', ');

  const res = await chat({
    complexity: 'simple',
    system: `Ти — копірайтер Florenza. Голос бренду: ${brandVoice?.essence ?? 'тиха editorial-чутливість'}.
Імена букетів — короткі (1–2 слова), поетичні, без "квіточки", "букетик". Як в Aesop. Приклади: "Світанок", "Тиха гавань", "Іспанська ніч".`,
    messages: [
      {
        role: 'user',
        content: `Запропонуй 5 варіантів імені для букета.

${context.imageGenerationContext ? `Опис фото: ${context.imageGenerationContext}\n` : ''}${compositionStr ? `Склад: ${compositionStr}\n` : ''}${context.emotionalTone?.length ? `Тон: ${context.emotionalTone.join(', ')}\n` : ''}
Формат: одне ім'я на рядок. Без нумерації, без пояснень.`,
      },
    ],
  });

  return extractText(res.content)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function suggestBouquetDescription(context: {
  name: string;
  imageGenerationContext?: string;
  composition?: Array<{ item: string; count: number }>;
  short?: boolean;
}): Promise<string> {
  if (!isClaudeConfigured()) return '(додайте ANTHROPIC_API_KEY у налаштуваннях)';

  const payload = await getPayloadClient();
  const brandVoice: any = await payload.findGlobal({ slug: 'brand-voice' as any }).catch(() => ({}));

  const compositionStr = (context.composition ?? [])
    .map((c) => `${c.count} ${c.item}`)
    .join(', ');

  const res = await chat({
    complexity: 'simple',
    system: `Ти — копірайтер Florenza. Editorial-стиль (Aesop × Studio Mondine).

Заборонені слова: ${(brandVoice?.forbiddenWords ?? []).map((w: any) => w.word).join(', ')}.
Заборонені фрази: ${(brandVoice?.forbiddenPhrases ?? []).map((p: any) => `"${p.phrase}"`).join(', ')}.

Принципи:
- Конкретика > абстракція
- Без вигуків
- 1 емоджі максимум на текст
- Не "чарівна композиція", а "5 півоній з евкаліптом"`,
    messages: [
      {
        role: 'user',
        content: `Напиши ${context.short ? 'короткий (1–2 речення)' : 'розгорнутий (3–5 речень)'} опис букета "${context.name}".

${context.imageGenerationContext ? `На фото: ${context.imageGenerationContext}\n` : ''}${compositionStr ? `Склад: ${compositionStr}\n` : ''}
Текст лаконічний, природний, без маркетингу. Без заголовків.`,
      },
    ],
  });

  return extractText(res.content).trim();
}

export async function suggestSeoMeta(context: {
  name: string;
  description?: string;
  mainFlower?: string;
}): Promise<{ title: string; description: string }> {
  if (!isClaudeConfigured()) {
    return { title: context.name, description: context.description?.slice(0, 160) ?? '' };
  }

  const res = await chat({
    complexity: 'simple',
    system: 'Ти — SEO-копірайтер. Пиши meta-теги.',
    messages: [
      {
        role: 'user',
        content: `Напиши meta-теги для сторінки букета.

Назва: ${context.name}
${context.mainFlower ? `Головна квітка: ${context.mainFlower}\n` : ''}${context.description ? `Опис: ${context.description}\n` : ''}
Формат:
TITLE: <50–60 символів>
DESCRIPTION: <140–160 символів>

Включи у title "Florenza" і "Ірпінь" якщо вміщається.`,
      },
    ],
  });

  const text = extractText(res.content);
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const descMatch = text.match(/DESCRIPTION:\s*(.+)/i);
  return {
    title: titleMatch?.[1]?.trim().slice(0, 60) ?? context.name,
    description: descMatch?.[1]?.trim().slice(0, 160) ?? context.description?.slice(0, 160) ?? '',
  };
}

function extractText(content: any[]): string {
  return content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();
}
