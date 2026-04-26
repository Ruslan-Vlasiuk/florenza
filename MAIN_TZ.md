# Florenza — Повне технічне завдання

**Версія:** 1.0 фінальна
**Дата:** 27 квітня 2026
**Призначення:** Цей документ — основне технічне завдання для розробки сайту Florenza через Claude Code. Передається у репозиторій разом із `CLAUDE.md` та `STARTUP_PROMPT.md`.

---

## 1. Executive Summary

**Florenza** — преміум флористичний бутік нового покоління в Ірпені (Київська область, Україна). Перший AI-native флорист в регіоні: всі комунікації з клієнтом обробляє AI-консультантка **Лія**, заказчиця **Варвара Олександрівна Каракой** підключається лише до ескалованих кейсів.

**Місія сайту:** дати клієнту в Ірпені, Бучі, Гостомелі та ближньому Києві премʼєм-досвід замовлення квітів — від першого контакту до доставки — без жодного телефонного дзвінка з боку магазину, з editorial-естетикою рівня Aesop / Studio Mondine, та з SEO-домінуванням у регіоні.

**Конкурентна перевага:**
1. Перший повноцінний бутік-бренд у регіоні (локальні конкуренти — Instagram + примітивні Prom.ua вітрини)
2. AI-консультантка Лія, що обробляє 80%+ заказів повністю автономно (24/7, у Telegram + Viber + чат на сайті)
3. AI-генерація фото та текстів — візуальна консистентність на десятки букетів без професійної фотосесії
4. SEO Phase 1 + Phase 2 одночасно на запуску — програмні гео-сторінки під ИБГ + блог з 30 SEO-оптимізованими статтями
5. Editorial-дизайн з mobile-first вау-ефектами

---

## 2. Цільова аудиторія та позиціонування

### Цільова аудиторія

Платоспроможні мешканці Ірпеня-Бучі-Гостомеля та ближнього Києва, 28–55 років, які цінують редкість і особистий підхід. Розподіл по сегментам:

- **Premium "вхідний"** (40%): мінібукети 800–1500 грн, спонтанні покупки, молодша аудиторія 25–35
- **Premium "основний"** (45%): авторські букети 2000–5000 грн, дні народження, річниці, спонтанні романтичні жести
- **Premium "топ"** (10%): весільна флористика 15 000+ грн, корпоративні події, регулярні підписки в офіси
- **B2B-корпоратив** (5%): регулярні поставки в готелі, ресторани, офіси, оформлення відкриттів

### Позиціонування бренду

**"Тиха editorial-чутливість"** — простір між Aesop (продумана стриманість) і Studio Mondine (жива, чуттєва природа квітів без «відполірованості»).

**Tone of voice:**
- Сдержана витонченість з теплою людяністю
- Не пишно-весільне, не мас-маркет, не «паризька класика за замовчуванням»
- Природні матеріали, м'яке світло, organic shadows, painterly composition

**Палітра бренду:**
- Cream `#F5F0E8` — основний фон
- Sage `#8A9A7B` — приглушений зелений
- Deep forest `#2C3E2D` — основний акцент
- Dusty rose `#C9A395` — теплий акцент
- Графіт `#1A1A1A` — для тексту

**Типографіка:**
- **Headings:** Fraunces (variable, Modern Serif з гуманістичним характером) — повторює дух бренду
- **Body:** Inter (Sans, читабельний, нейтральний)
- **Display monumental:** Fraunces Heavy для ключових заголовків hero-секцій

### Конкурентне позиціонування (3 осі відстройки)

1. **Від локальних флористів ИБГ** — у них Instagram + примітивні вітрини / телефонні фото / шаблони OLX. Ми — перший справжній бутік-бренд регіону з AI-консьєржем
2. **Від київських преміум-флористів** (Quintessentially, Fleurs de Villa) — у них хороший сайт, але ми локальні: гарантована доставка по ИБГ за 1–2 години, особистий контакт флористки, розуміння місцевої аудиторії
3. **Від агрегаторів-доставок «24/7»** — у них немає бренду. Ми продаємо авторство і історію кожного букета

---

## 3. Структура сайту

### Сторінки (Phase 1 — на запуск)

| URL | Призначення | Ключові елементи |
|---|---|---|
| `/` | Головна | Editorial hero, USP-bento, featured bouquets carousel, відгуки marquee, секція спецпропозицій (показ якщо є активні знижки) |
| `/buketu` | Каталог з фільтрами | Asymmetric grid карток з hover image swap, 3 осі фільтрів: тип / квітка / привід, sticky-фільтри (на mobile — bottom-sheet) |
| `/buket/[slug]` | Сторінка букета | Sticky info-панель справа, галерея з 3D-обертанням через photo-sequence (8–12 ракурсів), склад букета, related products, **таймер знижки** |
| `/buketu/{type}` | Категорійна (тип) | Editorial-опис категорії, контент-блок про сезон/привід, ринок-фокус |
| `/buketu/{flower}` | Категорійна (квітка) | Editorial-опис квітки (характер, сезон), варіанти букетів |
| `/buketu/{occasion}` | Категорійна (привід) | Editorial-есе про привід, рекомендації |
| `/buketu/{combo}` | Програмні комбінаційні (cross-axis) | напр. `/buketu/pivonii-na-den-narodzhennya` — унікальний H1 + опис + товари + FAQ-секція |
| `/dostavka-kvitiv-irpin` | Локальна гео-сторінка Ірпінь | Унікальний контент: «доставка по Ірпеню від Покровської до Романовки за 1–2 години», локальні відгуки, карта зони |
| `/dostavka-kvitiv-bucha` | Локальна гео-сторінка Буча | Аналогічно, з локальними деталями |
| `/dostavka-kvitiv-hostomel` | Локальна гео-сторінка Гостомель | Аналогічно |
| `/vesilna-floristyka` | Весільна флористика | Editorial-сторінка, форма брифа нареченої, кейси, типові пакети |
| `/korporatyvna-floristyka` | Корпоративна флористика | B2B-tone, кейси, форма запиту, послуги |
| `/zhurnal` | Блог (журнал) | Список статей, фільтр по тегах, search |
| `/zhurnal/[slug]` | Стаття блогу | Editorial layout, related posts, FAQ-блок, social share |
| `/about` | Про нас | Editorial-сторітелінг з scroll-driven анімаціями (на mobile — vertical-snap-scroll) |
| `/contacts` | Контакти | Адреса, час роботи, Google Maps embed, кнопки месенджерів |
| `/oferta` | Публічна оферта | Юр.документ |
| `/polityka-konfidentsiynosti` | Privacy Policy | Юр.документ |
| `/cookie-policy` | Cookie Policy | Юр.документ |
| `/terms` | Terms of Service | Юр.документ |
| `/admin` | Адмінка Payload CMS | Закрита, тільки для Варвари |

