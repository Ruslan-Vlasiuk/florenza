# Florenza — Стартовий промпт для Claude Code

> **Цей файл — перше повідомлення, яке відправляється в новий проєкт у Claude Code.**
>
> Скопіюй вміст нижче (від `BEGIN` до `END`) і вставляй у новий чат у Claude Code, переконавшись, що в директорії проєкту лежать файли: `MAIN_TZ.md`, `CLAUDE.md`, всі інші `.md`-файли архіву.

---

## BEGIN

Привіт! Я починаю розробку преміум флористичного бутіку **Florenza** (м. Ірпінь, Україна) і в цьому репозиторії лежить повне технічне завдання у `.md`-файлах.

**Першим ділом**, будь ласка, виконай таку послідовність:

### Крок 1 — Прочитай контекст

Прочитай у такому порядку:
1. `CLAUDE.md` — правила проєкту, MCP-інструменти, code style
2. `MAIN_TZ.md` — повне ТЗ (15 секцій)
3. `PRE_LAUNCH_CHECKLIST.md` — що Варвара (заказчиця) робить паралельно
4. `ADMIN_GUIDE.md` — як буде виглядати адмінка
5. `BRAND_VOICE.md` — голос бренду
6. `AI_PHOTO_GUIDE.md` — деталі AI-фото pipeline
7. `INTEGRATIONS_SETUP.md` — налаштування зовнішніх API
8. `LOGO_BRIEF.md` — ТЗ для генерації логотипа

### Крок 2 — Перевір MCP-інструменти

Виконай `/mcp` і переконайся, що такі MCP-сервери connected:
- `shadcn` — для UI-компонентів
- `magicui` — для анімованих блоків
- `chrome-devtools` — для перевірки якості (must-have)
- `context7` — для актуальної документації

Якщо чогось немає — встанови згідно `MAIN_TZ.md` секція 12.

Також підключи UI/UX Pro Max skill через:
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

### Крок 3 — Архітектурний план

На основі ТЗ — опиши мені (мовою людини, не списком файлів) **архітектурний план реалізації** на 4 тижні:
- Тиждень 1 — фундамент
- Тиждень 2 — бренд і дизайн
- Тиждень 3 — AI і функціональність
- Тиждень 4 — юридика і фінал

Для кожного тижня — ключові міllестони і Definition of Done з `MAIN_TZ.md` секція 15.

**Не починай писати код** на цьому етапі. Дочекайся мого «ОК, починай».

### Крок 4 — Після мого ОК — починай реалізацію в такій послідовності

#### А) Дизайн-система (першим ділом)

Виклич UI/UX Pro Max skill:
```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "editorial florist boutique premium aesthetic Aesop Studio Mondine" \
  --design-system --persist -p "Florenza"
```

Збережи в `design-system/MASTER.md`. Застосуй токени до `app/globals.css`. Перевір, що палітра і типографіка відповідають `MAIN_TZ.md` секція 4.

#### B) Інфраструктура

```bash
pnpm create next-app@latest florenza --typescript --tailwind --app --src-dir=false
cd florenza
pnpm add payload @payloadcms/db-postgres @payloadcms/richtext-lexical
pnpm add @anthropic-ai/sdk @google/generative-ai
pnpm add framer-motion @studio-freight/lenis @use-gesture/react
pnpm add lucide-react
pnpm add @vercel/og
pnpm add zod date-fns
pnpm add -D drizzle-kit
```

Налаштуй:
- `payload.config.ts` з PostgreSQL adapter
- `docker-compose.yml` з Next.js + Postgres
- `Dockerfile`
- `.env.example` з усіма змінними (див. `INTEGRATIONS_SETUP.md`)

#### C) Колекції Payload

Створи всі колекції згідно `MAIN_TZ.md` секція 7. Особлива увага:
- `Bouquets` — з полями для discount object, image_generation_context, мульти-таксономія
- `Orders` — з state machine
- `Conversations` + `Messages` — для AI-Concierge inbox
- `LiyaRules` (global) — структуровані поля, які компілюються в системний промпт
- `BrandVoice` (global) — поля голосу бренда
- Globals: `BrandSettings`, `PaymentSettings`, `DeliverySettings`

