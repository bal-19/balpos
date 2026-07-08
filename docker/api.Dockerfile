# Dev image untuk apps/api.
# Bun dipakai sebagai package manager/monorepo tool, Node.js sebagai runtime
# aplikasi (sesuai docs/02-tech-stack.md). Multi-stage production build
# (bun build / tsc + node dist) menyusul di Phase 5 (Production Ready).

FROM oven/bun:1-alpine

RUN apk add --no-cache nodejs

WORKDIR /app
COPY . .
RUN bun install

WORKDIR /app/apps/api
EXPOSE 4000

CMD ["bun", "run", "dev"]