### Phase 2 (через 1–3 місяці після запуску, не на старт)

- Майстер-класи з флористики
- Підписки на квіти (recurring billing)
- Розширені програмні SEO-сторінки за всіма комбінаціями

---

## 4. Дизайн-направление

### Палітра

```css
:root {
  /* Primary */
  --color-cream: #F5F0E8;
  --color-sage: #8A9A7B;
  --color-deep-forest: #2C3E2D;
  --color-dusty-rose: #C9A395;
  --color-graphite: #1A1A1A;

  /* Functional */
  --color-bg-primary: var(--color-cream);
  --color-bg-secondary: #EFE9DD;
  --color-text-primary: var(--color-graphite);
  --color-text-secondary: #4A4A4A;
  --color-accent: var(--color-deep-forest);
  --color-accent-soft: var(--color-dusty-rose);

  /* States */
  --color-error: #B85B5B;
  --color-success: #7B9A7E;
  --color-warning: #C9954A;
}
```

### Типографіка

```css
:root {
  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace; /* для адмінки */

  /* Type scale (mobile-first) */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.5rem;      /* 24px */
  --text-2xl: 2rem;       /* 32px */
  --text-3xl: 2.75rem;    /* 44px */
  --text-display: 4rem;   /* 64px hero */

  /* Line heights */
  --leading-tight: 1.15;
  --leading-snug: 1.35;
  --leading-relaxed: 1.65;
  --leading-loose: 1.85;

  /* Weights */
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
}
```

### Spacing і layout

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --container-max: 1280px;
  --container-narrow: 880px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### Mood і референси

- **Aesop** — wordmark, product labels, generous whitespace
- **Studio Mondine** — фотографія квітів з природним світлом
- **Le Labo** — typewriter strictness
- **Cereal Magazine** — modern editorial typography
- **Bloom & Wild** (UK) — як можна робити e-commerce у бутік-естетиці

---

## 5. Функціональні вимоги

### 5.1 Каталог і сторінка букета

**Каталог (`/buketu`):**
- 3 осі фільтрів (Type / Flower / Occasion) — multi-select
- Додаткові фільтри: ціна (slider), сезонність, доступність на сьогодні
- Sort: за популярністю / новинки / ціна ↑ / ціна ↓
- Asymmetric grid (різні розміри карток)
- Image hover swap (друге фото при ховер)
- На mobile: tap-to-preview або auto-rotation
- Stagger animation при появі карток (50ms між кожною)
- Sticky-фільтри слева на desktop, bottom-sheet на mobile

**Сторінка букета (`/buket/[slug]`):**
- Галерея зліва — 4–8 фото + 3D photo-sequence (опційно для топ-букетів)
- Sticky панель справа: назва, ціна (з зачеркнутою старою якщо знижка), таймер знижки якщо активна, кнопка «Замовити» → відкриває чат з Лією з контекстом букета
- Склад букета (структуровано), розміри, час підготовки
- Related products
- FAQ-секція (Schema.org FAQPage)
- Breadcrumb (Schema.org)

### 5.2 Чекаут (легкий)

- Однорядкова форма, 6 полів: ім'я отримувача, телефон отримувача, адреса, дата+час слот, телефон замовника, побажання
- Чекбокс «Передати анонімно»
- Опційно: текст листівки
- Без обов'язкової реєстрації (guest checkout)
- Опційно: галочка «зберегти дані для наступного замовлення» (по телефону + одноразовий код у SMS/Telegram)
- Способ оплати: Mono / LiqPay / часткова передоплата % при доставці кур'єру (% налаштовується адмінкою)
- Apply discount (автоматично, якщо для букета активна знижка)

### 5.3 Замовлення

**Статуси (state machine):**

```
Новий → Очікує оплати → Оплачений → У роботі → Передано курʼєру → Доставлено
                    ↓
                Скасовано (термінал)
                    ↓
              Часткова оплата → Зібрано → Передано курʼєру → Оплата при доставці → Доставлено
```

Варвара рухає статуси через адмінку (drag-n-drop kanban або кнопки в детальній картці).

**Збір даних замовлення:**
- Покупець: телефон, ім'я (опційно)
- Отримувач: телефон, ім'я
- Адреса: вулиця, будинок, квартира, поверх, під'їзд, домофон, інструкції кур'єру
- Час: дата + слот
- Букет: ID, склад, ціна, знижка
- Оплата: метод, статус, сума передоплати (якщо часткова), час оплати
- Кур'єр: ким доставляється (Варвара/власний кур'єр), статус кур'єра
- Комунікація: пов'язаний `conversation_id` (якщо замовлення створено через AI-чат)

### 5.4 Адмінка (Payload CMS)

Розділи (custom views):

