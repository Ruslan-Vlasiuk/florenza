# Florenza — Backup Strategy

> **Стратегія бекапів для гарантії що ніщо не буде втрачено.**

---

## Що бекапимо

1. **PostgreSQL БД** — всі заказы, букети, діалоги, статті, налаштування — найкритичніше
2. **Папка `media/`** — оригінали фото букетів (AI-згенеровані + завантажені вручну)
3. **Файл `.env`** — environment variables (зашифровано перед заливкою!)
4. **Версіонування промптів** — у БД, бекапиться разом з БД

---

## Куди бекапимо

**Backblaze B2** — S3-сумісне сховище, 10 GB безкоштовно назавжди, далі $0.005/GB/міс.

Альтернативи (якщо B2 не подобається):
- **rclone до Google Drive** — 15 GB на особистому акаунті безкоштовно
- **Hetzner Storage Box** — €3.5/міс за 1 TB (якщо багато фото)
- **AWS S3 Glacier Deep Archive** — $0.00099/GB/міс (для довгострокового архіву)

---

## Налаштування Backblaze B2

### Крок 1 — Створення акаунта і bucket

1. Зареєструйся на https://www.backblaze.com/cloud-storage
2. Створи bucket: `florenza-backups`
   - Files in Bucket: **Private**
   - Object Lock: **Disabled** (для простоти)
   - Default Encryption: **Enabled (SSE-B2)**
3. Створи Application Key:
   - Назва: `florenza-vps-backup`
   - Allow access to: `florenza-backups` only (НЕ master key!)
   - Permissions: `Read and Write`
   - Зберегти `keyID` і `applicationKey`

### Крок 2 — Установка rclone на VPS

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash

# Налаштуй
rclone config

# Виконай:
# n) New remote
# Name: b2
# Storage: 6 (Backblaze B2)
# account: <keyID>
# key: <applicationKey>
# (інші — за замовчуванням)
# y) Yes, save
# q) Quit

# Тест
rclone ls b2:florenza-backups
```

---

## Backup-скрипт

Створи `/home/florenza/florenza/scripts/backup.sh`:

```bash
#!/bin/bash
set -e

# Конфіг
BACKUP_DIR="/home/florenza/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_NAME="florenza"
DB_USER="florenza"
RETAIN_LOCAL_DAYS=7
RETAIN_REMOTE_DAYS=30

# Створи директорію
mkdir -p $BACKUP_DIR

echo "[$(date)] Starting backup..."

# 1. БД дамп
echo "Backing up database..."
docker compose -f /home/florenza/florenza/docker-compose.yml exec -T postgres \
  pg_dump -U $DB_USER -Fc $DB_NAME > $BACKUP_DIR/db_$DATE.dump

# Розмір дампа
DB_SIZE=$(du -h $BACKUP_DIR/db_$DATE.dump | cut -f1)
echo "DB dump size: $DB_SIZE"

# 2. Media папка (тільки нові/змінені файли)
echo "Backing up media folder..."
tar -czf $BACKUP_DIR/media_$DATE.tar.gz -C /home/florenza/florenza media/

MEDIA_SIZE=$(du -h $BACKUP_DIR/media_$DATE.tar.gz | cut -f1)
echo "Media archive size: $MEDIA_SIZE"

# 3. .env (зашифровано через GPG)
echo "Backing up encrypted .env..."
gpg --batch --yes --passphrase-file /home/florenza/.backup_passphrase \
  -c -o $BACKUP_DIR/env_$DATE.gpg /home/florenza/florenza/.env

# 4. Заливка на Backblaze B2
echo "Uploading to Backblaze B2..."
rclone copy $BACKUP_DIR b2:florenza-backups/$DATE/ --progress

# 5. Очистка локальних бекапів старше 7 днів
echo "Cleaning local backups older than $RETAIN_LOCAL_DAYS days..."
find $BACKUP_DIR -type f -mtime +$RETAIN_LOCAL_DAYS -delete

# 6. Очистка віддалених бекапів старше 30 днів
echo "Cleaning remote backups older than $RETAIN_REMOTE_DAYS days..."
rclone delete b2:florenza-backups/ --min-age ${RETAIN_REMOTE_DAYS}d

