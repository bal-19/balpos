# CLAUDE.md

Panduan kerja untuk Claude Code di repo **Restaurant POS & CRM**. Baca ini sebelum menulis atau mengubah kode.

## Status Proyek

Saat ini repo hanya berisi dokumentasi perencanaan di [docs/](docs/00-index.md). Belum ada `apps/`, `packages/`, `package.json`, atau dependency yang di-install. Sebelum menulis kode apa pun, baca [docs/00-index.md](docs/00-index.md) sebagai sumber kebenaran arsitektur — jangan berasumsi struktur yang berbeda.

## Stack Ringkas

Monorepo **TurboRepo + Bun Workspace**. Backend **Node.js 24 + Express + TypeScript + Prisma + Zod + Socket.IO + BullMQ + Redis**. Frontend **React 19 + Vite + TanStack Router/Query + Zustand + Tailwind v4 + shadcn/ui**, 4 app: `dashboard`, `kitchen-display`, `customer-display`, `ordering`. DB: Supabase PostgreSQL. Payment: Xendit. AI: Google Gemini. Detail lengkap: [docs/02-tech-stack.md](docs/02-tech-stack.md).

## Aturan Arsitektur — Wajib Diikuti

### Backend (`apps/api`)

- **Feature-based module**, bukan layer-based. Setiap domain (`auth`, `pos`, `kitchen`, `inventory`, dst.) punya folder sendiri di `src/modules/<name>/` berisi `controller/`, `service/`, `repository/`, `routes/`, `dto/`, `schema/`, `types/`, `events/`, `queues/`, `validators/`.
- **Thin Controller** — controller hanya terima request, panggil service, bentuk response. Business logic, kalkulasi, orkestrasi antar repository **selalu** di Service, tidak pernah di Controller.
- Flow wajib: `Request → Controller → Service → Repository → Prisma → PostgreSQL`.
- Validasi input **selalu** lewat Zod schema di `schema/`, dijalankan sebagai middleware sebelum controller — jangan validasi manual ad-hoc di controller/service.
- Proses berat/eksternal (AI analysis, notification, printer, voice announcement, export PDF/Excel, email) **wajib** lewat BullMQ queue, jangan dijalankan sinkron di request-response cycle.
- Perubahan state yang perlu diketahui module lain (order selesai, stok rendah, dsb.) dipublish lewat **events**, bukan panggilan langsung antar service — hindari coupling antar module.
- Setiap tabel/entity operasional menyertakan `outletId` (dan siap `tenantId`) sejak awal, walau MVP hanya 1 outlet — lihat [docs/11-data-model.md](docs/11-data-model.md).
- Setiap endpoint baru harus terdokumentasi lewat OpenAPI/Scalar (lihat [docs/09-api-documentation.md](docs/09-api-documentation.md)) — bukan opsional.

### Frontend (`apps/dashboard`, `apps/kitchen-display`, `apps/customer-display`, `apps/ordering`)

- **Feature-based**: setiap fitur di `src/features/<name>/` berisi `components/`, `hooks/`, `services/`, `types/`, `routes/`.
- State server → **TanStack Query** (cache, invalidation). State UI/lokal → **Zustand**. Jangan dicampur (misal jangan simpan data server di Zustand store).
- Form → **React Hook Form + Zod**, schema idealnya diselaraskan dengan schema backend.
- Komponen reusable lintas-app masuk `packages/ui`, bukan diduplikasi per app.
- Realtime (order/kitchen/customer display sync) lewat Socket.IO events yang sudah didefinisikan di [docs/07-realtime-architecture.md](docs/07-realtime-architecture.md) — jangan buat channel/event ad-hoc tanpa mendokumentasikannya di sana.

### Shared Packages

- Tipe yang dipakai backend **dan** frontend (User, Order, Product, Customer, Reservation, Promotion, dll.) didefinisikan sekali di `packages/types`, tidak diduplikasi.
- API call dari frontend selalu lewat `packages/api-client` (Axios + auth + refresh token + error handler), jangan panggil `fetch`/`axios` langsung di komponen/feature.
- Formatting currency/date/tax ada di `packages/utils` — jangan reimplement di masing-masing app.

## Konvensi Kode

- **TypeScript strict** di seluruh codebase, tidak ada `any` tanpa alasan kuat (kalau perlu, beri komentar singkat kenapa).
- Tidak ada logic bisnis yang hanya bisa diakses lewat satu app tertentu — API-first, semua lewat endpoint backend agar mobile app di masa depan bisa reuse.
- Uang dan stok pakai tipe `Decimal` (Prisma), **jangan** `Float`, untuk menghindari rounding error.
- Ikuti prinsip lengkap di [docs/12-development-principles.md](docs/12-development-principles.md).

## Yang Harus Dihindari

- Jangan menaruh query Prisma langsung di controller atau di komponen frontend.
- Jangan membuat abstraksi/helper baru sebelum ada ≥2 use case nyata yang membutuhkannya.
- Jangan menambah dependency baru di luar stack yang sudah ditetapkan di [docs/02-tech-stack.md](docs/02-tech-stack.md) tanpa konfirmasi ke user — termasuk mengganti Prisma/Zod/Socket.IO/BullMQ dengan alternatif lain.
- Jangan mengubah struktur monorepo ([docs/03-monorepo-structure.md](docs/03-monorepo-structure.md)) tanpa alasan kuat — konsistensi struktur antar `apps/*` dan `packages/*` dijaga sejak awal.
- Jangan menjalankan proses berat (AI/export/notifikasi/printer) secara sinkron — selalu lewat queue.

## Urutan Implementasi

Ikuti roadmap fase di [docs/13-roadmap.md](docs/13-roadmap.md) — Phase 1 (Foundation: monorepo, auth, role & permission, settings, dashboard) harus selesai dulu sebelum module lain, karena module lain bergantung pada auth & permission.

## Referensi Dokumentasi

Semua keputusan arsitektur detail ada di [docs/](docs/00-index.md). Kalau ada ambiguitas antara instruksi user dan isi `docs/`, konfirmasi ke user sebelum menyimpang dari dokumen yang sudah disepakati.