1. **Дашборд** — нові заказы (потребують уваги), сьогоднішні дотавки, ескалації, утренній дайджест
2. **Замовлення** — kanban + детальна картка
3. **Букети** — каталог з AI-кнопками (фото, текст), знижки
4. **Категорії / Квіти / Приводи** — таксономії
5. **Журнал/Блог** — pipeline статей, контент-план, метрики
6. **Інбокс** — діалоги клієнтів з Лії та Варвари (всі канали в одному місці)
7. **Студія фото** — генератор фото (з нуля / трансформація референса)
8. **Голос бренду** — структурований редактор (компілюється в системний промпт для Лії та для AI-content)
9. **Лія — правила** — структуровані розділи (FAQ, ескалації, заборонені теми, тригери, представлення, відмовлення)
10. **Знижки** — активні знижки, заплановані, історія
11. **Розсилки** — створення, сегментація, відправка, аналітика
12. **Зони доставки** — редактор зон, тарифів, слотів
13. **Графік роботи** — розклад, винятки, святковий режим, аварійний режим
14. **Платежі** — налаштування Mono, LiqPay, % передоплати, ПРРО
15. **Інтеграції** — API-ключі, перемикачі
16. **Аналітика** — server-side analytics (трафік, воронка, AI-метрики)
17. **Юридичне** — редагування юр.документів, прапорці «потребує юриста»
18. **Налаштування бренду** — логотип, кольори, контакти, реквізити, домен
19. **Демо-режим** — управління demo-контентом

### 5.5 AI-Concierge Лія

**Канали:** сайт-чат + Telegram + Viber

**Платформа:** Claude API (Anthropic)
- Модель за замовчуванням: `claude-sonnet-4-6` (баланс ціна/якість для діалогів)
- Для простих відповідей (FAQ-like): `claude-haiku-4-5-20251001` (auto-routing на основі складності)
- Для делікатних кейсів і ескалацій: `claude-opus-4-7` (опційно, якщо потрібна найвища якість)

**Архітектура диалогу:**

```
Користувач шле повідомлення (текст/voice/фото)
  ↓
[Voice processing — якщо voice]
  ↓ Whisper локальний на VPS → текст
  ↓
Conversation Manager:
  - Завантажує історію розмови з БД (за client_id)
  - Завантажує поточний контекст (активні знижки, доступні слоти, заблоковані категорії, статус букетів)
  - Завантажує системний промпт (з розділу «Голос бренду» + «Лія — правила»)
  ↓
Claude API call:
  - system: повний скомпільований промпт
  - messages: попередня історія + поточне повідомлення
  - tools: набір інструментів (див. нижче)
  ↓
Tool execution loop (якщо Claude викликає інструменти):
  - search_bouquets(filters) → список букетів
  - get_delivery_slots(date, zone) → доступні слоти
  - calculate_price(bouquet_id, options, customer_id) → ціна з знижкою
  - create_order(data) → ID замовлення
  - generate_payment_link(order_id, provider) → посилання
  - check_payment_status(payment_id) → статус
  - escalate_to_varvara(reason, urgency) → notification
  - get_brand_disclosure() → текст представлення
  ↓
Response → клієнту в його канал
  ↓
Зберігаємо в БД: повідомлення, відповідь, токени, латенсія
```

**Інструменти (tools), які може викликати Claude:**

| Tool | Призначення |
|---|---|
| `search_bouquets` | Пошук букетів за фільтрами |
| `get_bouquet_details` | Деталі конкретного букета |
| `get_delivery_zones` | Список зон з тарифами |
| `get_delivery_slots` | Доступні слоти на дату |
| `check_today_availability` | Що сьогодні доступно (термінова доставка тощо) |
| `calculate_order_price` | Розрахунок з знижкою + доставкою |
| `create_pending_order` | Створити заказ у статусі «очікує оплати» |
| `generate_payment_link` | Згенерувати Mono/LiqPay посилання |
| `update_order_data` | Оновити дані заказу (адреса, побажання) |
| `escalate_to_varvara` | Передати ескалацію з контекстом |
| `get_active_promotions` | Список активних знижок і промокодів |
| `save_client_preference` | Зберегти преференцію (наприклад, улюблені квіти) |
| `lookup_previous_order` | Знайти попередні заказы клієнта (для real-time повторного адресата) |
| `transcribe_voice` | (внутрішній) — Whisper для voice messages |

**Системний промпт компілюється з:**
- Розділ «Голос бренду» (стиль, заборонені слова, приклади good/bad)
- Розділ «Лія — правила» → представлення → FAQ → ескалації → заборонені теми → тригери
- Поточні бізнес-обмеження (з адмінки)
- Поточні активні знижки і кампанії
- Шаблон повторного адресата
- Disclosure про AI-природу

**Ключові правила:**
- При першому повідомленні в новій сесії — disclosure: *«Вітаю! Я Лія — AI-консультантка Florenza. Допоможу обрати букет та оформити замовлення. Якщо знадобиться особистий контакт — підключу нашу флористку Варвару Олександрівну»*
- На прямий запит «Ти людина?» — завжди чесна відповідь
- При делікатних темах (похорон, поминки) — не намагатися продати, ескалувати з контекстом
- При ескалації — клієнту: *«Передаю розмову флористці Варварі — вона особисто допоможе»*. У адмінці — зміна статусу діалогу + нотифікація Варварі в Telegram
- Голосові — транскрибуємо через Whisper, відповідаємо текстом. При проблемі з розпізнаванням — *«Виникли проблеми з розпізнаванням голосового. Можете коротко написати або повторити?»*

### 5.6 AI-фото pipeline

**Платформа:** Google Gemini API (Vertex AI / AI Studio)
- Модель: Gemini 2.5 Image (Nano Banana)
- Два режими: text-to-image (з нуля) + image-edit (трансформація референса)

**Архітектура промптів:**

```typescript
type FinalPrompt = {
  global_style_prompt: string;  // з адмінки, версіонована
  local_bouquet_prompt: string; // з картки букета
  positive_modifiers: string;   // 'soft daylight, painterly, no glossy retouching'
  negative_prompt: string;      // 'no plastic, no neon, no studio softbox'
  reference_image?: Buffer;     // для image-edit режима
}
```

**Глобальний стилевий промпт за замовчуванням** (Варвара може змінити, версіонується):

