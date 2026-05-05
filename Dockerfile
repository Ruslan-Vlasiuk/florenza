# =============================================================================
# Florenza — Dockerfile (multi-stage)
# =============================================================================

# --- Stage 1: deps ---
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
RUN pnpm install --frozen-lockfile || pnpm install

# --- Stage 2: builder ---
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_SECRET=build_time_placeholder
ENV DATABASE_URI=postgres://build:build@localhost:5432/build
RUN pnpm build

# --- Stage 2.5: seed runner (one-off jobs) ---
# Used by `docker compose run --rm seed pnpm seed:admin` etc.
# Has full source + tsx + pnpm so we can execute TS seed scripts.
FROM node:22-alpine AS seed
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["sh", "-c", "echo 'Specify a seed command: pnpm seed:admin | seed:globals | seed:demo'"]

# --- Stage 3: runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install whisper-ready system deps + ffmpeg for voice
RUN apk add --no-cache ffmpeg python3 py3-pip curl tini

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Media uploads volume mount point
RUN mkdir -p /var/florenza/media && chown -R nextjs:nodejs /var/florenza

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# tini handles signals for graceful shutdown
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