Через Payload `useFields` хуки і custom admin views створи спеціальні розділи з `MAIN_TZ.md` секція 5.4.

#### D) Demo seed

Створи скрипт `db/seed/seed.ts` що:
- Генерує 30 демо-букетів через Gemini API (фото + AI описи через Claude)
- Створює 5 кейсів свадеб, 2 корпоративні кейси, 8 відгуків
- Генерує 30 демо-статей блогу через Claude (з self-critique pipeline)
- Усі записи помічені `is_demo: true`
- Додає юр.документи з прапорцем `requires_lawyer_review: true`

**Важливо:** Усі AI-виклики у seed мають retry-логіку і progress-логування, щоб Варвара бачила процес.

#### E) Сторінки в порядку

1. Layout + globals.css (з токенами з UI/UX Pro Max)
2. Головна (`/`) з editorial hero, USP-bento, featured carousel, спецпропозиції секція, відгуки marquee
3. Каталог (`/buketu`) з 3 осями фільтрів, asymmetric grid, hover swap
4. Букет (`/buket/[slug]`) зі sticky info, галереєю, 3D photo-sequence rotation, таймером знижки
5. Локальні гео-сторінки (`/dostavka-kvitiv-irpin` і т.д.)
6. Категорійні сторінки (програмні шаблони)
7. About з scroll-driven storytelling (mobile vertical-snap)
8. Контакти з Google Maps embed, Schema.org LocalBusiness
9. Весільна (з формою брифа і drag-n-drop фото-референсів)
10. Корпоративна (з формою запиту)
11. Журнал (`/zhurnal`) — список + сторінка статті
12. Юр.сторінки (Privacy, Offer, Cookie, Terms)

**Після кожної сторінки:** Chrome DevTools MCP перевіряє mobile (390×844), iPad (768×1024), desktop (1440×900) + Lighthouse mobile audit. Performance < 85 — оптимізуй перш ніж переходити далі.

#### F) AI-Concierge Лія

Реалізуй у `lib/ai/`:
- `claude.ts` — клієнт Anthropic SDK з auto-routing (Haiku / Sonnet / Opus)
- `tools/` — всі Claude tools (search_bouquets, get_delivery_slots, calculate_order_price, create_pending_order, generate_payment_link, escalate_to_varvara, тощо — повний список у `MAIN_TZ.md` секція 5.5)
- `system-prompt-builder.ts` — компілює системний промпт з `BrandVoice` + `LiyaRules` + поточного контексту (активні знижки, доступні слоти)
- `conversation-manager.ts` — завантаження історії, виконання tools loop, збереження повідомлень

Інтегруй у:
- `app/api/chat/` — endpoint для сайт-чата (Server-Sent Events для streaming)
- `app/api/webhook/telegram/` — webhook для Telegram-бота
- `app/api/webhook/viber/` — webhook для Viber-бота

Реалізуй disclosure при першому повідомленні в новій сесії.

#### G) AI-фото pipeline

`lib/ai/gemini.ts` — клієнт для Gemini Image (Nano Banana). Two methods:
- `generateImage(prompt, style)` — text-to-image
- `transformFromReference(refImage, prompt, style)` — image-edit

`components/admin/AIPhotoStudio.tsx` — UI з двома режимами, превʼю, утвердження, збереження `image_generation_context` у картці букета.

#### H) AI-content для блогу

`lib/ai/blog-pipeline.ts` — 8-крокова pipeline (`MAIN_TZ.md` секція 5.7).
Cron у Vercel Cron / Inngest — щоденно о 09:00 запускає generation згідно квоти Варвари.

#### I) Платежі

`lib/payments/`:
- `mono.ts` — Monobank Acquiring SDK
- `liqpay.ts` — LiqPay SDK
- `checkbox.ts` — Checkbox.ua API для ПРРО + відправка чеків в Telegram/Viber
- Webhook handlers у `app/api/webhook/`

#### J) Voice (Whisper локально)

Whisper встановлюється на VPS на етапі `setup-server.sh`. У коді — обгортка `lib/ai/whisper.ts` що викликає бінарь через `child_process.exec`.

#### K) Адмінка — кастомні views