```
Editorial florist boutique photography.
Soft diffused daylight, neutral linen / aged plaster / raw wood backgrounds.
Organic shadows, painterly composition, no glossy retouching.
Subtle film grain. Muted palette of cream, sage, deep forest, dusty rose.
Shot on Hasselblad medium format, 80mm lens, shallow depth of field.
Mood reminiscent of Aesop and Studio Mondine.
Negative: no plastic wrapping, no neon, no bright synthetic colors,
no studio softbox lighting, no cheesy stock photo aesthetic.
```

**Workflow в адмінці (Студія фото):**

1. Адмін відкриває картку букета → розділ «Фото»
2. Дві кнопки: «Згенерувати з нуля» / «Перенести у наш стиль» (з референсом)
3. Опційно: додаткові уточнення промпту
4. Generate → отримуємо 4 варіанти за 5–15 сек
5. Адмін обирає → утвердує → стає основним фото
6. Альтернативні варіанти зберігаються для hover image swap
7. **Збережений промпт** прив'язаний до картки → AI-кнопки для текстів використовують цей контекст для генерації описів

**Період калібровки** (перші 1–2 тижні після запуску):
- Варвара генерує 20–30 пробних фото
- Порівнює з референсами (Aesop, Studio Mondine)
- Корегує глобальний промпт через адмінку (раздел «Налаштування бренду» → «AI-фото стиль»)
- Версіонується автоматично

**Зберігання:**
- Оригінал + автоматичні ресайзи (next/image робить сам)
- Папка `/var/www/florenza/media/` на VPS
- Автобекап на Backblaze B2 (free tier 10 ГБ)

### 5.7 AI-content pipeline

**Платформа:** Claude API (для голосової консистентності з Лією)
- Модель: `claude-sonnet-4-6` для длинних текстів, `claude-haiku-4-5` для коротких

**Дві принципово різні моделі:**

#### А) Картки букетів — AI як кнопка-помічник

Дефолт — ручне заповнення. AI-кнопки опційні:
- 🤖 «Запропонувати назву» — у поля «Назва»
- 🤖 «Згенерувати опис» — у поля «Опис»
- 🤖 «Підказати склад» — у поля «Склад»
- 🤖 «SEO-теги» — у meta-полів
- 🤖 «Alt-теги» — у галереї

**Ключова інтеграція:** AI-кнопки використовують `image_generation_context` з картки (промпт яким генерували фото) → текст відповідає тому що видно на фото.

#### B) Блог — повна автоматизація з self-critique

8-крокова pipeline:

1. **Вибір теми** — з черги (ручний список Варвари або AI-генерація на основі сезонності + Google Trends)
2. **Keyword research** — автокомпліт Google + Bing → 10–20 пов'язаних запитів → 1 main + 3–5 secondary keys
3. **SERP-аналіз топ-10 конкурентів** — web-fetch → Claude читає → виявляє підтеми, FAQ, формат
4. **Генерація драфта** — Claude Sonnet 4.6 за шаблоном: intro + 4–6 секцій H2 + FAQ + CTA на каталог. Довжина 1200–1800 слів. Тон з «Голосу бренду»
5. **Self-critique pass** — Claude в ролі SEO-критика, інший промпт, видає список зауважень
6. **Fix pass** — третій прогін з виправленнями
7. **Технічні SEO-перевірки локально** — title, description, H1, density, alt, schema, slug, OG, читабельність Flesch-Kincaid (UA-адаптовано)
8. **Рішення про публікацію** — якщо ≥80% — авто-публікація (якщо адміністратор включив автомат), інакше в драфт

**Post-publication:**
- Через 7/14/30 днів — Google Search Console API підтягує метрики
- AI пропонує апдейти статей з низьким CTR

**Контент-план в адмінці:**
- Кількість статей на день/тиждень — задається Варварою
- Чергa тем (auto + ручний список)
- Календарний вид публікацій
- Ban-list тем
- Перемикач «Автопублікація / Спочатку в драфт»

**Стартові 30 статей** — генеруються до публічного запуску, топ-10 з ручною доводкою Варварою.

### 5.8 Знижки з таймером

**Структура знижки:**

```typescript
type Discount = {
  enabled: boolean;
  type: 'percent' | 'fixed';
  amount: number;
  start_at: Date;
  end_at: Date;
  campaign_name?: string;
  applies_to: { bouquet_ids: string[] } | { category_ids: string[] };
}
```

**В адмінці:**
- Поле «Знижка» в кожній картці букета (індивідуальна знижка)
- Bulk-операція «Створити акцію» — обрати чекбоксами набір букетів + спільні параметри
- Заплановані знижки — створюємо зараз, активуються в потрібну дату
- «Скасувати акцію» — масове відключення

**На сайті:**
- Стара ціна перекреслена, нова — поряд
- Таймер зворотного відліку (днів/годин/хвилин/секунд)
- Лейбл «-20%» або «Акція» на картці
- Schema.org `priceValidUntil` з `end_at`
- Секція «Спеціальні пропозиції» на головній (показ якщо є активні знижки)

**Лія в чаті:**
- Знає всі активні знижки (передається в системному промпті)
- При рекомендації віддає пріоритет букетам зі знижкою (якщо вони підходять запиту)
- Може запропонувати альтернативу: *«Схожий букет [link] зараз зі знижкою 20%»*
- При оформленні автоматично застосовує знижку
- Не тиснe — згадує таймер один раз, не нав'язує

### 5.9 Доставка (вручну, без API кур'єрських сервісів)

**Зони доставки** (редагуються в адмінці):

| Зона | Тариф | Час | Активна |
|---|---|---|---|
| Ірпінь, Буча, Гостомель, Ворзель | 200 грн | 9:00–21:00 | ON |
| Ближній Київ (Святошин, Поділ-захід, Академмістечко) | 350 грн | 10:00–20:00 | ON |
| Дальній Київ (Печерськ, лівий берег) | за домовленістю | за домовленістю | ON (ескалація) |

**Безкоштовна доставка** від 3000 грн заказу + у радіусі 1 км від магазину завжди.

