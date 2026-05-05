# ТЗ для архітектора: непрацюючі CTA-кнопки + Telegram-флоу

> **Кому:** агент-архітектор, який проєктував Florenza
> **Від:** користувач (через Claude Code)
> **Дата:** 2026-05-05
> **Що треба:** детальний план реалізації (що, як, в якому порядку, які файли). Код **поки не пиши** — потрібен лише план, який далі будемо виконувати поетапно.

---

## 1. Контекст проєкту (нагадування)

- Next.js 15 App Router + TypeScript + React 19
- Payload CMS 3 (вбудована в Next.js, single repo), Postgres 16
- AI: Claude (Лія + content), Gemini (фото), Whisper (voice on VPS)
- Канали: web-chat, Telegram, Viber. **Без email** (заборонено по архітектурі)
- Платежі: Mono (primary), LiqPay (fallback), Checkbox.ua (ПРРО)
- Mobile-first, editorial estetic (Aesop × Studio Mondine)
- В розробці локально: `localhost:3000` + Docker Postgres на 5433

**Ключова архітектурна ідея, яку треба підтвердити/уточнити:**
В коді є повний AI-tool-stack у `lib/ai/tools/` — Лія вміє створювати замовлення, генерувати лінки на оплату Mono, розраховувати ціну, пропонувати слоти доставки тощо. Сторінки `/checkout` **не існує**. Схоже, задум був: **усі замовлення йдуть через діалог з Лією** (web-chat / Telegram / Viber), а не через класичну форму checkout. Треба підтвердити чи це справді так — або це недороблений шматок.

---

## 2. Що зламано (виявлено сьогодні)

### 2.1. Кнопка «Замовити» → 404

Кнопка веде на маршрут `/checkout?bouquet=<slug>`, але **сторінки `/checkout` не існує** в `app/(public)/`.

**Місця в коді:**
- `components/florenza/BouquetOfTheDay.tsx:98` — `<MagneticButton href={\`/checkout?bouquet=${bouquet.slug}\`} variant="primary">Замовити сьогодні</MagneticButton>`
- `app/(public)/buket/[slug]/page.tsx:143` — те саме на сторінці окремого букета
- `components/florenza/Header.tsx:79-82` — у хедері є кнопка «Замовити →», але вона веде на `/buketu` (каталог), що нормально

### 2.2. Кнопка «Запитати в чаті» → нікуди

Кнопка веде на якір `#liya`, але **жодного елемента з `id="liya"`** у застосунку немає. Чат живе в компоненті `LiyaChatLauncher.tsx` із локальним `useState({open})`, до якого ззовні достукатися ніяк (ні через подію, ні через store, ні через ref).

**Місце в коді:**
- `app/(public)/buket/[slug]/page.tsx:146` — `<MagneticButton href="#liya" variant="outline">Запитати в чаті</MagneticButton>`
- `components/florenza/LiyaChatLauncher.tsx` — захардкоджений floating-launcher із локальним state `[open, setOpen]`. Жодного API «відкрий мене з контекстом букета».

### 2.3. Telegram-бот не отримує повідомлень у dev

- `getMe` ✅ — бот живий: `@FLORENZA_irpin_bot` (id 8608606690)
- `getWebhookInfo` — webhook URL **порожній**. Це очікувано в локалці, бо Telegram не може достукатись до `localhost`. Webhook ставиться лише після деплою на VPS на публічний `https://florenza-irpin.com/api/webhook/telegram`.
- Питання до архітектора: чи треба передбачити dev-режим (наприклад, через ngrok/cloudflared tunnel + скрипт `pnpm tg:dev`), чи приймаємо що Telegram тестується **лише на staging/prod**?

---

## 3. Що вже існує і що можна перевикористати

