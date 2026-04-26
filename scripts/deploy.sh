#!/usr/bin/env bash
# Florenza — local-to-VPS deploy
# Usage: ./scripts/deploy.sh
set -euo pipefail

VPS_HOST="${VPS_HOST:-florenza-irpin.com}"
VPS_USER="${VPS_USER:-florenza}"
APP_DIR="${APP_DIR:-/opt/florenza}"

echo "→ Pushing to $VPS_USER@$VPS_HOST:$APP_DIR"

ssh "$VPS_USER@$VPS_HOST" "cd $APP_DIR && git pull --rebase"
ssh "$VPS_USER@$VPS_HOST" "cd $APP_DIR && docker compose up -d --build"
ssh "$VPS_USER@$VPS_HOST" "cd $APP_DIR && docker compose exec -T app pnpm payload migrate"

echo "✓ Deploy complete. Health: https://$VPS_HOST/api/health"
