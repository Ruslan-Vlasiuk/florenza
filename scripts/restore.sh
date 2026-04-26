#!/usr/bin/env bash
# Florenza — restore from backup
# Usage: ./scripts/restore.sh <db-backup.sql.gz> [<media-backup.tar.gz>]
set -euo pipefail

DB_BACKUP="$1"
MEDIA_BACKUP="${2:-}"
APP_DIR="${APP_DIR:-/opt/florenza}"

if [ -z "$DB_BACKUP" ]; then
  echo "Usage: $0 <db-backup.sql.gz> [<media-backup.tar.gz>]"
  exit 1
fi

echo "⚠ This will DESTROY current data and replace with backup."
read -p "Continue? [y/N] " -r
[[ $REPLY =~ ^[Yy]$ ]] || exit 1

echo "→ Stopping app..."
docker compose -f "$APP_DIR/docker-compose.yml" stop app

echo "→ Restoring DB..."
gunzip -c "$DB_BACKUP" | \
  docker compose -f "$APP_DIR/docker-compose.yml" exec -T postgres \
  psql -U "${POSTGRES_USER:-florenza}" "${POSTGRES_DB:-florenza}"

if [ -n "$MEDIA_BACKUP" ]; then
  echo "→ Restoring media..."
  rm -rf /var/florenza/media/*
  tar -xzf "$MEDIA_BACKUP" -C /var/florenza/
fi

echo "→ Starting app..."
docker compose -f "$APP_DIR/docker-compose.yml" start app

echo "✓ Restore complete."
