#!/usr/bin/env bash
# =============================================================================
# Florenza — VPS Bootstrap Script
# Run on a fresh Vultr Ubuntu 24 LTS VPS as root.
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/<your-repo>/main/scripts/setup-server.sh | bash
# Or copy and run manually after SSHing in.
# =============================================================================
set -euo pipefail

DOMAIN="${DOMAIN:-florenza-irpin.com}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
APP_USER="florenza"
APP_DIR="/opt/florenza"

echo "════════════════════════════════════════════════════════"
echo "  Florenza — server bootstrap"
echo "  Domain: $DOMAIN"
echo "════════════════════════════════════════════════════════"

# 1. Update system
echo "[1/10] Updating Ubuntu..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq

# 2. Install base tools
echo "[2/10] Installing base tools..."
apt-get install -y -qq \
  curl wget git build-essential ca-certificates \
  ufw fail2ban unattended-upgrades \
  nginx certbot python3-certbot-nginx \
  htop tmux jq rsync python3 python3-pip ffmpeg

# 3. Install Docker
echo "[3/10] Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

# 4. Install Whisper (for voice transcription)
echo "[4/10] Installing Whisper..."
pip3 install --break-system-packages openai-whisper || pip3 install openai-whisper
ln -sf "$(which whisper)" /usr/local/bin/whisper || true

# 5. Create app user and directory
echo "[5/10] Setting up app user and directory..."
id -u "$APP_USER" &>/dev/null || useradd -m -s /bin/bash "$APP_USER"
usermod -aG docker "$APP_USER"
mkdir -p "$APP_DIR" /var/florenza/media
chown -R "$APP_USER:$APP_USER" "$APP_DIR" /var/florenza

# 6. Configure firewall
echo "[6/10] Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 7. Configure fail2ban
echo "[7/10] Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = 22
maxretry = 5
bantime = 3600
EOF
systemctl restart fail2ban

# 8. Configure unattended security updates
echo "[8/10] Enabling unattended security updates..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades-florenza <<EOF
Unattended-Upgrade::Allowed-Origins {
    "Ubuntu-ESM:\${distro_codename}";
    "Ubuntu-ESMApps:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Automatic-Reboot "false";
EOF
systemctl enable --now unattended-upgrades

# 9. Configure Nginx + SSL
echo "[9/10] Configuring Nginx for $DOMAIN..."
cat > /etc/nginx/sites-available/florenza <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
    }

    location /api/webhook/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 60;
    }
}
EOF
ln -sf /etc/nginx/sites-available/florenza /etc/nginx/sites-enabled/florenza
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Issue SSL via Let's Encrypt
echo "  Requesting Let's Encrypt cert..."
certbot --nginx --non-interactive --agree-tos --email "$ADMIN_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" --redirect || \
  echo "  ⚠ Cert issuance failed — run 'certbot --nginx -d $DOMAIN' manually after DNS resolves"

# 10. Setup cron for backups + re-engagement + blog
echo "[10/10] Setting up cron jobs..."
sudo -u "$APP_USER" bash <<'CRONEOF'
( crontab -l 2>/dev/null; cat <<EOF
# Florenza nightly backup at 02:30
30 2 * * * /opt/florenza/scripts/backup.sh >> /opt/florenza/logs/backup.log 2>&1
# Re-engagement check every 15 min
*/15 * * * * curl -s -H "Authorization: Bearer \${CRON_SECRET}" http://127.0.0.1:3000/api/cron/re-engagement >> /opt/florenza/logs/cron.log 2>&1
# Blog pipeline daily at 09:00
0 9 * * * curl -s -H "Authorization: Bearer \${CRON_SECRET}" http://127.0.0.1:3000/api/cron/blog-pipeline >> /opt/florenza/logs/cron.log 2>&1
EOF
) | crontab -
CRONEOF

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✓ Server ready."
echo ""
echo "  Next steps:"
echo "  1. Clone repo:    su - $APP_USER && cd /opt && git clone <repo> florenza"
echo "  2. Configure env: cp /opt/florenza/.env.example /opt/florenza/.env && nano /opt/florenza/.env"
echo "  3. Deploy:        cd /opt/florenza && docker compose up -d --build"
echo "  4. Run migrations: docker compose exec app pnpm payload migrate"
echo "  5. Run demo seed:  docker compose exec app pnpm seed:demo"
echo "  6. Set webhooks:"
echo "       Telegram: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://$DOMAIN/api/webhook/telegram"
echo "       Viber:    via Admin Panel → set webhook to https://$DOMAIN/api/webhook/viber"
echo ""
echo "  Visit https://$DOMAIN/admin to log in to Payload."
echo "════════════════════════════════════════════════════════"
