# Florenza — Проєкт CLAUDE.md

> **Цей файл лежить у корені репозиторію.** Claude Code автоматично читає його в кожній сесії і дотримується описаних правил.

---

## Проєкт

**Florenza** — преміум флористичний бутік в Ірпені (Україна).
Сайт: AI-native, з консьєржем Лії (Claude API), AI-фото (Gemini), повноцінною адмінкою на Payload CMS.

**Brand:** Florenza
**Owner:** ФОП Каракой Варвара Олександрівна
**Address:** м. Ірпінь, вул. Ірпінська 1
**Domain:** florenza-irpin.com (preliminary)
**Tone:** Quiet editorial sensibility (Aesop × Studio Mondine)

---

## Stack

- **Next.js 15** App Router + TypeScript + React 19
- **Tailwind v4** + shadcn/ui + Magic UI + Framer Motion + Lenis
- **Payload CMS 3.x** (embedded в Next.js, single repo)
- **PostgreSQL 16** (Docker)
- **Anthropic Claude API** для Лії та AI-content
- **Google Gemini API** для AI-фото
- **Whisper open source** локально на VPS для voice transcription
- **VPS Vultr** Ubuntu 24 + Nginx + Let's Encrypt + Docker

---

## MCP Usage Rules — CRITICAL

ALWAYS use these MCPs proactively in this priority:

### shadcn MCP
Для всіх базових компонентів: `Button`, `Card`, `Dialog`, `Form`, `Input`, `Sheet`, `Tabs`, `Toast`, `Avatar`, `Badge`, `Select`, `Checkbox`, `Switch`, `Slider`, `Calendar`, `DropdownMenu`, `Popover`, `Skeleton`, `Tooltip`. **Не пиши ці компоненти з нуля — завжди тягни через shadcn MCP.**

### Magic UI MCP
Для анімованих секцій: marquee, animated text, scroll-driven secs, beam effects, sparkle effects, blur fade, scroll-based animations. **Перш ніж писати анімовану секцію — спочатку перевір чи є готовий блок у Magic UI.**

### Chrome DevTools MCP — MUST-HAVE
Після КОЖНОЇ нової сторінки або великого змінення — ОБОВ'ЯЗКОВО:
1. Відкрий сторінку через chrome-devtools-mcp
2. Зроби скріншоти на iPhone 14 (390×844), iPad (768×1024), Desktop 1440×900
3. Запусти Lighthouse в mobile-режимі з 4G throttling
4. Якщо Performance Score < 85 на mobile — **обов'язково оптимізуй** перш ніж переходити до наступної сторінки
5. Перевір touch-events програмно (ефекти мають працювати на тачскрині)

Це **блокуючі правила**, не опційні. Без Chrome DevTools контролю якість падає.

### context7 MCP
Для актуальної документації Next.js 15, Tailwind v4, Framer Motion, Payload CMS. Перш ніж писати код з API цих бібліотек — перевір актуальну документацію.

### UI/UX Pro Max skill
Один раз на самому початку — згенеруй дизайн-систему під «editorial florist boutique premium aesthetic» і збережи в `design-system/MASTER.md`. Подальші компоненти — завжди в цій системі токенів.

---

## Workflow

### Послідовність розробки

1. **Спочатку:** UI/UX Pro Max → дизайн-система → `design-system/MASTER.md` → CSS-токени в `app/globals.css`
2. **Інфраструктура:** Docker setup, Postgres, Payload CMS, базові колекції
3. **Demo seed:** скрипт `pnpm seed:demo` створює 30 букетів, 5 кейсів свадеб, 30 статей блогу і т.д.
4. **Сторінки в порядку:** головна → каталог → букет → about → контакти → весільна → корпоративна → журнал → юридичні
5. **Адмінка:** дашборд → букети → замовлення → інбокс → студія фото → блог → знижки → налаштування
6. **AI-інтеграції:** Лія (Claude API) → AI-фото (Gemini) → AI-content (Claude) → Whisper voice
7. **Інтеграції:** Mono → LiqPay → ПРРО → Telegram → Viber → Google Maps → Schema.org
8. **Оптимізація:** Lighthouse audits, mobile-first перевірки, перформанс
9. **Юридичні AI-драфти:** Privacy, Offer, Cookie, Terms

### Definition of Done для кожної сторінки

- [ ] Mobile-first дизайн (проектується для тачскрина перш за все)
- [ ] Responsive на всіх breakpoints (320, 390, 768, 1024, 1440)
- [ ] Lighthouse Performance Mobile ≥85
- [ ] Анімації через CSS transforms / opacity (не layout properties)
- [ ] `prefers-reduced-motion` респектується
- [ ] Schema.org розмітка (де релевантно)
- [ ] OG-теги
- [ ] Скріншоти через Chrome DevTools MCP підтверджені
- [ ] Touch-events перевірені програмно
- [ ] Контент-демо seeded

---

## Design Direction

**Editorial florist boutique. Aesop meets Studio Mondine.**