- `AIPhotoStudio` — генератор фото
- `Inbox` — діалоги з усіх каналів
- `OrdersKanban` — drag-n-drop статусів
- `BlogPipeline` — управління чергою генерації блогу
- `BrandVoiceEditor` — структурований редактор голосу
- `LiyaRulesEditor` — структурований редактор правил
- `Broadcasts` — створення розсилок з AI-помічником
- `DiscountManager` — bulk-операції зі знижками
- `Analytics` — server-side метрики

#### L) Інтеграції

- Google Search Console (через `app/api/sitemap.xml`)
- Google Maps embed (просто iframe)
- Schema.org компоненти (LocalBusinessSchema, ProductSchema, BreadcrumbSchema, FAQSchema, ArticleSchema, ReviewSchema)
- OG-images генерація через `@vercel/og` для кожної динамічної сторінки

#### M) Server-side analytics

`lib/analytics/`:
- Хешування IP (SHA-256 з обертовою salt)
- Запис у Postgres `analytics_events`
- Дашборд в адмінці з фільтрами і метриками
- Funnel: home → каталог → букет → корзина → оплата

#### N) Performance і фінал

- Lighthouse audit на всіх ключових сторінках
- Виправлення всіх критичних issues
- Додавання `prefers-reduced-motion`
- Підготовка PWA-маніфеста

#### O) Документація

- Поновити `RUNBOOK.md` з реальними командами
- Поновити `DEPLOY.md` з кроками деплою
- Створити `BACKUP.md` (cron + rsync на Backblaze B2)
- Створити `SECURITY.md` (SSH, firewall, fail2ban, security updates)

### Крок 5 — Фінальна перевірка

Перш ніж сказати «готово»:
- [ ] Всі сторінки з `MAIN_TZ.md` секція 3 створені
- [ ] Demo seed працює і створює 30 букетів, 30 статей
- [ ] Лія відповідає на тестові повідомлення в усіх 3 каналах
- [ ] Тестовий заказ можна оформити end-to-end (заказ → оплата → ПРРО чек → статус)
- [ ] Всі сторінки Lighthouse Mobile ≥85
- [ ] Юр.документи AI-драфти створені з прапорцем `requires_lawyer_review`
- [ ] `PRE_LAUNCH_CHECKLIST.md` готовий і інструктивний для Варвари
- [ ] Документ `LOGO_BRIEF.md` створений (вже є в репозиторії)
- [ ] Налаштовані Telegram-бот, Viber-бот, Mono, LiqPay, ПРРО (тест-режим)

### Важливо

1. **Не пиши «з нуля» — використовуй MCP** (shadcn, magicui) кожен раз де можна
2. **Mobile-first** — кожна сторінка проектується для тачскрина перш за все
3. **Chrome DevTools MCP після кожної сторінки** — це блокуючий крок
4. **Демо-контент — це частина продукту**, не побічна задача. Варвара починає не з пустого сайту.
5. **Якщо щось у ТЗ невизначено** — спитай у мене перш ніж приймати рішення.
6. **Якщо MCP недоступний** — попередь і запропонуй альтернативу.
7. **Якщо Performance не вдається витягнути до 85** — попередь і запропонуй що відкинути.

Готовий?

## END

---

## Notes for human (Varvara / project owner)

Цей промпт — стартова точка. Після того як Claude Code прочитав ТЗ і дав архітектурний план, ти кажеш «ОК, починай» і він реалізує.

**Що ти маєш зробити паралельно** (поки Claude Code пише код):
- Перевір `Florenza` в Укрпатенті
- Купи домен `florenza-irpin.com` (або фінальний)
- Зареєструй VPS на Vultr
- Подай заявку на Mono Acquiring
- Подай заявку на ПРРО Checkbox.ua
- Зареєструй Telegram-бот через @BotFather
- Зареєструй Viber-бот через Viber Admin Panel
- Створи акаунт у Google AI Studio для Gemini API
- Створи акаунт у Anthropic Console для Claude API
- Подай Google Business Profile для Ірпеня (фізична адреса)
- Знайди юриста (Telegram: @ua_legal або lawyer.ua) для перевірки документів

Все це — у `PRE_LAUNCH_CHECKLIST.md`.