**Слоти:**
- Стандартні 2-годинні: 10–12, 12–14, 14–16, 16–18, 18–20, 20–21
- Термінова доставка: 60–90 хвилин (доплата +150 грн)
- Прийом замовлень на сьогодні до 19:00 (налаштовується)
- Завтра і далі — стандартна сітка

**Курʼєр:**
- Тільки **вручну Варварою**. Жодних API кур'єрських сервісів
- Якщо Варвара хоче викликати Uklon/Bolt/Glovo — робить це руками через мобільний додаток, сайт про це не знає
- В адмінці кнопки статусу: «У роботі» → «Передано курʼєру» → «Доставлено»

**Святковий режим** (в адмінці):
- Шаблон «8 березня» / «14 лютого» / «День матері»: розширені слоти, збільшена ємність, прийом до 23:00 напередодні
- Активується одним кліком за тиждень до свята

**Аварійний режим:**
- Тимчасова повна зупинка прийому — *«На жаль, тимчасово не приймаємо заказы. Залиште номер — повідомимо коли відкриємось»*
- Лія знає і поводиться відповідно

### 5.10 Оплата

**Провайдери:**
- **Monobank Acquiring** — основний (Apple Pay / Google Pay в один тап)
- **LiqPay (ПриватБанк)** — резервний (якщо у клієнта проблеми з Mono)
- **ПРРО Checkbox.ua** — обов'язковий за UA-законом для онлайн-оплат, відправка чеків в Telegram/Viber (не email)

**Сценарії:**
1. **Повна передоплата онлайн** (default) — Лія шле посилання → клієнт оплачує → webhook → заказ переходить у «Оплачений»
2. **Часткова передоплата + доплата при доставці** — % настроюється в адмінці (default 30%, налаштовується). Лія рахує, шле посилання на передоплату, статус заказу `paid_partial`. Курʼєр приймає решту готівкою або карткою
3. **Перемикач у адмінці:** «Дозволено часткову передоплату: ON/OFF» — можна вимкнути цілком

**Архітектура `payments/` модуля:**

```typescript
interface PaymentProvider {
  createIntent(order: Order, amount: number): Promise<PaymentIntent>;
  getStatus(intentId: string): Promise<PaymentStatus>;
  webhook(payload: any): Promise<WebhookResult>;
}

class MonoProvider implements PaymentProvider { ... }
class LiqPayProvider implements PaymentProvider { ... }
```

### 5.11 Інбокс і ескалації

**Усі діалоги з усіх каналів** (сайт-чат, Telegram, Viber) сходяться в один інбокс адмінки.

**Структура діалогу:**
- Усі повідомлення обох сторін (AI Лія + клієнт + Варвара якщо ескалація)
- Канал (telegram/viber/chat)
- Статус: `active` / `escalated` / `closed` / `order_placed`
- Прив'язаний `order_id` (якщо є)
- Теги: `wedding`, `corporate`, `complaint`, `funeral_sensitive`, `vip`, тощо
- Позначка escalation reason

**При ескалації:**
- Алерт Варварі в Telegram (через бот)
- Червона підсвітка в адмінці
- Кнопка «Підключитись до діалогу» — відкриває чат
- Усі попередні повідомлення Лії з клієнтом видно
- Варвара пише — клієнт бачить те ж ім'я «Лія» (бесшовний transfer) + system message *«Тепер з вами Варвара особисто»*

**Кнопка «Покращити промпт»:**
- В будь-якому повідомленні Лії — кнопка «Покращити»
- Варвара виділяє місце де AI помилився, пише «правильна відповідь має бути така»
- Це автоматично потрапляє в FAQ розділу «Лія — правила» як новий пункт
- AI самонавчається через ручний feedback

### 5.12 Re-engagement (мінімальний)

**Тільки 2 автоматичних сценарії:**

