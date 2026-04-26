# Florenza — Security Guide

> **Безпекова конфігурація VPS і додатку.** Виконується один раз під час `DEPLOY.md` і періодично перевіряється.

---

## Принципи

1. **Defense in depth** — шари захисту, не одна точка
2. **Least privilege** — мінімум доступів усюди
3. **No secrets in git** — `.env` ніколи не коммітимо
4. **Security updates** — автоматично щодня
5. **Logging and monitoring** — все підозріле логуємо
6. **Backup і encryption** — критично

---

## SSH

### Заборона root login

```bash
sudo nano /etc/ssh/sshd_config

# Зміни:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
MaxAuthTries 3
ClientAliveInterval 600
ClientAliveCountMax 0
LoginGraceTime 30

sudo systemctl restart sshd
```

### Зміни SSH порт (опційно)

Стандартний порт 22 — постійно сканується ботами. Зміна на нестандартний знижує спам у логах.

```bash
sudo nano /etc/ssh/sshd_config
# Port 2222 (або інший >1024 <65535, не зайнятий)

sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
sudo systemctl restart sshd

# Тепер підключаєшся:
ssh -p 2222 florenza@<VPS_IP>
```

### SSH-keys best practices

- ✅ Ed25519 keys (не RSA)
- ✅ Passphrase на приватному ключі
- ✅ SSH agent (`ssh-add`) для зручності
- ✅ Окремий ключ для production VPS (не reuse personal key)

```bash
# Генерація на локалі
ssh-keygen -t ed25519 -C "florenza-prod" -f ~/.ssh/florenza_prod
```

---

## Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp     # SSH (або 2222 якщо змінив)
sudo ufw allow 80/tcp     # HTTP (для Let's Encrypt)
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
sudo ufw status verbose
```

**НЕ відкривай** Postgres (5432), Next.js (3000), Whisper, або інші внутрішні порти. Усі зовнішні запити йдуть через Nginx.

---

## Fail2ban

Блокує IP після кількох невдалих спроб.

```bash
sudo apt install -y fail2ban

# Налаштування для SSH і Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = 22
filter = sshd

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 7200

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

---

## Nginx security headers

```bash
sudo nano /etc/nginx/sites-available/florenza
```

Додай у server-блок:

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# CSP — будь обережний, може зламати щось
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' wss: https://api.anthropic.com https://generativelanguage.googleapis.com; frame-ancestors 'self'" always;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

location /api/ {
    limit_req zone=api burst=40 nodelay;
    proxy_pass http://localhost:3000;
    # ... інші proxy_set_header
}

location /admin/login {
    limit_req zone=login burst=5 nodelay;
    proxy_pass http://localhost:3000;
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Тест на https://securityheaders.com → має бути не нижче A.

---

## Auto-upgrades

```bash
sudo apt install -y unattended-upgrades apt-listchanges

sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

```
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
};

Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:30";
```

```bash
sudo nano /etc/apt/apt.conf.d/20auto-upgrades
```

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
```

```bash
sudo systemctl enable unattended-upgrades
```

---

## Secrets management

### Що секрети, які НЕ комітимо

```
ANTHROPIC_API_KEY
GEMINI_API_KEY
TELEGRAM_BOT_TOKEN
VIBER_AUTH_TOKEN
MONO_API_TOKEN
LIQPAY_PRIVATE_KEY
CHECKBOX_LICENSE_KEY
PAYLOAD_SECRET
DATABASE_URL
POSTGRES_PASSWORD
IP_HASH_SALT
TELEGRAM_WEBHOOK_SECRET
BACKBLAZE_APPLICATION_KEY
```

### .gitignore

```
.env
.env.local
.env.production
.env.*.local
!.env.example
*.pem
*.key
.backup_passphrase
```

### Перевірка перед commit

```bash
# Pre-commit hook
git config --global core.hooksPath .githooks

# Створи .githooks/pre-commit:
#!/bin/bash
if grep -rE "(sk-ant-|sk-[a-zA-Z0-9]{20,}|GEMINI_API_KEY|MONO_API_TOKEN)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" .; then
  echo "❌ Знайдено можливі секрети в commit"
  exit 1
fi
chmod +x .githooks/pre-commit
```

---

## Database

### Postgres NEVER exposed externally

В `docker-compose.yml` НЕ роби:
```yaml
postgres:
  ports:
    - "5432:5432"  # ❌ ЗАБОРОНЕНО
```

Має бути:
```yaml
postgres:
  expose:
    - "5432"  # ✅ Тільки внутрішня docker network
```

### Strong passwords

```bash
# Postgres password
openssl rand -base64 32

# Adapt PAYLOAD_SECRET
openssl rand -hex 32

# IP_HASH_SALT (rotate monthly)
openssl rand -hex 32
```

### Read-only DB user для аналітики (опційно)

Якщо колись захочеш дати доступ зовнішньому BI-tool:

