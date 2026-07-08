# 12. Development Principles

- TypeScript-first di seluruh aplikasi.
- Feature-Based Modular Architecture.
- Monorepo menggunakan TurboRepo dan Bun Workspace.
- Thin Controller — seluruh business logic berada pada Service.
- Validasi menggunakan Zod.
- Type-safe mulai dari database hingga frontend.
- Shared packages untuk UI, Types, Config, API Client, dan Utils.
- Reusable Components.
- Queue untuk seluruh proses berat.
- Socket.IO untuk realtime.
- Scalar sebagai dokumentasi API.
- Docker sebagai standar environment development dan deployment.
- API-first sehingga mudah diintegrasikan dengan aplikasi mobile di masa depan.

## Implikasi Praktis

| Prinsip | Implikasi Konkret |
|---|---|
| Thin Controller | Code review menolak PR yang menaruh query/kalkulasi langsung di controller |
| Zod di semua layer | Skema request/response, env variable, bahkan config queue divalidasi Zod |
| Type-safe end-to-end | Prisma generate types → dipakai di `service`/`repository` → diekspos ulang/diselaraskan lewat `packages/types` ke frontend |
| Queue untuk proses berat | Endpoint API tidak pernah menunggu Gemini/Google TTS/generate file secara sinkron |
| Docker sebagai standar | `docker-compose.yml` mencakup API, semua frontend (atau reverse-proxy static build), Redis; Postgres/Storage tetap Supabase (managed) |
| API-first | Tidak ada logic yang hanya bisa diakses lewat UI — semua lewat endpoint terdokumentasi di Scalar |