# 7. Health check ping (опційно — UptimeRobot або healthchecks.io)
# curl -fsS --retry 3 https://hc-ping.com/<UUID>

echo "[$(date)] Backup completed successfully"
```

```bash
chmod +x /home/florenza/florenza/scripts/backup.sh
```

### Створи passphrase для GPG

```bash
# Згенеруй надійну passphrase
openssl rand -base64 48 > /home/florenza/.backup_passphrase
chmod 600 /home/florenza/.backup_passphrase

# Зберігай копію passphrase у:
# - 1Password / Bitwarden
# - папці Google Drive в зашифрованому файлі
# - принтованому виданні в офлайн-сейфі
# Без passphrase ти НЕ зможеш розшифрувати .env бекап!
```

---

## Cron — щоденно о 3:00

```bash
crontab -e
```

Додай:

```cron
0 3 * * * /home/florenza/florenza/scripts/backup.sh >> /home/florenza/logs/backup.log 2>&1
```

---

## Restore-скрипт

Створи `/home/florenza/florenza/scripts/restore.sh`:

```bash
#!/bin/bash
set -e

# Використання: ./restore.sh 2026-04-25_03-00-00

DATE=$1
if [ -z "$DATE" ]; then
  echo "Usage: $0 <YYYY-MM-DD_HH-MM-SS>"
  echo "Available backups:"
  rclone lsd b2:florenza-backups/
  exit 1
fi

RESTORE_DIR="/tmp/florenza-restore-$DATE"
mkdir -p $RESTORE_DIR

echo "Downloading backup $DATE from B2..."
rclone copy b2:florenza-backups/$DATE/ $RESTORE_DIR/ --progress

echo "Restoring database..."
docker compose -f /home/florenza/florenza/docker-compose.yml exec -T postgres \
  pg_restore -U florenza -d florenza --clean --if-exists < $RESTORE_DIR/db_$DATE.dump

echo "Restoring media..."
tar -xzf $RESTORE_DIR/media_$DATE.tar.gz -C /home/florenza/florenza/

echo "Restore completed. Verify the application works."
echo "DO NOT restore .env automatically — extract manually if needed."
```

```bash
chmod +x /home/florenza/florenza/scripts/restore.sh
```

---

## Тестування restore (раз на місяць!)

**Бекап без перевіреного restore — це не бекап.** Раз на місяць:

1. Розгорни test-VPS (можна тимчасовий Vultr на $6 — забіл після тесту)
2. Виконай `restore.sh <останнє_число>`
3. Запусти `docker compose up`
4. Зайди в адмінку — переконайся що дані на місці
5. Видали тестовий VPS

---

## Що якщо B2 буде недоступний

- **Резервна копія №2:** rclone до Google Drive раз на тиждень (free tier 15 GB)
- Налаштування у `~/.config/rclone/rclone.conf` додатковий remote `gdrive`

```bash
# Додай у backup.sh після B2 upload:
rclone copy $BACKUP_DIR gdrive:florenza-weekly/$(date +%Y-%U)/ --progress
```

Можна виконувати раз на тиждень (cron `0 4 * * 0`).

---

## Розмір бекапу через час

| Період | БД | Media | Усього |
|---|---|---|---|
| Місяць 1 | ~50 MB | ~500 MB | **~550 MB** |
| Місяць 6 | ~200 MB | ~3 GB | **~3.2 GB** |
| Рік 1 | ~500 MB | ~8 GB | **~8.5 GB** |

Поки 10 GB B2 free tier вистачає на ~1 рік. Далі — $0.005/GB/міс ($0.05/міс при 10 GB понад free).

---

## Critical Reminders

🚨 **Зберігай passphrase для GPG в кількох місцях.** Якщо забудеш — `.env` бекап стане непридатним.

🚨 **Тестуй restore щомісяця.** Поки не відновив — не знаєш чи воно працює.

🚨 **Application Key** для B2 — зберігай в `.env`, ніколи не комміть в git.

🚨 **Якщо переходиш на іншого хостинг-провайдера** — бекапи з B2 переносяться однією командою rclone copy.
