FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web-store/ ./apps/web-store/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @manga/web-store build

# ==============================================================================
# Production Runtime
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Next.js standalone output contains the full self-contained server
COPY --from=builder /app/apps/web-store/.next/standalone ./
COPY --from=builder /app/apps/web-store/.next/static ./apps/web-store/.next/static
COPY --from=builder /app/apps/web-store/public ./apps/web-store/public

EXPOSE 3000

CMD ["node", "apps/web-store/server.js"]