```sql
CREATE USER florenza_readonly WITH PASSWORD '...';
GRANT CONNECT ON DATABASE florenza TO florenza_readonly;
GRANT USAGE ON SCHEMA public TO florenza_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO florenza_readonly;
```

---

## API security

### Webhook secrets

Усі webhooks (Telegram, Mono, LiqPay) перевіряють підпис:

```typescript
// Telegram
if (req.query.secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
  return res.status(403).json({ error: 'Unauthorized' });
}

// Mono — перевірка signature через X-Sign header
const signature = req.headers['x-sign'];
const isValid = verifyMonoSignature(req.body, signature, MONO_PUBLIC_KEY);
if (!isValid) return res.status(403);
```

### Rate limiting на API endpoints

```typescript
// app/api/chat/route.ts
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 min
  uniqueTokenPerInterval: 500,
});

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  try {
    await limiter.check(20, ip); // 20 requests / minute / IP
  } catch {
    return new Response('Too many requests', { status: 429 });
  }
  // ...
}
```

---

## CSRF protection

Payload CMS має CSRF за замовчуванням для форм адмінки. Для публічних API endpoints (наприклад `/api/chat`) — використовуємо токен у заголовку.

---

## Adminка — двофакторна автентифікація

В Payload додай 2FA через TOTP (Google Authenticator).

```typescript
// payload/collections/Users.ts
{
  slug: 'users',
  auth: {
    twoFactor: {
      // Custom 2FA implementation
      // Або плагін @payloadcms/plugin-2fa якщо доступний
    },
  },
}
```

⚠️ Без 2FA — пароль адмінки єдиний бар'єр. Включи обов'язково.

---

## Logging

### Application logs

`pino` для structured logging:

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});
```

Логи зберігаються в `/var/log/florenza/` (rotated daily, 30 днів retention).

### Що НЕ логуємо

- ❌ API keys
- ❌ Паролі
- ❌ Credit card data
- ❌ Persоnal information в plain text (email, телефон логуй з маскуванням)

```typescript
// Маскування телефону
const maskedPhone = phone.slice(0, 6) + '****' + phone.slice(-2);
// "+38063****12"
```

---

## Sensitive data в БД

### Хешування паролів (Payload робить за замовчуванням)
- Bcrypt з salt rounds ≥12

### Шифрування персональних даних
Опційно, для compliance:
- Адреси, побажання у заказах — зашифровані стовпці (pgcrypto)

```sql
INSERT INTO orders (..., address_encrypted)
VALUES (..., pgp_sym_encrypt('адреса', '${ENCRYPTION_KEY}'));

SELECT pgp_sym_decrypt(address_encrypted, '${ENCRYPTION_KEY}')
FROM orders WHERE id = '...';
```

ENCRYPTION_KEY зберігається в `.env`, не в БД.

---

## Inсідент response

### Якщо спрацював alarm (UptimeRobot, fail2ban, або підозрілі логи)

1. **Увійди в VPS** і подивись логи
2. **Заскрінь** все підозріле перед зачисткою
3. **Заблокуй** атакуючий IP через UFW
4. **Поміняй** скомпроментовані ключі (Anthropic, Mono, ...)
5. **Restore** з останнього бекапу якщо є підозра на компроментацію БД
6. **Повідом** Vultr support якщо потрібно

### Якщо було витікання даних

1. Не паніч
2. Подивись scope (що саме витекло)
3. Зміни всі секрети
4. **Повідом клієнтів** яких це торкається — UA-закон вимагає
5. Подивись що Privacy Policy каже (повинно бути зазначено повідомлення в 72 год)

---

## Регулярний security audit (раз на місяць)

- [ ] Перевір що всі security updates встановлені (`apt list --upgradable`)
- [ ] Перевір логи fail2ban (хто намагався brute-force?)
- [ ] Перевір що SSL не expires скоро
- [ ] Перевір що backup виконується і restore працює
- [ ] Перевір disk space (не заповнюється)
- [ ] Перевір що 2FA включений у всіх admin-акаунтах
- [ ] Перевір API usage у Anthropic / Gemini (немає підозрілих сплесків)
- [ ] Зміни IP_HASH_SALT для server-side analytics

---

## Checklist при підозрі компроментації

- [ ] Зміни password Vultr
- [ ] Зміни password GoDaddy
- [ ] Зміни всі API keys (Anthropic, Gemini, Mono, LiqPay, Telegram, ...)
- [ ] Зміни PAYLOAD_SECRET
- [ ] Зміни Postgres password
- [ ] Зміни IP_HASH_SALT
- [ ] Зміни passphrase для backup GPG
- [ ] Перевір cron tasks (нічого нового не додано?)
- [ ] Перевір SSH keys у `~/.ssh/authorized_keys`
- [ ] Перевір Docker образи (є чужі?)
- [ ] Перевір running processes (`ps auxf`)
- [ ] Перезавантаж VPS (іноді rootkit ховається в RAM)

---

**Безпека — це процес, не разове налаштування. Перевіряй щомісяця.**