### Backend / API
- `app/api/chat/route.ts` — endpoint web-chat → `handleIncomingMessage({channel: 'web_chat', externalId: sessionId, ...})`. Працює.
- `app/api/webhook/telegram/route.ts` — повноцінний обробник Telegram-апдейтів: текст, voice (через Whisper), `/stop` команда, передача в `handleIncomingMessage({channel: 'telegram', ...})`. Готовий до підняття вебхука.
- `app/api/webhook/mono/route.ts` — повноцінний обробник Mono callback: верифікація підпису, перевід Order в статус `paid`/`paid_partial`/`cancelled`, виписка фіскального чека через Checkbox, алерт Варварі через `admin-notify`.

### AI tools (lib/ai/tools/)
- `search-bouquets.ts`
- `get-bouquet-details.ts`
- `calculate-order-price.ts`
- `check-today-availability.ts`
- `get-delivery-zones.ts`
- `get-delivery-slots.ts`
- `get-active-promotions.ts`
- `create-pending-order.ts` — створює Order у Payload зі статусом pending
- `generate-payment-link.ts` — генерує Mono-посилання
- `escalate-to-varvara.ts` — ескалація на Варвару (Telegram-алерт)
- `lookup-previous-order.ts`, `save-client-preference.ts`

### Колекція Orders (payload/collections/Orders.ts)
Повна структура:
- `orderNumber`, `status` (select), `bouquet` (relation), `bouquetSnapshot` (json snapshot)
- extras (array), subtotal, discountAmount, deliveryFee, totalAmount
- buyer (name, phone), recipient (name, phone), `isAnonymous`
- delivery (zone, address, date, slot, isUrgent + surcharge)
- cardMessage (текст листівки)
- payment (provider, intentId, link, paidAmount, remainingAmount, paidAt)
- fiscalReceipt (url, id)
- conversation (relation на Conversations)
- createdBy (select: liya / admin / api)
- isDemo

### Frontend компоненти
- `components/florenza/LiyaChat.tsx` — UI чата (вікно). Має `getOrCreateSessionId()` через localStorage, `messages` state, `send()`. **Не приймає initial-message prop, не має API додати system-context "Користувач з картки букета X".**
- `components/florenza/LiyaChatLauncher.tsx` — floating-launcher (FAB справа знизу). Має локальний `[open, setOpen]`. **Не експортує метод/event, нічого глобального.**
- `components/florenza/MessengerOrder.tsx` — окремі кнопки «Замовити в Telegram» / «Замовити в Viber» з прямими лінками. Це інший компонент, не плутати.
- `components/florenza/MagneticButton.tsx` — універсальна кнопка-обгортка з href; рендериться як `<a>` коли є href.

---

## 4. Що від тебе потрібно (питання + детальний план)

### 4.1. Архітектурні рішення (підтвердь або скоригуй)

1. **«Замовити» з картки букета** — як має працювати?
   - **Варіант A:** Відкривається LiyaChatLauncher з префілом «Хочу замовити [Назва букета]» → діалог із Лією → вона збирає адресу/слот/телефон через tools → створює Order → видає лінк на Mono. (Узгоджено з існуючим tool-стеком.)
   - **Варіант B:** Окрема сторінка `/checkout?bouquet=<slug>` з повноцінною формою (адреса, слот, оплата). Лія — додатковий канал, не основний.
   - **Варіант C:** Гібрид — на mobile завжди чат, на desktop — checkout-сторінка з можливістю «спитати в чаті».
   - **Варіант D:** Інше — підкажи.

2. **«Запитати в чаті»** — підтверджуємо, що це просто відкриває LiyaChatLauncher (можливо з префілом контексту «Дивлюсь букет [Назва], маю питання»)?

3. **Як прокидувати контекст букета в чат?**
   - Глобальна подія `window.dispatchEvent(new CustomEvent('liya:open', {detail: {bouquetSlug, intent: 'order'|'question'}}))` + listener у `LiyaChatLauncher`?
   - Zustand-стор?
   - URL-хеш `#liya?bouquet=<slug>&intent=order` + парсер у Launcher?
   - Що чистіше з точки зору архітектури проєкту?

