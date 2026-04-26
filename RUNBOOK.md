# Florenza — Runbook (типові проблеми і вирішення)

> **Цей документ — інструкція "що робити якщо щось пішло не так".** Тримай поряд.

---

## 🚨 Сайт не відкривається взагалі

### Перевір підряд:

**1. DNS працює?**
```bash
dig florenza-irpin.com +short
# Має повернути IP твого VPS
```

Якщо не повертає або повертає неправильний IP → перевір DNS на GoDaddy.

**2. VPS живий?**
```bash
ssh florenza@<VPS_IP>
# Якщо не пускає — заходь у Vultr console через веб-панель
```

**3. Docker контейнери запущені?**
```bash
cd ~/florenza
docker compose ps
# Усі мають бути up
```

Якщо ні:
```bash
docker compose up -d
docker compose logs -f --tail=100
```

**4. Nginx працює?**
```bash
sudo systemctl status nginx
# Active (running)
```

Якщо ні:
```bash
sudo nginx -t  # перевір конфіг
sudo systemctl restart nginx
```

**5. SSL не expired?**
```bash
echo | openssl s_client -servername florenza-irpin.com \
  -connect florenza-irpin.com:443 2>/dev/null | openssl x509 -noout -dates
```

Якщо expired або скоро закінчиться:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 🚨 Лія не відповідає в чаті / Telegram / Viber

### Діагностика:

**1. Anthropic API доступний?**
```bash
curl -X POST "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "test"}]
  }'
```

Якщо отримуєш помилку — перевір:
- API key валідний
- Баланс на акаунті (Anthropic Console)
- Rate limits

**2. Telegram webhook налаштований?**
```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"
# url має бути: https://florenza-irpin.com/api/webhook/telegram?secret=...
# pending_update_count: 0 (якщо багато — webhook не обробляється)
```

Якщо webhook не налаштований:
```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://florenza-irpin.com/api/webhook/telegram?secret=$TELEGRAM_WEBHOOK_SECRET"
```

**3. Логи додатку**
```bash
docker compose logs -f app | grep -i "error\|liya\|claude"
```

Шукай повідомлення про помилки в AI-pipeline.

**4. Лія тимчасово вимкнена?**
В адмінці: **Налаштування → AI → Лія активна: ON/OFF**

Якщо вимкнена — клієнти отримують fallback повідомлення *«Зараз не онлайн, зв'яжемось протягом години»*.

---

## 🚨 Оплата не проходить

### Mono Acquiring

**1. Webhook працює?**
```bash
docker compose logs -f app | grep -i "mono"
```

**2. Mono test mode чи production?**
В адмінці: **Платежі → Mono → Mode** має бути `production`.

**3. Перевір API-ключі в .env**

**4. Тестова оплата**
- Створи тестовий заказ на 1 грн
- Спробуй оплатити з власної карти
- Якщо падає — лог і скрін до Mono support

### LiqPay (резерв)

Якщо Mono недоступний — переключи на LiqPay:
- Адмінка: **Платежі → Mono активний: OFF**, **LiqPay активний: ON**
- Лія автоматично почне використовувати LiqPay

### ПРРО Checkbox

Якщо чек не відправляється:
- Перевір баланс підписки на Checkbox.ua
- Перевір що webhook від Mono доходить до додатку (логи)
- Спробуй вручну створити чек через адмінку Checkbox

---

## 🚨 Заказ оплачений, але статус не оновився

```bash
# Подивись на webhook логи
docker compose logs -f app | grep -i "webhook"

# Перевір вручну в БД
docker compose exec postgres psql -U florenza -d florenza -c \
  "SELECT id, status, payment_status, paid_at FROM orders WHERE id = '<ORDER_ID>';"

# Якщо webhook не дійшов — оновити вручну в адмінці:
# Замовлення → знайди → змінити статус → Зберегти
```

---

## 🚨 Whisper не транскрибує голосове

**1. Whisper встановлений?**
```bash
which whisper-transcribe
# /usr/local/bin/whisper-transcribe
```

**2. Тест на тестовому файлі**
```bash
# Якщо є тестовий .ogg
whisper-transcribe /tmp/test.ogg
```

**3. Брак RAM**
```bash
free -h
# Якщо used > 90% — перезапусти контейнери
docker compose restart
```

Можливо потрібен апгрейд VPS до 8 GB RAM. Whisper на 4 GB працює, але якщо одночасно йде багато транскрибацій — може OOM.

**4. ffmpeg встановлений?**
```bash
which ffmpeg
# /usr/bin/ffmpeg
```

Якщо ні: `sudo apt install ffmpeg`.

---

## 🚨 Gemini не генерує фото

