# 4. Backend Architecture

Backend menggunakan **Feature-Based Modular Architecture**.

## Struktur Modules

```
src/
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── pos/
│   ├── kitchen/
│   ├── ordering/
│   ├── reservation/
│   ├── inventory/
│   ├── recipe/
│   ├── supplier/
│   ├── crm/
│   ├── promotion/
│   ├── payment/
│   ├── report/
│   ├── notification/
│   ├── printer/
│   ├── ai/
│   └── settings/
│
├── shared/
├── core/
├── config/
└── database/
```

## Struktur per Module

```
module-name/
├── controller/
├── service/
├── repository/
├── routes/
├── dto/
├── schema/
├── types/
├── events/
├── queues/
└── validators/
```

## Aturan Utama

> **Business logic tidak diperbolehkan berada di Controller.**

Controller hanya bertugas menerima request, memanggil service, dan mengembalikan response. Semua logic bisnis (validasi kompleks, kalkulasi, orkestrasi antar repository) berada di **Service**.

## Request Flow

```
Request
  ↓
Controller
  ↓
Action / Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

## Tanggung Jawab per Layer

| Layer | Tanggung Jawab |
|---|---|
| `routes/` | Mendefinisikan endpoint & binding ke controller, middleware (auth, validasi) |
| `controller/` | Terima request, panggil service, bentuk response — tanpa logic bisnis |
| `service/` (Action) | Business logic, orkestrasi antar repository, publish events, dispatch queue jobs |
| `repository/` | Akses data via Prisma, tidak mengandung business logic |
| `dto/` | Data Transfer Object untuk request/response shape |
| `schema/` | Zod schema untuk validasi input |
| `types/` | Tipe khusus module (jika tidak dishare ke `packages/types`) |
| `events/` | Definisi & handler event (misal untuk Socket.IO broadcast) |
| `queues/` | Definisi job & processor BullMQ khusus module |
| `validators/` | Validator tambahan di luar Zod schema (business rule validation) |

## Shared / Core / Config / Database

- **shared/**: utilitas, middleware, response formatter, error classes yang dipakai lintas module.
- **core/**: bootstrap aplikasi (Express app instance, server startup, dependency wiring).
- **config/**: environment variable loader & validasi (Zod), konfigurasi third-party (Redis, Supabase, Xendit, Gemini).
- **database/**: Prisma client instance, migration, seed.

## Prinsip Tambahan

- Setiap module bersifat **self-contained** — idealnya module baru bisa ditambahkan tanpa mengubah module lain secara signifikan.
- Komunikasi antar-module yang butuh side-effect (misal: order selesai → kirim notifikasi → cetak struk → update stok) dilakukan lewat **events** dan/atau **queue jobs**, bukan panggilan langsung antar service yang membuat coupling tinggi.
- Validasi input selalu lewat **Zod schema** di layer `schema/`, dijalankan sebagai middleware sebelum masuk controller.