4. **Стейт чата при префілі** — чи треба:
   - Авто-надіслати першу системну/user-репліку з контекстом букета? Чи тільки додати її як "system context" у sessionMemory і дати користувачу самому почати?
   - Що Лія має побачити у своєму system-prompt-builder (`lib/ai/system-prompt-builder.ts`) для цього випадку?

5. **Telegram у dev-режимі** — підтверди підхід:
   - Залишаємо як є (тестується лише на VPS після деплою) — і у відповідному README прописати команди для встановлення webhook.
   - Або додаємо `pnpm tg:dev` зі скриптом, що піднімає cloudflared/ngrok tunnel і автоматом виставляє `setWebhook` на тимчасовий URL.

6. **Header-кнопка «Замовити →»** — зараз веде на каталог `/buketu`. Лишаємо так, чи теж перевести на «відкрий чат»?

### 4.2. Детальний план — що від тебе чекаю

Коли ухвалиш рішення по 4.1, потрібен план у такому форматі:

```
ЕТАП 1: <назва>
  Файли:
    - <шлях>:<що зробити>
    - <шлях>:<що зробити>
  Залежності: <які компоненти/lib треба змінити перед цим>
  Готово коли: <вимірний критерій>

ЕТАП 2: ...
```

З покриттям:
- Як саме реалізуємо префіл контексту в чат (інтерфейс `LiyaChatLauncher`, події/store)
- Які зміни потрібні в `system-prompt-builder.ts` / `conversation-manager.ts` щоб Лія розуміла "користувач прийшов з картки букета X"
- Чи треба додавати поле в `Conversations` колекцію (наприклад `entryContext: { bouquetSlug, source: 'web_card' }`)?
- Чи потрібно правити `app/(public)/buket/[slug]/page.tsx` (замість `<MagneticButton href>` зробити клієнтський компонент-обгортку, що тригерить подію)?
- Які тести (Playwright/unit) додати, щоб ці кнопки не зламались знову
- Definition of Done для кожного етапу (перевірка через Chrome DevTools MCP — це проєктна вимога)

### 4.3. Окремо — Telegram

- Покроковий чекліст для першого запуску webhook на staging/prod (CURL команди setWebhook, dropPendingUpdates, getWebhookInfo)
- Чи треба додавати інтеграційний тест (mock Telegram update → перевірка створення Conversation/Message в Payload)?
- Де логується `[telegram webhook] error` — підказка для дебагу на VPS

---

## 5. Constraints (нагадування — щоб план не суперечив)

- **Mobile-first** для всіх рішень. Будь-який нюанс інтеракції (відкриття чата, форма checkout) — спочатку проектуємо для тачскрину.
- **Без email**, **без cookie banner**, **без third-party tracking** — навіть у новій логіці не пропонуй (Resend, Mailchimp, GA4 тощо).
- **Schema.org розмітка** — на новій checkout-сторінці (якщо буде) має бути `Order` / `BuyAction` микро-розмітка де релевантно.
- **Lighthouse Mobile ≥85** — план має враховувати, що нові клієнтські компоненти не мають перевищувати JS-budget.
- **Файли максимум 300 рядків** — якщо `LiyaChatLauncher` стає товстим, ділимо.
- **Server Components за замовчуванням**, `'use client'` — лише де потрібна інтерактивність.

---

## 6. Що зробить виконавець (Claude Code) після твого плану

1. Read план повністю → перепитає, якщо щось неоднозначне.
2. Пройдеться по етапах послідовно, після кожного — `pnpm lint`, `pnpm typecheck`, скріншот через Chrome DevTools MCP.
3. Після всього — Playwright-тест на «клік Замовити з картки → відкривається чат → видно префіл-контекст».
4. Telegram webhook — тільки документація + скрипт, реальний `setWebhook` робимо після деплою на VPS.

---

**Дякую. Чекаю плану.**
