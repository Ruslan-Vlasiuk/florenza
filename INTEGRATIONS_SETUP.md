# Florenza — Integrations Setup Guide

> **Покрокове налаштування всіх зовнішніх інтеграцій.** Виконується підрядником або Варварою з підрядником разом під час розгортання.

---

## Список інтеграцій

| # | Сервіс | Призначення | Час налаштування | Бюджет |
|---|---|---|---|---|
| 1 | Anthropic Claude API | Лія + AI-content | 30 хв | $5–20/міс |
| 2 | Google Gemini API | AI-фото | 15 хв | $5–10/міс |
| 3 | Telegram Bot | Канал Лії | 10 хв | Безкоштовно |
| 4 | Viber Bot | Канал Лії | 1 день (модерація) | Безкоштовно |
| 5 | Monobank Acquiring | Оплата | 1–2 тижні | 1.4–2% |
| 6 | LiqPay | Резервна оплата | 1–3 дні | 2.75% |
| 7 | Checkbox.ua ПРРО | Фіскальні чеки | 1–2 дні | 250–500 грн/міс |
| 8 | Google Search Console | SEO-моніторинг | 1 год | Безкоштовно |
| 9 | Google Business Profile | Локальне SEO | 7–14 днів | Безкоштовно |
| 10 | Google Maps Embed | Карта на /contacts | 5 хв | Безкоштовно (до 28k показів/міс) |
| 11 | Backblaze B2 | Бекапи | 30 хв | Безкоштовно до 10 GB |
| 12 | UptimeRobot | Моніторинг | 15 хв | Безкоштовно |

---

## 1. Anthropic Claude API

### Що отримуємо

Доступ до моделей Claude для AI-Concierge Лії та AI-content.

### Кроки

1. Перейти на https://console.anthropic.com
2. Зареєструватися (Google Sign-in або email + пароль)
3. Підтвердити email
4. **Settings → Billing** → додати картку, поповнити баланс на $20–50
5. **Settings → Workspaces** → переконатися що workspace `Default` створений
6. **API Keys** → «Create Key»:
   - Name: `florenza-production`
   - Workspace: `Default`
   - Зберегти ключ (виглядає як `sk-ant-...`)
7. Додати в `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

### Налаштування лімітів (рекомендовано)

В Anthropic Console → **Limits**:
- Daily spend limit: $5/день (страхування від нескінченних циклів)
- Monthly spend limit: $50/міс

### Тест

```bash
curl -X POST "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Привіт! Скажи коротке привітання."}]
  }'
```

Має повернути JSON з відповіддю.

### Models які використовуємо

| Модель | Ім'я в API | Призначення |
|---|---|---|
| Haiku 4.5 | `claude-haiku-4-5-20251001` | Прості діалоги, FAQ |
| Sonnet 4.6 | `claude-sonnet-4-6` | Стандартні діалоги Лії, AI-content |
| Opus 4.7 | `claude-opus-4-7` | Складні кейси, делікатні теми |

Auto-routing у `lib/ai/router.ts`.

---

## 2. Google Gemini API

### Що отримуємо

Доступ до Gemini 2.5 Image (Nano Banana) для генерації і редагування фото.

### Кроки

1. Перейти на https://aistudio.google.com
2. Увійти через Google-акаунт (рекомендую окремий бізнес-акаунт)
3. https://aistudio.google.com/apikey → «Create API key»
4. Обрати: «Create API key in new project» (назва: `florenza`)
5. Скопіювати ключ
6. Додати в `.env`:
   ```
   GEMINI_API_KEY=...
   ```

### Перевірка квоти

https://aistudio.google.com/apikey → твій ключ → Usage:
- Free tier: 1500 запитів/день для Gemini 2.5 Flash
- Paid tier: автоматично активується після перевищення

### Тест

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Опиши в одному реченні квітку півонію"}]
    }]
  }'
```

---

## 3. Telegram Bot

### Кроки