1. **Підтвердження отримання (T+4 години після доставки)** — service-touch
   *«Ваш букет вже у одержувача. Сподіваюсь, [Ім'я] усміхнулась 🤍 Чи все було добре з нашого боку?»*

2. **Real-time повторний адресат** — у чаті при оформленні нового заказу:
   *«Я бачу, букет знову для [Світлани] на ту ж адресу. Повторити минулорічний склад чи щось нове?»*

**Усі інші — вручну Варварою через адмінку (Розсилки):**

- Створення розсилки: текст з AI-помічником, сегментація бази, розклад, прев'ю
- Frequency cap: 1 розсилка на клієнта на 30 днів + не більше 4 на рік (hard limits)
- Команда `/stop` в Telegram/Viber → blacklist
- Аналітика: доставлено / прочитано / відписки / замовлення з розсилки за 7 днів

### 5.13 Особливі секції

**Весільна флористика (`/vesilna-floristyka`):**
- Editorial-сторінка зі сторітелінгом
- Форма брифа: дата, локація, стиль (drag-n-drop фото референсів — до 5), розмір весілля, бюджет, що потрібно (букет нареченої, бутоньєрки, арка, композиції, etc.)
- Опційно: «Реальні весілля» секція з 3–5 кейсами
- Лія в чаті при ключовому слові «весілля» — автоматично ескалує до Варвари з міткою `wedding`
- SEO: `весільна флористика Ірпінь`, `букет нареченої Буча`

**Корпоративна флористика (`/korporatyvna-floristyka`):**
- B2B-tone, кейси
- Послуги: разове оформлення, тижневі підписки в офіс, VIP-букети для клієнтів, відкриття магазину, корпоративні подарунки
- Форма запиту: компанія, контакт, тип послуги, регулярність, орієнтовний бюджет
- Лія завжди ескалує до Варвари (B2B = особистий контакт)
- SEO: `корпоративні квіти Ірпінь`, `оформлення офісу квітами`

---

## 6. Список вау-ефектів (mobile-first)

### Глобальні

- **Lenis smooth scroll** (з mobile-mode) — обов'язково
- **Кастомний курсор «лепестка»** — desktop only, mobile отримує **tap-ripple effect**
- **Page transitions** — fade + slight blur, mobile 200ms / desktop 300ms
- **Scroll-reveal на секціях** — slide-up + fade, IntersectionObserver
- **Magnetic buttons** на головних CTA — desktop magnetic-pull, mobile press-and-hold з haptic vibration

### Головна

- **Editorial hero з parallax** — desktop mouse-parallax, mobile scroll-velocity parallax
- **Animated text reveal** — заголовок появляється по словах з blur-to-clear
- **Marquee відгуків** — swipe-to-pause на mobile, hover-pause на desktop
- **Секція «Спеціальні пропозиції»** — показ тільки якщо є активні знижки

### Каталог

- **Image hover swap** — desktop hover, mobile tap-to-preview або auto-rotation
- **Asymmetric grid soft-stagger** — 50ms між картками
- **Sticky filters** — desktop ліва колонка, mobile bottom-sheet (свайп вгору)
- **Pull-to-refresh** на mobile — оновлює featured-секцію

### Сторінка букета

- **3D photo-sequence rotation** — 8–12 фото з різних кутів (генеруються Gemini), mobile swipe-жест, desktop drag
- **Sticky info panel справа** — desktop, mobile fixed bottom CTA
- **Smooth gallery з zoom on hover** — desktop, mobile pinch-zoom
- **Floating CTA** — sticky внизу-справа на mobile при скролі

### About

- **Scroll-driven storytelling** — desktop long-scroll з parallax-секціями, mobile **vertical-snap-scroll** (свайп між сторінками)

### Анти-патерни (НЕ робимо)

- ❌ WebGL-фон на hero
- ❌ Image trails при курсорі
- ❌ Particle-ефекти лепестків
- ❌ Кінетична типографіка
- ❌ Preloader (використовуємо skeleton-screens)
- ❌ Push-сповіщення в браузері
- ❌ Hover-відео на mobile (трафік)

### Performance budget (hard rule)

- Lighthouse Performance Mobile **≥85**
- FCP < 1.5s на 4G
- LCP < 2.5s на 4G
- TBT < 200ms
- CLS < 0.1
- JS bundle < 150 KB gzipped на критичних сторінках
- `prefers-reduced-motion` респектується

---

## 7. Каталог і контент-модель

### Колекції Payload CMS

**`bouquets`:**
```typescript
{
  id, slug, name, name_uk,
  description_short, description_full,
  composition: [{ flower, count, sort? }],
  price, currency,
  discount: { enabled, type, amount, start_at, end_at, campaign_name },
  primary_image, gallery: [...], image_generation_context,
  type_id, flower_main_id, occasions_ids: [...],
  size: { height_cm, diameter_cm, t_shirt_size: 'S'|'M'|'L' },
  seasonality: { available_from?, available_to?, year_round: boolean },
  emotional_tone: ['gentle','bold','classic'],
  for_whom: 'female'|'male'|'neutral',
  preparation_hours: number,
  meta_title, meta_description, og_image,
  status: 'draft' | 'published' | 'hidden' | 'sold_out',
  is_demo: boolean,
  created_at, updated_at, published_at
}
```

**`categories_type`** — Авторські, Монобукети, Композиції, Весільна, Корпоративна, Подарунки
**`flowers`** — Троянди, Півонії, Хризантеми, Тюльпани, Гортензії, Лілеї, Орхідеї, Сезонні, Сухоцвіти, Польові
**`occasions`** — День народження, 8 березня, 14 лютого, Народження дитини, Річниця, Випускний, Корпоративні, Без приводу

**`orders`** — повна картка заказа з усіма прив'язками
**`customers`** — клієнти (по телефону як ID), історія заказів
**`conversations`** — діалоги з усіх каналів
**`messages`** — індивідуальні повідомлення
**`delivery_zones`** — редаговані зони
**`delivery_slots`** — розклад слотів
**`payment_settings`** — % передоплати, перемикачі
**`brand_voice`** — структурований редактор «Голосу бренду»
**`liya_rules`** — структуровані розділи правил Лії
**`prompts_versions`** — версіонування промптів
**`blog_posts`** — статті блогу
**`blog_pipeline`** — черга тем, налаштування генерації
**`seo_pages`** — програмні сторінки
**`broadcasts`** — розсилки
**`broadcast_recipients`** — хто отримав розсилку
**`client_blacklist`** — відписані клієнти
**`re_engagement_log`** — лог автоматичних дотиків
**`escalations`** — лог ескалацій з контекстом
**`media`** — фото
**`legal_documents`** — юр.сторінки з прапорцем `requires_lawyer_review`
**`settings`** — глобальні налаштування бренду
**`analytics_events`** — server-side analytics
**`users`** — адмін-користувачі

---

## 8. Інтеграції

| Сервіс | Призначення | Платно/Безкоштовно |
|---|---|---|
| **Anthropic Claude API** | AI-Concierge Лія + AI-content | Платно за токени, ~$5–20/міс |
| **Google Gemini API** | AI-фото генерація і трансформація | Платно за токени, ~$5–10/міс |
| **Whisper (open source)** | Транскрибація голосових | Безкоштовно (локально на VPS) |
| **Telegram Bot API** | Telegram-бот Лії | Безкоштовно |
| **Viber Bot API** | Viber-бот Лії | Безкоштовно |
| **Monobank Acquiring** | Основна оплата | 1.4–2% з продажів |
| **LiqPay (ПриватБанк)** | Резервна оплата | 2.75% з продажів |
| **Checkbox.ua (ПРРО)** | Фіскальні чеки в Telegram/Viber | ~250–500 грн/міс |
| **Google Search Console** | SEO-метрики, sitemap | Безкоштовно |
| **Google Trends API** | Тренди для блогу | Безкоштовно |
| **Google Maps Embed** | Карта на /contacts | Безкоштовно до 28k показів/міс |
| **Google Business Profile** | LocalBusiness × 3 (ИБГ) | Безкоштовно |
| **Backblaze B2** | Бекапи | Безкоштовно до 10 ГБ |

**Усього платні API:** Claude + Gemini = ~$10–30/міс залежно від обсягу.

**НЕ використовуємо:**
- ❌ Email (Resend / SendGrid / Mailchimp)
- ❌ Instagram API
- ❌ Facebook Pixel / Google Ads tags
- ❌ GA4 / Plausible / Hotjar
- ❌ Cookie banner (тому що немає third-party tracking)
- ❌ DataForSEO / Ahrefs / Semrush (Phase 2 опційно)

---

## 9. SEO і локальний пошук

### Технічна база (Phase 1)

- **Schema.org розмітка:**
  - `LocalBusiness` × 3 (Ірпінь, Буча, Гостомель) на головній і контактах
  - `Product` на кожному букеті (з `priceValidUntil` для знижок)
  - `FAQPage` на категорійних і блог-сторінках
  - `Article` на блог-постах
  - `BreadcrumbList` на всіх внутрішніх сторінках
  - `Review` на сторінках з відгуками
- **Sitemap.xml** — auto-генерація з усіх категорій, букетів, статей, гео-сторінок
- **Robots.txt** — стандартний для e-commerce
- **Hreflang** — `uk` only, готовність під `en`
- **Open Graph** — динамічні OG-фото (через `@vercel/og` або власна генерація)
- **Canonical URLs** — для всіх сторінок
- **404 та 410 статуси** — правильні

### Контентна стратегія

**Локальні гео-сторінки:**
- `/dostavka-kvitiv-irpin`
- `/dostavka-kvitiv-bucha`
- `/dostavka-kvitiv-hostomel`

Кожна — унікальний контент (~800–1200 слів), локальні відгуки, карта зони, FAQ.

**Категорійні сторінки** (за всіма 3 осями):
- `/buketu/avtorski`, `/buketu/monobukety`, `/buketu/kompozytsiyi-v-korobtsi`...
- `/buketu/troyandy`, `/buketu/pivonii`, `/buketu/khryzantemy`...
- `/buketu/na-den-narodzhennya`, `/buketu/na-8-bereznya`, `/buketu/na-vesillya`...

Кожна — H1, editorial-опис (~200–300 слів), список товарів, FAQ-блок.

**Програмні комбінаційні (Phase 1 ~10 топ-сторінок):**
- `/buketu/pivonii-na-den-narodzhennya`
- `/buketu/troyandy-na-14-lyutogo`
- `/buketu/avtorski-z-troyandamy`
- `/buketu/pivonii-irpin`
- ...

Шаблон один, контент унікальний (генерується AI з ручною доводкою).

**Phase 2** — розширення програмних сторінок до сотень.

### Блог

- 30 стартових статей до публічного запуску
- Темa автогенерація 1 стаття на день (налаштовується)
- 8-крокова pipeline з self-critique
- Post-publication monitoring через Search Console

### Google Business Profile

- Створити **3 листинги:** Ірпінь (фізична адреса), Буча (зона обслуговування), Гостомель (зона обслуговування)
- Підтвердження поштою (~1–2 тижні) — **ЗАПУСКАЄТЬСЯ ДО ПОЧАТКУ РОЗРОБКИ**
- На сайті — інтеграція з GBP API для автоматичного pull відгуків

---

## 10. Продуктивність і адаптивність

### Core Web Vitals targets

| Метрика | Mobile | Desktop |
|---|---|---|
| LCP | < 2.5s | < 1.5s |
| FID | < 100ms | < 50ms |
| CLS | < 0.1 | < 0.1 |
| TBT | < 200ms | < 100ms |
| FCP | < 1.5s | < 1.0s |
| Lighthouse Performance | ≥ 85 | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 | ≥ 95 |
| Lighthouse SEO | ≥ 95 | ≥ 95 |
| Lighthouse Best Practices | ≥ 90 | ≥ 90 |

### Оптимізації

- **Next.js Image** з `priority` для hero, `lazy` + blur placeholder для решти
- **Дві стратегії рендеру:**
  - Static Generation (SSG) для категорій, блогу, гео-сторінок
  - Server Components для динамічних (каталог з фільтрами, картка букета з актуальною знижкою)
  - ISR (Incremental Static Regeneration) для блог-постів — revalidate 1 час
- **CDN-кешування:** Vultr CDN або Cloudflare безкоштовно
- **Critical CSS inline** — для першого екрану
- **Code splitting** — кожна сторінка окремий бандл
- **Tree shaking, minification** — Next.js робить за замовчуванням
- **Font loading** — `font-display: swap`, preload основних
- **Service Worker** — кеш статичних ресурсів (опційно)

### Mobile-first

- Усі компоненти проектуються mobile-first з прогресивним enhancement для desktop
- Touch-таргети ≥48px
- `prefers-reduced-motion` — анімації вимикаються
- `prefers-color-scheme: dark` — підтримка опційно (Phase 2)

---

## 11. Технічний стек (фінальний)

### Frontend

```json
{
  "next": "15.x (App Router)",
  "react": "19.x",
  "typescript": "5.x",
  "tailwindcss": "4.x",
  "shadcn/ui": "latest",
  "@magicui/components": "latest",
  "framer-motion": "11.x",
  "@studio-freight/lenis": "1.x",
  "@use-gesture/react": "10.x",
  "lucide-react": "latest"
}
```

### Backend / CMS

```json
{
  "payload": "3.x",
  "@payloadcms/db-postgres": "3.x",
  "drizzle-orm": "latest",
  "next-intl": "3.x"
}
```

### AI

```json
{
  "@anthropic-ai/sdk": "0.30.x — для Лії та AI-content",
  "@google/generative-ai": "latest — для Gemini Image",
  "openai-whisper": "локальний бінарь на VPS"
}
```

### Інфраструктура

- **VPS:** Vultr Cloud Compute (2 vCPU / 4 ГБ RAM / 80 ГБ SSD), регіон Frankfurt
- **OS:** Ubuntu 24 LTS
- **Контейнеризація:** Docker + docker-compose
- **Reverse proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot, авто-оновлення)
- **БД:** PostgreSQL 16 (Docker)
- **Process manager:** PM2 або systemd
- **Бекапи:** rsync + Backblaze B2 (10 ГБ free) або rclone до Google Drive
- **Моніторинг:** UptimeRobot (free tier) + Pino logging локально
- **CI/CD:** GitHub Actions → SSH deploy до VPS
- **Домен:** GoDaddy `florenza-irpin.com` (попередньо)

