#!/bin/bash
set -euo pipefail

: "${TELEGRAM_BOT_TOKEN:?Need TELEGRAM_BOT_TOKEN in env}"
: "${TELEGRAM_WEBHOOK_SECRET:?Need TELEGRAM_WEBHOOK_SECRET in env}"

BASE_URL="${1:-https://florenza-irpin.com}"
WEBHOOK_URL="${BASE_URL}/api/webhook/telegram"

echo "→ Setting webhook to: ${WEBHOOK_URL}"

RESPONSE=$(curl -sS -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -d "url=${WEBHOOK_URL}" \
  -d "drop_pending_updates=true" \
  -d "secret_token=${TELEGRAM_WEBHOOK_SECRET}" \
  -d "allowed_updates[]=message" \
  -d "allowed_updates[]=callback_query")

echo "${RESPONSE}" | jq .

if echo "${RESPONSE}" | jq -e '.ok' >/dev/null; then
  echo
  echo "✓ Webhook set. Current state:"
  curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo" | jq .
else
  echo "✗ Failed to set webhook" >&2
  exit 1
fi
