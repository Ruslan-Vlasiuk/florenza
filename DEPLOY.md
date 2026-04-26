# Florenza — Deploy Guide

> **Цей документ описує покрокове розгортання Florenza на Vultr VPS з Ubuntu 24 LTS.**

---

## Передумови

- ✅ VPS на Vultr створено (2 vCPU / 4 GB RAM / 80 GB SSD, Ubuntu 24.04 LTS, Frankfurt region)
- ✅ Домен `florenza-irpin.com` куплений на GoDaddy
- ✅ DNS `A` записи на GoDaddy ведуть на IP VPS (для `@`, `www`, опційно `admin`)
- ✅ SSH-ключ доданий до VPS (НЕ використовуємо паролі)
- ✅ Усі API-ключі отримано:
  - Anthropic Claude API
  - Google Gemini API
  - Telegram Bot Token
  - Viber Auth Token
  - Mono Acquiring credentials
  - LiqPay credentials
  - Checkbox.ua credentials

---

## Крок 1 — Підключення до VPS

```bash
# З локальної машини
ssh root@<VPS_IP>

# Створи окремого користувача (НЕ працювати з root напряму)
adduser florenza
usermod -aG sudo florenza

# Скопіюй свій SSH-ключ для нового користувача
mkdir -p /home/florenza/.ssh
cp /root/.ssh/authorized_keys /home/florenza/.ssh/
chown -R florenza:florenza /home/florenza/.ssh
chmod 700 /home/florenza/.ssh
chmod 600 /home/florenza/.ssh/authorized_keys

# Заборони SSH від root
nano /etc/ssh/sshd_config
# знайди: PermitRootLogin yes → зміни на: PermitRootLogin no
# знайди: PasswordAuthentication yes → зміни на: PasswordAuthentication no
systemctl restart sshd

# Логаут і перепідключись як florenza
exit
ssh florenza@<VPS_IP>
```

---

## Крок 2 — Підготовка системи

```bash
# Оновлення пакетів
sudo apt update && sudo apt upgrade -y

# Базові інструменти
sudo apt install -y curl wget git vim htop ufw fail2ban unzip build-essential

# Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban (захист від brute-force)
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Auto-upgrades для security patches
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Крок 3 — Установка Docker і Docker Compose

```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker florenza
newgrp docker

# Перевірка
docker --version
docker compose version
```

---

## Крок 4 — Установка Node.js (для білду на сервері якщо потрібно) і pnpm

```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc

# Перевірка
node --version  # v20.x.x
pnpm --version
```

---

## Крок 5 — Установка Whisper для voice-транскрибації

```bash
# Python
sudo apt install -y python3 python3-pip python3-venv ffmpeg

# Створи venv для Whisper
mkdir -p ~/whisper && cd ~/whisper
python3 -m venv venv
source venv/bin/activate

# Встанови faster-whisper (швидша версія)
pip install faster-whisper

# Завантаж модель small (300MB, баланс швидкість/якість)
python3 -c "from faster_whisper import WhisperModel; WhisperModel('small')"

# Тест
echo "test" | python3 -c "
from faster_whisper import WhisperModel
model = WhisperModel('small', device='cpu', compute_type='int8')
print('Whisper готовий')
"

deactivate
```

**Скрипт-обгортка** (буде викликатися з Next.js):

```bash
# Створи /usr/local/bin/whisper-transcribe
sudo nano /usr/local/bin/whisper-transcribe

# Вставити:
#!/bin/bash
source /home/florenza/whisper/venv/bin/activate
python3 << EOF
import sys
from faster_whisper import WhisperModel
model = WhisperModel('small', device='cpu', compute_type='int8')
segments, info = model.transcribe("$1", language="uk")
for segment in segments:
    print(segment.text, end='')
EOF
deactivate

# Дай права на виконання
sudo chmod +x /usr/local/bin/whisper-transcribe
```

---

## Крок 6 — Клонування репозиторію

```bash
cd ~
git clone https://github.com/<your-org>/florenza.git
cd florenza

# Перевір що ти на main гілці
git status
```

---

## Крок 7 — Налаштування environment variables

```bash
cp .env.example .env
nano .env
```

Заповни (приклад):

```env
# Domain
NEXT_PUBLIC_SITE_URL=https://florenza-irpin.com
NEXTAUTH_URL=https://florenza-irpin.com

# Database
DATABASE_URL=postgresql://florenza:<strong_password>@postgres:5432/florenza
POSTGRES_USER=florenza
POSTGRES_PASSWORD=<strong_password>
POSTGRES_DB=florenza

# Payload
PAYLOAD_SECRET=<generate via: openssl rand -hex 32>
PAYLOAD_PUBLIC_SERVER_URL=https://florenza-irpin.com

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=<generate random>

# Viber
VIBER_AUTH_TOKEN=...

# Payments
MONO_API_TOKEN=...
MONO_PUBLIC_KEY=...
LIQPAY_PUBLIC_KEY=...
LIQPAY_PRIVATE_KEY=...

# ПРРО
CHECKBOX_LICENSE_KEY=...
CHECKBOX_OPERATOR_PIN=...
CHECKBOX_CASH_REGISTER_ID=...

# Google
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT=...
GOOGLE_BUSINESS_PROFILE_API_KEY=...

