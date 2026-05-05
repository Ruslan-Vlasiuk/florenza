# Florenza — Soft-launch deploy log

**Date:** 2026-05-05
**Owner of /admin:** ruslan.vlasiuk.0028@gmail.com
**Domain:** https://florenza-irpin.com
**VPS:** 178.105.38.223 (Vultr Ubuntu 24.04 LTS, 4 cores / 7.6 GB RAM / 150 GB SSD)
**SSL:** Let's Encrypt valid until 2026-08-03 (auto-renewal via certbot.timer)
**Tag:** `v0.1.0-soft-launch`

---

## Status

✅ **LIVE** at https://florenza-irpin.com

- HTTP→HTTPS redirect, www→apex redirect.
- 90 Postgres tables created from local dev schema dump.
- 42 demo bouquets, BrandVoice + LiyaRules + DeliverySettings + PaymentSettings populated from seed.
- Admin user `ruslan.vlasiuk.0028@gmail.com` (role=owner) ready.
- Telegram webhook active on `@FLORENZA_irpin_bot` (https://florenza-irpin.com/api/webhook/telegram, secret_token verified).
- Sandbox payment banner visible on all public pages.
- Лія opening-turn from CTA: confirmed working (chat seeded with bouquet context, greets with name).
- Daily backup cron: 02:30 UTC, retention 14 days, output in `/opt/florenza/backups/`.
- UFW: only 22/80/443 inbound. fail2ban active. unattended-upgrades enabled.

## Soft-launch limitations (intentional)

| Capability | State | Unblocks when |
|---|---|---|
| Mono real payments | Sandbox public token | Варвара proves merchant identity, gets prod token |
| ПРРО fiscal receipts | Disabled | Checkbox credentials arrive |
| Voice in Telegram | Text fallback | Whisper docker service shipped (separate iteration) |
| Viber bot | Disabled | Виber token from Variera |
| LiqPay backup | Disabled | Keys arrive |
| Backblaze B2 backups | Disabled (local only) | B2 keys arrive |
| GSC integration | Disabled | gsc.json from Варвара |

## Known sharp edges to clean later

1. **Payload + tsx ESM bug** — `pnpm payload migrate:create` and `pnpm seed:admin / seed:globals` fail in Docker due to Payload 3.84 + tsx@4.21 + Node 22 ESM/CJS interop issue (`ERR_REQUIRE_ASYNC_MODULE`). Workaround used: schema pushed via `pg_dump` from local dev, data ditto. Future schema changes require either:
   - Local dev migration generation (also blocked) — needs Payload upstream fix
   - `drizzle-kit push --config=...` directly
   - Manual SQL migrations
2. **Admin user created via Payload `/api/users/first-register`** (single-shot endpoint) instead of seed script, because of bug above.
3. **`PAYLOAD_PUSH=true` left in .env** — has no runtime effect (drizzle adapter `push` is a CLI-only flag), but documents intent. Safe to remove.
4. **`docker-compose.yml` keeps `nginx` service profile=production** — unused (host nginx is the actual proxy). Can be deleted in next pass.
5. **216 lint warnings** (mostly `@typescript-eslint/no-explicit-any`) — separate cleanup task.
6. **Bundle largest chunk 803 KB** — `@next/bundle-analyzer` audit needed for Lighthouse Mobile ≥85 target.
7. **Playwright e2e** — not configured. Spec drafted in earlier TZ, defer.

## Operations

```bash
# SSH
ssh florenza@178.105.38.223      # app user (in docker group)
ssh root@178.105.38.223          # root (do not disable until validated)

# Container ops
cd /opt/florenza
docker compose ps
docker compose logs --tail=200 app
docker compose restart app

# Apply new code
git pull --rebase
docker compose build app
docker compose up -d app

# DB shell
docker exec -it florenza-postgres psql -U florenza -d florenza

# Manual backup
set -a && source .env && set +a
bash scripts/backup.sh

# Telegram webhook
set -a && source .env && set +a
bash scripts/setup-telegram-webhook.sh https://florenza-irpin.com
curl -sS https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo | jq .

# Switch to production payment mode (after Mono approval)
# 1. Replace MONO_ACQUIRING_TOKEN in /opt/florenza/.env
# 2. /admin → Налаштування бренду → Платежі → paymentMode → "production"
# 3. Save
# 4. (No restart needed — Лія re-reads global on each conversation turn)
```

## Variara onboarding (passed separately)

- /admin URL: https://florenza-irpin.com/admin
- Email: ruslan.vlasiuk.0028@gmail.com (owner — Ruslan invites Варвара in /admin → Users)
- Initial admin password: stored locally in `/tmp/florenza-prod.env` (not committed). Should be transferred to Bitwarden/1Password before that file is wiped.

## What stays unchanged from this point

- `main` branch is the deployed branch.
- Future deploys: push to main → SSH to VPS → `git pull && docker compose build app && docker compose up -d app`.
- GitHub Actions `deploy.yml` still disabled. Re-enable after first 3-5 successful manual deploys.
