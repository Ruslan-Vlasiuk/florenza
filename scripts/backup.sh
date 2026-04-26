#!/usr/bin/env bash
# Florenza — nightly backup
# Backs up Postgres + media to Backblaze B2 (free tier 10 GB).
# Configure via .env: B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/florenza}"
BACKUP_DIR="${APP_DIR}/backups"
DATE=$(date +%Y-%m-%d)
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# 1. Postgres dump
echo "  → Dumping Postgres..."
docker compose -f "$APP_DIR/docker-compose.yml" exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-florenza}" "${POSTGRES_DB:-florenza}" \
  | gzip > "$BACKUP_DIR/db-${DATE}.sql.gz"

# 2. Media tarball
echo "  → Archiving media..."
tar -czf "$BACKUP_DIR/media-${DATE}.tar.gz" -C /var/florenza media/

# 3. Upload to Backblaze B2 (if rclone configured)
if command -v rclone &>/dev/null && [ -n "${B2_BUCKET:-}" ]; then
  echo "  → Uploading to B2..."
  rclone copy "$BACKUP_DIR/db-${DATE}.sql.gz" "b2:${B2_BUCKET}/db/" || echo "  ⚠ DB upload failed"
  rclone copy "$BACKUP_DIR/media-${DATE}.tar.gz" "b2:${B2_BUCKET}/media/" || echo "  ⚠ Media upload failed"
fi

# 4. Cleanup old local backups
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] ✓ Backup complete."