# Backups
BACKBLAZE_KEY_ID=...
BACKBLAZE_APPLICATION_KEY=...
BACKBLAZE_BUCKET=florenza-backups

# Whisper
WHISPER_BIN=/usr/local/bin/whisper-transcribe

# Analytics salt (rotate monthly)
IP_HASH_SALT=<generate via: openssl rand -hex 32>
```

---

## Крок 8 — Перший запуск

```bash
# Збираємо і запускаємо
docker compose up -d --build

# Перевірка
docker compose ps
docker compose logs -f --tail=100

# Має бути:
# - florenza-app (Next.js + Payload) — running on :3000
# - florenza-postgres — running on :5432
```

---

## Крок 9 — Міграції БД та seed

```bash
# Виконай міграції
docker compose exec app pnpm payload migrate

# Створи admin-користувача
docker compose exec app pnpm payload create-first-user

# Seed демо-контенту
docker compose exec app pnpm seed:demo
```

---

## Крок 10 — Налаштування Nginx як reverse proxy

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/florenza
```

Вміст:

```nginx
server {
    listen 80;
    server_name florenza-irpin.com www.florenza-irpin.com;

    # Redirect to HTTPS (буде додано після certbot)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name florenza-irpin.com www.florenza-irpin.com;

    # SSL — буде заповнено certbot
    # ssl_certificate /etc/letsencrypt/live/florenza-irpin.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/florenza-irpin.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
    }

    # Static files з кешуванням
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /media/ {
        alias /home/florenza/florenza/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Активуй
sudo ln -s /etc/nginx/sites-available/florenza /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Крок 11 — SSL через Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

# Отримай сертифікат
sudo certbot --nginx -d florenza-irpin.com -d www.florenza-irpin.com

# Слідуй інструкціям:
# - email для notifications
# - погодься з ToS
# - обрати redirect HTTP→HTTPS

# Перевір автооновлення
sudo certbot renew --dry-run

# Cron вже додано certbot для авто-оновлення
sudo systemctl status certbot.timer
```

---

## Крок 12 — Telegram + Viber webhooks

```bash
# Telegram webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://florenza-irpin.com/api/webhook/telegram?secret=<WEBHOOK_SECRET>"

# Перевірка
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Viber webhook (через панель Viber Partners)
# Зайди на https://partners.viber.com → твій PA → Webhook URL:
# https://florenza-irpin.com/api/webhook/viber
```

---

## Крок 13 — Налаштування Mono webhook

В адмінці Mono або через API:

```bash
# Встанови webhook URL для notifications про оплату
curl -X POST "https://api.monobank.ua/personal/webhook" \
  -H "X-Token: <MONO_TOKEN>" \
  -d '{"webHookUrl": "https://florenza-irpin.com/api/webhook/mono"}'
```

---

## Крок 14 — Перевірка

```bash
# Тести
curl https://florenza-irpin.com  # має відкривати головну
curl https://florenza-irpin.com/admin  # має відкривати адмінку

# Логи
docker compose logs -f --tail=50
sudo journalctl -u nginx -f

# Перевір SSL
curl -vI https://florenza-irpin.com 2>&1 | grep -i "strict\|ssl"

# Lighthouse через CLI
docker run --rm -it --network host \
  patrickhulce/lhci-runner \
  --collect.url=https://florenza-irpin.com \
  --collect.preset=desktop
```

---

## Крок 15 — Налаштування cron-задач

```bash
crontab -e
```

Додай:

```cron
# Backup БД щоденно о 3:00
0 3 * * * /home/florenza/florenza/scripts/backup.sh >> /home/florenza/logs/backup.log 2>&1

# Очистка старих логів
0 4 * * 0 find /home/florenza/logs -name "*.log" -mtime +30 -delete

# Ротація IP_HASH_SALT (раз на місяць)
0 0 1 * * /home/florenza/florenza/scripts/rotate-ip-salt.sh

# Health check
*/5 * * * * curl -f https://florenza-irpin.com/api/health || echo "ALERT" | mail -s "Florenza down" admin@florenza-irpin.com
```

---

## Крок 16 — UptimeRobot моніторинг (зовнішній)

1. Зареєструватись на https://uptimerobot.com (free tier)
2. Add New Monitor:
   - Type: HTTP(s)
   - Friendly Name: Florenza
   - URL: https://florenza-irpin.com
   - Monitoring Interval: 5 minutes
3. Alert Contacts: твій email + Telegram (через @uptimerobotbot)

---

## Крок 17 — GitHub Actions для авто-деплою

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: florenza
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/florenza
            git pull origin main
            docker compose down
            docker compose up -d --build
            docker compose exec -T app pnpm payload migrate
            curl -X POST https://florenza-irpin.com/api/health
```

Налаштуй секрети в GitHub Settings → Secrets:
- `VPS_HOST`
- `SSH_PRIVATE_KEY`

---

## Готово!

Сайт live на `https://florenza-irpin.com`. Адмінка — `https://florenza-irpin.com/admin`.

**Наступні кроки:**
1. Заповни `BrandSettings`, `BrandVoice`, `LiyaRules` в адмінці
2. Заверши Pre-launch Checklist
3. Soft launch — тестування
4. Public launch — анонс
