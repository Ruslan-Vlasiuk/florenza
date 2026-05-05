#!/bin/bash
set -euo pipefail

: "${TELEGRAM_BOT_TOKEN:?Need TELEGRAM_BOT_TOKEN in env}"
: "${TELEGRAM_WEBHOOK_SECRET:?Need TELEGRAM_WEBHOOK_SECRET in env}"

if ! command -v cloudflared >/dev/null; then
  echo "✗ cloudflared not installed. Install: https://developers.cloudflare.com/cloudflared/" >&2
  exit 1
fi

LOCAL_PORT="${PORT:-3000}"
TUNNEL_LOG=$(mktemp)

echo "→ Starting cloudflared tunnel on localhost:${LOCAL_PORT}..."
cloudflared tunnel --url "http://localhost:${LOCAL_PORT}" > "${TUNNEL_LOG}" 2>&1 &
TUNNEL_PID=$!

cleanup() {
  echo
  echo "→ Cleanup: stopping tunnel, deleting webhook"
  kill "${TUNNEL_PID}" 2>/dev/null || true
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook" >/dev/null
  rm -f "${TUNNEL_LOG}"
}
trap cleanup EXIT

echo "→ Waiting for tunnel URL..."
for _ in {1..30}; do
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "${TUNNEL_LOG}" | head -1 || true)
  if [[ -n "${TUNNEL_URL}" ]]; then break; fi
  sleep 1
done

if [[ -z "${TUNNEL_URL:-}" ]]; then
  echo "✗ Tunnel URL not found in logs. Check ${TUNNEL_LOG}" >&2
  exit 1
fi

echo "✓ Tunnel: ${TUNNEL_URL}"
echo "→ Setting Telegram webhook to dev tunnel..."

./scripts/setup-telegram-webhook.sh "${TUNNEL_URL}"

echo
echo "✓ Ready! Send messages to your bot. Ctrl+C to stop."
wait "${TUNNEL_PID}"
