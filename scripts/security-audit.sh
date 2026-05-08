#!/usr/bin/env bash
# Florenza — post-deploy security audit.
# Run on the VPS as root:  bash scripts/security-audit.sh
#
# Checks every concrete failure mode that has actually bitten us, plus
# the standard hardening items. Exits with non-zero if any HIGH/CRITICAL
# issue is found.

set -uo pipefail

PASS=0
WARN=0
FAIL=0

ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
warn() { echo "  ⚠️  $1"; WARN=$((WARN+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

echo
echo "════════════════════════════════════════════════"
echo "  Florenza · post-deploy security audit"
echo "════════════════════════════════════════════════"

# ─────── 1. Docker port bindings — must be 127.0.0.1 for db/internal ───────
echo
echo "─── 1. Public port exposure (Docker bypasses UFW!) ───"
PUBLIC_PORTS=$(ss -tlnH 2>/dev/null | awk '{print $4}' | grep -E '^(0\.0\.0\.0|\*|\[::\]):' | sort -u)
for line in $PUBLIC_PORTS; do
  port=${line##*:}
  case "$port" in
    22|80|443) ok "port $port open (expected: SSH/HTTP/HTTPS)" ;;
    *)         fail "port $port is exposed to 0.0.0.0 — block or bind to 127.0.0.1" ;;
  esac
done

# ─────── 2. Postgres connectivity from outside ───────
echo
echo "─── 2. Postgres reachability ───"
if ss -tlnH 2>/dev/null | grep -qE '^.*\s(0\.0\.0\.0:543[0-9]|\[::\]:543[0-9])\s'; then
  fail "Postgres is reachable from public internet — fix docker-compose.yml ports"
else
  ok "Postgres bound to localhost only"
fi

# ─────── 3. UFW firewall ───────
echo
echo "─── 3. UFW firewall ───"
if ufw status | grep -q "Status: active"; then
  ok "UFW active"
  ALLOWED=$(ufw status | grep -E '^[0-9]+/' | awk '{print $1}' | sort -u | tr '\n' ' ')
  echo "     allowed: $ALLOWED"
else
  fail "UFW inactive"
fi

# ─────── 4. fail2ban ───────
echo
echo "─── 4. fail2ban ───"
if systemctl is-active --quiet fail2ban; then
  ok "fail2ban active"
  CURRENTLY_BANNED=$(fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk -F: '{print $2}' | tr -d '\t ')
  echo "     SSH currently-banned: $CURRENTLY_BANNED"
else
  fail "fail2ban not running"
fi

# ─────── 5. SSH config ───────
echo
echo "─── 5. SSH hardening ───"
SSHD=/etc/ssh/sshd_config
grep -qE '^PermitRootLogin\s+(no|prohibit-password)' $SSHD && ok "Root login restricted" || warn "Consider disabling root SSH (PermitRootLogin no)"
grep -qE '^PasswordAuthentication\s+no' $SSHD && ok "Password auth disabled (key-only)" || fail "Enable key-only SSH (PasswordAuthentication no)"

# ─────── 6. .env permissions ───────
echo
echo "─── 6. .env file permissions ───"
ENV=/opt/florenza/.env
if [ -f "$ENV" ]; then
  PERMS=$(stat -c '%a' "$ENV")
  OWNER=$(stat -c '%U' "$ENV")
  if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
    ok ".env is $PERMS owner=$OWNER"
  else
    fail ".env permissions $PERMS — should be 600"
  fi
else
  warn "/opt/florenza/.env not found"
fi

# ─────── 7. Docker container privileges ───────
echo
echo "─── 7. Docker container privileges ───"
PRIV=$(docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep florenza | wc -l)
ok "$PRIV florenza containers running"
for c in $(docker ps --format '{{.Names}}' | grep florenza); do
  PRIVILEGED=$(docker inspect "$c" --format '{{.HostConfig.Privileged}}' 2>/dev/null)
  if [ "$PRIVILEGED" = "true" ]; then
    fail "$c is running PRIVILEGED — remove this from compose"
  else
    ok "$c not privileged"
  fi
done

# ─────── 8. Unattended upgrades ───────
echo
echo "─── 8. Auto security updates ───"
if systemctl is-enabled --quiet unattended-upgrades 2>/dev/null; then
  ok "unattended-upgrades enabled"
else
  warn "unattended-upgrades not enabled"
fi

# ─────── 9. SSL cert expiry ───────
echo
echo "─── 9. SSL certificate ───"
CERT=/etc/letsencrypt/live/florenza-irpin.com/fullchain.pem
if [ -f "$CERT" ]; then
  EXPIRY=$(openssl x509 -in "$CERT" -noout -enddate | cut -d= -f2)
  EXP_TS=$(date -d "$EXPIRY" +%s)
  NOW_TS=$(date +%s)
  DAYS=$(( (EXP_TS - NOW_TS) / 86400 ))
  if [ $DAYS -lt 14 ]; then
    fail "SSL expires in $DAYS days — check certbot.timer"
  elif [ $DAYS -lt 30 ]; then
    warn "SSL expires in $DAYS days"
  else
    ok "SSL expires in $DAYS days"
  fi
fi

# ─────── 10. External port scan from this host ───────
echo
echo "─── 10. External port scan (self-reachable from public IP) ───"
PUBLIC_IP=$(curl -fsS --max-time 5 ifconfig.me 2>/dev/null || echo "unknown")
if [ "$PUBLIC_IP" = "unknown" ]; then
  warn "Cannot determine public IP"
else
  for port in 22 80 443 5432 5433 6379 3306 27017 9200; do
    timeout 3 bash -c "echo > /dev/tcp/$PUBLIC_IP/$port" 2>/dev/null && \
      { case "$port" in
          22|80|443) ok "$PUBLIC_IP:$port open (expected)" ;;
          *)         fail "$PUBLIC_IP:$port REACHABLE from internet — close it" ;;
        esac } || \
      ok "$PUBLIC_IP:$port closed"
  done
fi

# ─────── Summary ───────
echo
echo "════════════════════════════════════════════════"
echo "  Summary: ✅ $PASS passed · ⚠️ $WARN warnings · ❌ $FAIL failures"
echo "════════════════════════════════════════════════"
exit $FAIL