**1. API key валідний?**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"hi"}]}]}'
```

**2. Квота вичерпана?**
- Перевір на https://aistudio.google.com/apikey → твій ключ → usage
- Free tier має ліміти (поглянь у Google AI Studio)

**3. Логи**
```bash
docker compose logs -f app | grep -i "gemini\|image"
```

---

## 🚨 БД повільна / помилки postgres

**1. Перевір використання диска**
```bash
df -h
# Якщо / заповнений > 90% — попередня очистка docker
docker system prune -a --volumes
```

**2. PostgreSQL логи**
```bash
docker compose logs postgres --tail=200
```

**3. Vacuum БД**
```bash
docker compose exec postgres psql -U florenza -d florenza -c "VACUUM ANALYZE;"
```

**4. Розмір БД**
```bash
docker compose exec postgres psql -U florenza -d florenza -c \
  "SELECT pg_size_pretty(pg_database_size('florenza'));"
```

Якщо росте швидко — перевір таблицю `analytics_events` і `messages`. Можна налаштувати ротацію старих записів.

---

## 🚨 Багато спам-повідомлень в Telegram-боті

**1. Включи rate limiting**
В адмінці: **Налаштування → Лія → Rate limit** = 5 повідомлень / хвилина на одного користувача.

**2. Заблокуй конкретного користувача**
В адмінці: **Інбокс → знайди розмову → опції → Заблокувати**

Або вручну в БД:
```sql
INSERT INTO client_blacklist (telegram_id, reason, created_at)
VALUES ('<TELEGRAM_USER_ID>', 'spam', NOW());
```

---

## 🚨 Server overload (повільний сайт)

**1. CPU/RAM**
```bash
htop
# Якщо load > 5 — щось не так
```

**2. Активні підключення**
```bash
ss -s
sudo netstat -an | grep :443 | wc -l
```

**3. Перезапуск**
```bash
docker compose restart
sudo systemctl restart nginx
```

**4. Атака?**
```bash
# Перевір IP з найбільшою кількістю запитів
sudo awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20
```

Підозрілі IP — забань через ufw:
```bash
sudo ufw deny from <IP>
```

Або налаштуй Cloudflare перед сайтом (безкоштовно, базовий захист).

---

## 🚨 Не приходить листівка GBP-підтвердження

- Зачекай 14 днів. Іноді до 21
- Якщо все ще немає — на сторінці GBP «Verify by mail» → «Resend»
- Альтернатива: запит на відеоверифікацію (доступна не завжди)
- В останньому випадку — звернутись в GBP Support

---

## 🚨 Хтось коментує / згадує проблему з продуктом публічно

(Сайту це безпосередньо не стосується, але правило важливе)

1. Не реагуй імпульсивно
2. Зверни до клієнта **в особисті повідомлення** (Telegram або через інбокс адмінки)
3. Спокійно вирішуй: пропонуй переробку букета / часткове повернення / купон на наступне замовлення
4. Лія НЕ підключається до публічних коментарів — тільки до особистих

---

## 🚨 Backup не виконався

```bash
# Подивись логи
tail -100 /home/florenza/logs/backup.log

# Запусти вручну
/home/florenza/florenza/scripts/backup.sh

# Перевір місце на диску
df -h
```

Якщо disk full:
```bash
# Знайди великі файли
du -sh /home/florenza/backups/* | sort -h
# Видали старі
find /home/florenza/backups/ -mtime +14 -delete
```

---

## 🚨 Перенос на новий VPS / провайдер

1. На старому VPS — зроби фінальний backup
2. На новому — пройди весь `DEPLOY.md`
3. Restore з backup
4. Зміни DNS на GoDaddy на новий IP
5. Зачекай розповсюдження DNS (до 24 год)
6. Перевір що все працює
7. Старий VPS — видали через тиждень (резерв)

---

## Контакти підтримки сервісів

| Сервіс | Підтримка |
|---|---|
| Vultr | https://my.vultr.com → Support → Submit Ticket |
| GoDaddy | https://supportcenter.godaddy.com (24/7) |
| Anthropic | support@anthropic.com |
| Google AI | https://aistudio.google.com/feedback |
| Mono Acquiring | help-acquiring@monobank.ua |
| LiqPay | support@liqpay.ua |
| Checkbox | support@checkbox.ua |
| Telegram | @BotSupport |

---

## Загальні поради

1. **Завжди читай логи перед паніком** — `docker compose logs -f`
2. **Backup перед будь-якою серйозною дією** — навіть якщо думаєш «нічого не зламається»
3. **Не змінюй прод напряму** — спочатку тестуй на staging (можна локально)
4. **Якщо не впевнений — пиши підряднику** замість експериментів
5. **Переконайся що 2FA включений** на всіх critical акаунтах (Vultr, GoDaddy, Anthropic, Mono)

---

**Цей runbook — твій safety net. Зберігай його не тільки на VPS, але й роздрукований у домашньому архіві.**
