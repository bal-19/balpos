# Dev image generik untuk semua Vite app (dashboard, kitchen-display,
# customer-display, ordering). APP_DIR & APP_PORT di-set lewat build args
# di docker-compose.yml. Multi-stage production build (vite build + static
# server) menyusul di Phase 5 (Production Ready).

FROM oven/bun:1-alpine

ARG APP_DIR
ARG APP_PORT=5173

WORKDIR /app
COPY . .
RUN bun install

WORKDIR /app/${APP_DIR}
EXPOSE ${APP_PORT}

CMD ["bun", "run", "dev", "--", "--host"]