Палітра (з `app/globals.css`):
- `--color-cream: #F5F0E8`
- `--color-sage: #8A9A7B`
- `--color-deep-forest: #2C3E2D`
- `--color-dusty-rose: #C9A395`
- `--color-graphite: #1A1A1A`

Типографіка:
- **Headings:** Fraunces (variable, modern serif з гуманістичним характером)
- **Body:** Inter

Принципи:
- Generous whitespace
- Full-bleed photography у hero-секціях
- Serif-driven hierarchy
- Soft shadows, organic asymmetry
- Mobile-first ефекти (всі ефекти проектуються спочатку для тачскрина)

---

## AI-System Architecture

### Claude API (для Лії та AI-content)

```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Auto-routing: Sonnet для більшості, Haiku для простих
export async function chat(messages, system, complexity: 'simple' | 'standard' | 'complex' = 'standard') {
  const model = {
    simple: 'claude-haiku-4-5-20251001',
    standard: 'claude-sonnet-4-6',
    complex: 'claude-opus-4-7',
  }[complexity];

  return anthropic.messages.create({
    model,
    max_tokens: 4096,
    system,
    messages,
    tools: [...], // tool definitions
  });
}
```

### Gemini API (тільки фото)

```typescript
// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Image generation і edit (Nano Banana)
export async function generateImage({ prompt, referenceImage, style }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
  // ... use multimodal generation
}
```

### Whisper (локально на VPS)

```typescript
// lib/ai/whisper.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function transcribe(audioFilePath: string, lang = 'uk') {
  // Whisper модель завантажена на VPS у /opt/whisper
  const { stdout } = await execAsync(
    `whisper ${audioFilePath} --model small --language ${lang} --output_format txt`
  );
  return parseTranscription(stdout);
}
```

---

## Code Style

- **TypeScript strict** включений всюди
- **Server Components** за замовчуванням, `'use client'` тільки де потрібна інтерактивність
- **Файли максимум 300 рядків** — більші ділимо
- **Папка `app/`** — App Router сторінки і layouts
- **Папка `components/`** — переюзні UI-компоненти
- **Папка `lib/`** — бізнес-логіка, AI-clients, утиліти
- **Папка `payload/`** — конфігурація Payload CMS (collections, fields, hooks, custom views)
- **Папка `db/`** — міграції і seed-скрипти
- **Папка `tools/`** — Claude tools для AI-Concierge

---

## Localization

- Лише українська на запуск
- Усі строки в `i18n/uk.json` (next-intl)
- Архітектура готова до додавання EN, але EN-локаль закоментована в `i18n/config.ts`

---

## Important Constraints

### НЕ робити

- ❌ Не використовувати email (Resend, SendGrid, Nodemailer) — заборонено
- ❌ Не інтегрувати Instagram API
- ❌ Не додавати GA4, Plausible, Hotjar, Microsoft Clarity, FullStory
- ❌ Не додавати Facebook Pixel, Google Ads remarketing tags
- ❌ Не додавати cookie consent banner — архітектура без third-party tracking
- ❌ Не використовувати API курʼєрських сервісів (Bolt, Glovo, Uklon, Nova Poshta)
- ❌ Не використовувати Sanity або Strapi — у нас Payload
- ❌ Не використовувати MongoDB — у нас Postgres
- ❌ Не писати UI-компоненти з нуля коли є shadcn / Magic UI еквівалент

### Завжди робити

- ✅ Mobile-first проектування ефектів
- ✅ Chrome DevTools перевірки після кожної сторінки
- ✅ Schema.org розмітка
- ✅ Анонімізована server-side analytics (хеш IP, без cookies)
- ✅ Демо-режим з прапорцем `is_demo: true` для всього seed-контенту
- ✅ Версіонування промптів і знижок
- ✅ Логування AI-викликів для відладки

---

## Performance Budget (HARD RULES)

- Lighthouse Performance **Mobile ≥85** — не переходимо до наступної сторінки якщо менше
- LCP < 2.5s, FCP < 1.5s, CLS < 0.1 на 4G
- JS bundle < 150 KB gzipped на критичних сторінках
- Усі анімації GPU-ускорені (`transform`, `opacity`, `will-change`)

---

## AI Provider Routing — для Лії

### Простi діалоги (Haiku)

- Привітання, FAQ-відповіді, прості запити «що є», «скільки коштує»
- Підтвердження після оплати

### Стандартні (Sonnet) — default

- Підбір букета під привід
- Оформлення заказу через діалог
- Уточнення доставки, оплати
- Реакція на голосові

### Складні (Opus, опційно)

- Делікатні теми (ескалації)
- Складні B2B-запити
- Скарги і конфлікти

Logic у `lib/ai/router.ts` — визначає complexity на основі довжини, ключових слів, контексту.

---

## Repository Structure

