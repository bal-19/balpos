# 3. Monorepo Structure

```
restaurant-pos/
├── apps/
│   ├── api/                 # Backend Express.js API
│   ├── dashboard/            # Admin & POS Dashboard (React)
│   ├── kitchen-display/      # Kitchen Display System (React)
│   ├── customer-display/     # Customer-facing display (React)
│   └── ordering/             # QR Table Ordering (React)
│
├── packages/
│   ├── ui/                   # Reusable UI components (shadcn/ui based)
│   ├── api-client/           # Shared Axios client, auth, refresh token
│   ├── types/                # Shared TypeScript types/interfaces
│   ├── utils/                # Currency, date, tax formatter, helpers
│   ├── config/                # Shared config (eslint, tsconfig base, env schema)
│   ├── eslint-config/
│   └── tsconfig/
│
├── docs/                     # Dokumentasi project (folder ini)
├── prompts/                  # AI prompt templates (Gemini)
├── docker/                   # Dockerfiles & compose configs
│
├── turbo.json
├── package.json
├── bun.lock
├── bunfig.toml
└── docker-compose.yml
```

## Catatan

- Setiap `apps/*` adalah aplikasi independen yang dapat di-build & dijalankan secara terpisah, namun berbagi kode lewat `packages/*`.
- `packages/types` menjadi kontrak tipe antara backend (`apps/api`) dan seluruh frontend, memastikan type-safety end-to-end.
- `packages/api-client` membungkus Axios + interceptor auth/refresh token, dipakai oleh semua frontend apps.
- `docker/` menyimpan Dockerfile per-app dan konfigurasi pendukung; orkestrasi utama tetap di root `docker-compose.yml`.
- Task build/lint/test/dev diorkestrasi oleh TurboRepo (`turbo.json`) dengan caching agar CI/local dev cepat.