1. У Telegram знайти **@BotFather**
2. `/newbot`
3. Bot name: `Florenza | Бутік квітів`
4. Username: `@florenza_bot` (або `@florenza_irpin_bot` якщо зайнятий)
5. Зберегти **HTTP API Token** (виглядає як `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
6. Налаштувати бота через @BotFather:

```
/setdescription
@florenza_bot
AI-консультантка Florenza. Допоможу обрати букет та оформити 
замовлення з доставкою по Ірпеню, Бучі, Гостомелю.

/setabouttext
@florenza_bot
Преміум флористика. AI-консультантка 24/7. Доставка ИБГ + Київ.

/setuserpic
@florenza_bot
[завантажити монограму F з логотипа]

/setcommands
@florenza_bot
start - Почати спілкування з Лією
katalog - Подивитися каталог букетів
dostavka - Дізнатися про доставку
oplata - Способи оплати
stop - Відписатися від розсилок
help - Допомога
```

7. Налаштувати webhook після розгортання VPS:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://florenza-irpin.com/api/webhook/telegram?secret=$TELEGRAM_WEBHOOK_SECRET"
```

8. Додати в `.env`:
```
TELEGRAM_BOT_TOKEN=123456:ABC-...
TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 32)
TELEGRAM_BOT_USERNAME=florenza_bot
```

### Тест

Відкрий @florenza_bot в Telegram, надіслі `/start` — Лія має відповісти.

---

## 4. Viber Bot

### Кроки

1. https://partners.viber.com → Sign up (Business account)
2. Submit для верифікації (1 день)
3. Після верифікації — Create Public Account:
   - Name: `Florenza`
   - Category: Shopping & Lifestyle
   - Description, address, contact info
4. Створити Bot:
   - Bot URI: `florenza_bot` (або найближчий доступний)
   - Avatar: монограма F
   - Description: як для Telegram
5. Отримати **Authentication Token** (`X-Viber-Auth-Token`)
6. Налаштувати webhook після розгортання VPS:

```bash
curl -X POST "https://chatapi.viber.com/pa/set_webhook" \
  -H "X-Viber-Auth-Token: $VIBER_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://florenza-irpin.com/api/webhook/viber",
    "event_types": ["delivered", "seen", "failed", "subscribed", "unsubscribed", "conversation_started", "message"]
  }'
```

7. Додати в `.env`:
```
VIBER_AUTH_TOKEN=...
VIBER_BOT_URI=florenza_bot
```

---

## 5. Monobank Acquiring

### Кроки

1. https://acquire.monobank.ua → «Підключити»
2. Залишити заявку:
   - ФОП Каракой Варвара Олександрівна
   - Тип: e-commerce
   - Очікуваний оборот: реалістично
   - Тип товарів: квіти / подарунки
3. Дочекатися дзвінка менеджера Mono (1–3 дні)
4. Підписати договір через Дію
5. Пройти KYC: скан паспорта, виписка з ЄДР, виписка про доходи (опційно)
6. Отримати:
   - **API Token** (рядок типу `u123abc456...`)
   - **Public key** (для верифікації webhooks)
7. Додати в `.env`:
   ```
   MONO_API_TOKEN=u123...
   MONO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...
   ```

### Налаштування webhook

```bash
curl -X POST "https://api.monobank.ua/personal/webhook" \
  -H "X-Token: $MONO_API_TOKEN" \
  -d '{"webHookUrl": "https://florenza-irpin.com/api/webhook/mono"}'
```

### Налаштування інвойсів через API

Використовується API: https://api.monobank.ua/api/merchant/invoice/create

### Тест

- Створи тестовий заказ на 1 грн
- Mono згенерує invoice URL
- Оплати з власної карти
- Webhook має дійти до сайту → заказ переходить у `Оплачений`

---

## 6. LiqPay (резерв)

### Кроки

1. https://liqpay.ua → Реєстрація
2. Бізнес-акаунт на ФОП Каракой
3. Інтернет-еквайринг → активувати
4. Settings → API → отримати:
   - `public_key`
   - `private_key`
5. Додати в `.env`:
   ```
   LIQPAY_PUBLIC_KEY=...
   LIQPAY_PRIVATE_KEY=...
   ```

### Налаштування webhook

В адмінці LiqPay → Налаштування → Server URL: `https://florenza-irpin.com/api/webhook/liqpay`

### Тест

Аналогічно Mono.

---

## 7. Checkbox.ua ПРРО

### Кроки

1. https://checkbox.ua → Зареєструватися
2. Підключити каси:
   - Документи: реєстрація РРО в податковій (якщо ще немає)
   - Якщо РРО немає — реєструється Checkbox-ом за 1 день
3. Адмінка Checkbox → Інтеграції → API:
   - Створити робоче місце
   - Отримати:
     - `LICENSE_KEY`
     - `OPERATOR_PIN` (PIN-код касира)
     - `CASH_REGISTER_ID`
4. Підключити інтеграцію з Mono:
   - Адмінка Checkbox → Платіжні системи → Mono Acquiring → ввести Mono token
   - Тестова покупка → чек має автоматично згенеруватися
5. Налаштувати відправку чеків в Telegram/Viber через API:
   - У `lib/payments/checkbox.ts` — після створення чека викликається `sendReceipt(orderId, customerChannel, customerId)`
6. Додати в `.env`:
   ```
   CHECKBOX_LICENSE_KEY=...
   CHECKBOX_OPERATOR_PIN=...
   CHECKBOX_CASH_REGISTER_ID=...
   ```

### Налаштування webhook (опційно)

Webhook для статусу чека:
- Адмінка Checkbox → Webhooks → URL: `https://florenza-irpin.com/api/webhook/checkbox`

---

## 8. Google Search Console

### Кроки

1. https://search.google.com/search-console → «Add property»
2. Тип: **Domain** (рекомендовано)
3. Введіть `florenza-irpin.com`
4. Підтвердження через DNS TXT record:
   - GoDaddy → DNS Settings → Add → Type: TXT
   - Name: `@`
   - Value: значення яке Google дав (типу `google-site-verification=...`)
   - Save → зачекати 5–15 хвилин
5. У GSC натиснути «Verify»
6. Після верифікації — додати sitemap:
   - URL: `https://florenza-irpin.com/sitemap.xml`

### Service Account для API-інтеграції

Потрібен для авто-pull метрик у адмінку:

1. https://console.cloud.google.com → новий проект `florenza-gsc`
2. APIs & Services → Library → шукай «Search Console API» → Enable
3. APIs & Services → Credentials → Create Credentials → Service Account:
   - Name: `florenza-gsc-reader`
   - Role: не потрібно
4. Service Account → Keys → Add Key → Create new key → JSON → завантажити
5. У GSC → Settings → Users and permissions → Add user:
   - Email: `florenza-gsc-reader@florenza-gsc.iam.gserviceaccount.com`
   - Permission: Restricted

6. Додати credentials у `.env`:
```
GOOGLE_SEARCH_CONSOLE_CREDENTIALS={"type":"service_account",...} # JSON одним рядком
```

---

## 9. Google Business Profile

Описано в `PRE_LAUNCH_CHECKLIST.md` пункт 12.

API integration (опційно, для авто-pull відгуків в адмінку):

1. https://developers.google.com/my-business → Get started
2. Запит на доступ до API (модерація 1–7 днів)
3. Service Account як для GSC
4. Додати в `.env`:
```
GOOGLE_BUSINESS_PROFILE_API_KEY=...
GOOGLE_BUSINESS_PROFILE_LOCATION_ID_IRPIN=...
GOOGLE_BUSINESS_PROFILE_LOCATION_ID_BUCHA=...
GOOGLE_BUSINESS_PROFILE_LOCATION_ID_HOSTOMEL=...
```

---

## 10. Google Maps Embed

### Кроки

1. https://www.google.com/maps → знайти «м. Ірпінь, вул. Ірпінська 1»
2. Клацнути на маркер → Share → Embed a map → скопіювати iframe
3. Вставити в `app/(public)/contacts/page.tsx`

API key не потрібен для базового embed.

Якщо потрібна інтерактивна карта (Phase 2):
1. https://console.cloud.google.com → APIs → Maps JavaScript API → Enable
2. Credentials → Create API key
3. Restrict key до домену `florenza-irpin.com`
4. Додати в `.env`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

---

## 11. Backblaze B2

Описано в `BACKUP.md`.

Підсумково:
1. https://www.backblaze.com/cloud-storage → реєстрація
2. Bucket: `florenza-backups` (Private)
3. Application Key з обмеженням до bucket
4. Додати в `.env`:
```
BACKBLAZE_KEY_ID=...
BACKBLAZE_APPLICATION_KEY=...
BACKBLAZE_BUCKET=florenza-backups
```

---

## 12. UptimeRobot

### Кроки

1. https://uptimerobot.com → Sign up (free tier)
2. Add New Monitor:
   - Type: HTTP(s)
   - Friendly Name: `Florenza Production`
   - URL: `https://florenza-irpin.com`
   - Monitoring Interval: 5 minutes
3. Alert Contacts:
   - Email
   - Telegram (через @uptimerobotbot)
4. Optional: API webhook для записування у власну аналітику

---

## Підсумок усіх env-змінних

`.env.example` (для копіювання):

```env
# === Domain ===
NEXT_PUBLIC_SITE_URL=https://florenza-irpin.com
NEXTAUTH_URL=https://florenza-irpin.com

# === Database ===
DATABASE_URL=postgresql://florenza:CHANGEME@postgres:5432/florenza
POSTGRES_USER=florenza
POSTGRES_PASSWORD=CHANGEME
POSTGRES_DB=florenza

# === Payload ===
PAYLOAD_SECRET=CHANGEME_USE_OPENSSL_RAND_HEX_32
PAYLOAD_PUBLIC_SERVER_URL=https://florenza-irpin.com

# === AI ===
ANTHROPIC_API_KEY=sk-ant-CHANGEME
GEMINI_API_KEY=CHANGEME

# === Whisper ===
WHISPER_BIN=/usr/local/bin/whisper-transcribe

# === Messengers ===
TELEGRAM_BOT_TOKEN=CHANGEME
TELEGRAM_WEBHOOK_SECRET=CHANGEME_USE_OPENSSL_RAND_HEX_32
TELEGRAM_BOT_USERNAME=florenza_bot

VIBER_AUTH_TOKEN=CHANGEME
VIBER_BOT_URI=florenza_bot

# === Payments ===
MONO_API_TOKEN=CHANGEME
MONO_PUBLIC_KEY=CHANGEME

LIQPAY_PUBLIC_KEY=CHANGEME
LIQPAY_PRIVATE_KEY=CHANGEME

# === ПРРО ===
CHECKBOX_LICENSE_KEY=CHANGEME
CHECKBOX_OPERATOR_PIN=CHANGEME
CHECKBOX_CASH_REGISTER_ID=CHANGEME

# === Google ===
GOOGLE_SEARCH_CONSOLE_CREDENTIALS={"type":"service_account",...}
GOOGLE_BUSINESS_PROFILE_API_KEY=CHANGEME
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=CHANGEME

# === Backups ===
BACKBLAZE_KEY_ID=CHANGEME
BACKBLAZE_APPLICATION_KEY=CHANGEME
BACKBLAZE_BUCKET=florenza-backups

# === Analytics ===
IP_HASH_SALT=CHANGEME_USE_OPENSSL_RAND_HEX_32

# === Encryption (для sensitive data в БД) ===
ENCRYPTION_KEY=CHANGEME_USE_OPENSSL_RAND_HEX_32

# === Logs ===
LOG_LEVEL=info
NODE_ENV=production
```

---

## Чек-лист інтеграцій

### Перед запуском

- [ ] Anthropic API ключ отриманий і обмеження виставлені
- [ ] Gemini API ключ отриманий і квоти перевірені
- [ ] Telegram бот зареєстрований, налаштований, webhook працює
- [ ] Viber бот зареєстрований, верифікований, webhook працює
- [ ] Mono Acquiring підключений (production-режим)
- [ ] LiqPay підключений (production-режим)
- [ ] Checkbox.ua ПРРО активний, чеки тестово видаються
- [ ] Google Search Console верифікований, sitemap submited
- [ ] Google Business Profile × 3 створені (хоча б подача)
- [ ] Backblaze B2 bucket створений, бекапи виконуються щоденно
- [ ] UptimeRobot моніторить
- [ ] Усі env-змінні заповнені, `.env` не в git

### Після запуску

- [ ] Перевірити що Mono webhook доходить (тестова оплата)
- [ ] Перевірити що ПРРО чек відправляється в Telegram після оплати
- [ ] Перевірити що Лія відповідає в Telegram + Viber + сайт-чат
- [ ] Перевірити що бекап вдало виконується (поглянь `backup.log`)
- [ ] Перевірити що UptimeRobot отримує `200 OK` від сайту

---

**Цей документ — твоя dependency map. Якщо щось не працює — починай з перевірки відповідної інтеграції.**