```
florenza/
├── CLAUDE.md                      ← цей файл
├── README.md
├── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── DEPLOY.md
├── BACKUP.md
├── RUNBOOK.md
├── SECURITY.md
├── ADMIN_GUIDE.md
├── PRE_LAUNCH_CHECKLIST.md
├── BROADCASTS_GUIDE.md
├── AI_PHOTO_GUIDE.md
├── INTEGRATIONS_SETUP.md
├── BRAND_VOICE.md
├── LOGO_BRIEF.md
├── design-system/
│   └── MASTER.md
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── buketu/
│   │   ├── buket/[slug]/
│   │   ├── dostavka-kvitiv-irpin/
│   │   ├── dostavka-kvitiv-bucha/
│   │   ├── dostavka-kvitiv-hostomel/
│   │   ├── vesilna-floristyka/
│   │   ├── korporatyvna-floristyka/
│   │   ├── zhurnal/
│   │   ├── about/
│   │   ├── contacts/
│   │   ├── oferta/
│   │   ├── polityka-konfidentsiynosti/
│   │   ├── cookie-policy/
│   │   └── terms/
│   ├── api/
│   │   ├── chat/        ← AI-Concierge endpoint
│   │   ├── webhook/
│   │   │   ├── mono/
│   │   │   ├── liqpay/
│   │   │   ├── checkbox/
│   │   │   ├── telegram/
│   │   │   └── viber/
│   │   ├── og/          ← @vercel/og generation
│   │   └── analytics/
│   ├── (payload)/
│   │   └── admin/       ← Payload Admin UI
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/              ← shadcn components
│   ├── magicui/         ← magic ui blocks
│   ├── florenza/        ← кастомні компоненти бренду
│   │   ├── BouquetCard.tsx
│   │   ├── DiscountTimer.tsx
│   │   ├── EditorialHero.tsx
│   │   ├── LiyaChat.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── CustomCursor.tsx
│   │   └── ...
│   └── admin/
│       ├── AIPhotoStudio.tsx
│       ├── Inbox.tsx
│       ├── OrdersKanban.tsx
│       └── ...
├── lib/
│   ├── ai/
│   │   ├── claude.ts
│   │   ├── gemini.ts
│   │   ├── whisper.ts
│   │   ├── router.ts
│   │   └── tools/      ← Claude tools для Лії
│   ├── payments/
│   │   ├── mono.ts
│   │   ├── liqpay.ts
│   │   └── checkbox.ts
│   ├── messengers/
│   │   ├── telegram.ts
│   │   └── viber.ts
│   ├── analytics/
│   ├── seo/
│   └── utils/
├── payload/
│   ├── payload.config.ts
│   ├── collections/
│   │   ├── Bouquets.ts
│   │   ├── Orders.ts
│   │   ├── Conversations.ts
│   │   ├── BlogPosts.ts
│   │   └── ...
│   ├── globals/
│   │   ├── BrandVoice.ts
│   │   ├── LiyaRules.ts
│   │   └── BrandSettings.ts
│   └── components/      ← custom admin views
├── db/
│   ├── migrations/
│   └── seed/
│       ├── demo-bouquets.ts
│       ├── demo-blog.ts
│       └── seed.ts
├── public/
│   ├── images/
│   ├── fonts/
│   ├── og-default.png
│   └── manifest.json
└── scripts/
    ├── deploy.sh
    ├── backup.sh
    ├── restore.sh
    └── setup-server.sh
```

---

## Quick Commands

```bash
# Розробка
pnpm dev                         # запуск dev-сервера на :3000
pnpm payload generate:types      # типи з колекцій Payload
pnpm seed:demo                   # заповнення demo-контентом
pnpm seed:wipe-demo              # видалення всього demo

# Деплой
./scripts/deploy.sh              # деплой на VPS
./scripts/backup.sh              # ручний бекап БД

# Тести
pnpm test                        # одноразовий запуск
pnpm test:watch
pnpm test:e2e                    # Playwright

# Linting
pnpm lint
pnpm format
pnpm typecheck
```

---

## Final Reminders

1. **Mobile-first завжди** — не «desktop потім адаптуй», а «mobile спочатку».
2. **Chrome DevTools MCP після кожної сторінки** — це не опція, це частина DoD.
3. **Лія на Claude API, фото на Gemini, voice на Whisper.** Жодних інших AI-провайдерів.
4. **Без email** — комунікація тільки Telegram/Viber.
5. **Без cookie banner** — архітектура без third-party tracking.
6. **Демо-режим перш за все** — Варвара не наповнює сайт «з нуля». Вона **замінює** demo на реальне.
7. **Готовність до запуску = всі етапи DoD пройдені** + `PRE_LAUNCH_CHECKLIST.md` Варваркою виконано.

---

**Цей файл — джерело істини для Claude Code на цьому проєкті.**


## Brain — Project rules

At the start of EVERY session in this project:
  recall("current task in florenza")
  get_project("florenza")

Before making architecture changes:
  log_decision(what="...", why="...", project="florenza")

After fixing any error:
  log_error(error="...", fix="...", project="florenza")

When you see CONTEXT warning:
  session_summary(...) then /compact then recall_current() then continue
