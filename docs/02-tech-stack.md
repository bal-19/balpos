# 2. Tech Stack

## Monorepo

- TurboRepo
- Bun Workspace

## Backend

- Node.js 24 LTS
- Express.js
- TypeScript
- Prisma ORM
- Zod
- Socket.IO
- BullMQ
- Redis
- Scalar (OpenAPI Documentation)

## Frontend

### Dashboard (Admin & POS)

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Zustand
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Zod
- PWA

### Customer Display

- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- PWA

### Kitchen Display System

- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- PWA

### QR Table Ordering

- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- PWA

## Database

- Supabase PostgreSQL

## Storage

- Supabase Storage

## Queue

- Redis
- BullMQ

## Realtime

- Socket.IO

## Payment

- Cash
- Xendit (QRIS, Virtual Account, E-Wallet)

## AI

- Google Gemini API

## Voice/TTS

- Google TTS (Voice Announcement)

## Deployment

- Docker
- Docker Compose

## Alasan Pemilihan (Ringkas)

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Monorepo tooling | TurboRepo + Bun | Build cache cepat, task orchestration antar apps/packages |
| Type-safety end-to-end | TypeScript + Zod + Prisma | Satu sumber tipe dari DB hingga UI |
| Realtime order/kitchen sync | Socket.IO | Battle-tested, mudah scale dengan Redis adapter |
| Background job berat (AI, export, notif) | BullMQ + Redis | Retry, delay, prioritas job |
| API docs | Scalar | Generate dari OpenAPI spec Express |
| DB & Storage | Supabase | Postgres managed + storage + siap multi-tenant (RLS) |
| Payment lokal Indonesia | Xendit | Dukungan QRIS, VA, e-wallet |
| AI insight | Google Gemini API | Analisis bahasa natural atas data penjualan |