### Інтеграції з мессенджерами

- **Telegram:** `node-telegram-bot-api` (через webhook)
- **Viber:** `viber-bot` (через webhook)
- **Сайт-чат:** WebSocket через Server-Sent Events або Pusher (free tier)

---

## 12. MCP-інструменти для встановлення в Claude Code

На етапі розробки використовуються наступні MCP-сервери:

```bash
# Базові
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp
claude mcp add magicui -- npx -y @magicuidesign/mcp@latest
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest

# Скіл
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Перевірка:** `/mcp` всередині Claude Code → всі мають статус `connected`.

**Призначення кожного:**
- **shadcn MCP** — автоматичне додавання shadcn-компонентів
- **Magic UI MCP** — анімовані блоки (marquee, scroll effects, beams)
- **Chrome DevTools MCP** — Claude бачить свій результат і ітерує (must-have)
- **context7 MCP** — актуальна документація Next.js, Tailwind, Framer Motion
- **UI/UX Pro Max skill** — генерація дизайн-системи

---

## 13. Готовий `CLAUDE.md` для проєкту

Дивись окремий файл `CLAUDE.md` у цьому архіві.

---

## 14. Стартовий промпт для Claude Code

Дивись окремий файл `STARTUP_PROMPT.md` у цьому архіві.

---

## 15. Етапи і Definition of Done

### Етап 1: Фундамент (тиждень 1)

**DoD:**
- ✅ VPS Vultr розгорнуто, Ubuntu 24 LTS, Docker, Nginx, SSL
- ✅ Домен `florenza-irpin.com` (або фінальний) приєднано, SSL активний
- ✅ Next.js 15 + Payload CMS 3.x + Postgres розгорнуто
- ✅ Базові колекції створені (bouquets, orders, customers, conversations, ...)
- ✅ Demo seed виконано (30 букетів, 5 кейсів, 8 відгуків, 30 статей блогу)
- ✅ Telegram + Viber боти зареєстровані і отримують повідомлення
- ✅ Базовий AI-Concierge Лія відповідає на тестові повідомлення
- ✅ Mono Acquiring і LiqPay підключені (тест-режим)
- ✅ ПРРО Checkbox.ua активний
- ✅ Тестовий заказ можна оформити і оплатити end-to-end

### Етап 2: Бренд і дизайн (тиждень 2)

**DoD:**
- ✅ Логотип Florenza згенеровано і утверджено (через `LOGO_BRIEF.md`)
- ✅ UI/UX Pro Max згенерувала дизайн-систему, токени застосовано
- ✅ Усі сторінки візуально оформлені згідно palette/typography
- ✅ Базові вау-ефекти працюють (Lenis, page transitions, magnetic buttons, кастомний курсор)
- ✅ Mobile-first responsive перевірено через Chrome DevTools MCP на iPhone 14, iPad, desktop
- ✅ Lighthouse Performance Mobile ≥85 на головній

### Етап 3: AI і функціональність (тиждень 3)

**DoD:**
- ✅ AI-фото pipeline працює (Gemini), Студія фото в адмінці функціональна
- ✅ AI-content кнопки в картках букетів
- ✅ Блог-pipeline 8-крокова, 30 статей згенеровано і ревьюнуто
- ✅ Лія повноцінно обробляє замовлення (всі tools реалізовані)
- ✅ Voice messages транскрибуються через Whisper
- ✅ Інбокс діалогів в адмінці
- ✅ Знижки з таймером працюють
- ✅ Розсилки через адмінку
- ✅ Server-side analytics в адмінці

### Етап 4: Юридика і фінал (тиждень 4)

**DoD:**
- ✅ Юр.документи згенеровані AI-драфти
- ✅ Юрист перевірив, фінальні версії в адмінці
- ✅ Trademark check виконано
- ✅ Google Business Profile верифіковано (×3)
- ✅ Google Search Console підключено, sitemap submited
- ✅ Pre-launch checklist пройдено повністю
- ✅ Усі автоматичні дотики (re-engagement) працюють
- ✅ Performance Mobile ≥85 на всіх ключових сторінках
- ✅ Публічний анонс: сайт запущено

### Етап 5: Phase 2 (місяць 2–3, після запуску)

- Розширені програмні SEO-сторінки
- Майстер-класи (опційно)
- Підписки на квіти (опційно)
- DataForSEO (опційно, якщо інвестиція в SEO)
- Аналіз метрик і ітеративні поліпшення

---

## Final Checklist для готовності ТЗ

✅ Бренд: Florenza, ФОП Каракой Варвара Олександрівна, Ірпінь
✅ Стек: Next.js 15 + Payload CMS + Postgres + Vultr VPS
✅ AI: Claude (Лія + content) + Gemini (фото) + Whisper (voice)
✅ Канали: сайт-чат + Telegram + Viber (без email, без Instagram)
✅ Оплата: Mono + LiqPay + ПРРО, % передоплати настроюється
✅ Доставка: вручну, без API курʼєрів
✅ Каталог: 3 осі (Тип × Квітка × Привід), демо 30 букетів
✅ SEO: Phase 1 + 2 одночасно, 30 статей на старт
✅ Особливі секції: весільна + корпоративна + блог
✅ Юридика: AI-драфти + юрист, Trademark
✅ Лояльність: тільки знижки з таймером
✅ Re-engagement: 2 авто + ручні розсилки
✅ Mobile-first вау-ефекти, Lighthouse ≥85
✅ Без cookie banner, без email, без third-party tracking

---

**Передача:** Цей документ + `CLAUDE.md` + `STARTUP_PROMPT.md` + `LOGO_BRIEF.md` + усі допоміжні `.md`-файли йдуть в новий проєкт. Claude Code читає `STARTUP_PROMPT.md` і починає реалізацію згідно цього ТЗ.
