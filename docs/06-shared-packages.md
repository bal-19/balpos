# 6. Shared Packages

## `packages/ui`

Komponen reusable dipakai lintas aplikasi frontend, dibangun di atas shadcn/ui + Tailwind CSS v4.

- Button
- Dialog
- Modal
- Table
- Form
- Sidebar
- Charts
- Receipt
- Badge

## `packages/types`

Shared interface antara backend dan frontend — kontrak data utama platform.

- User
- Order
- Product
- Supplier
- Customer
- Reservation
- Promotion

> Tipe lain (mis. `Table`, `StockItem`, `Recipe`, `Payment`, `AuditLog`) akan ditambahkan sesuai kebutuhan module — lihat [Data Model](./11-data-model.md).

## `packages/api-client`

Shared API client, dipakai semua frontend apps.

- Axios instance
- Authentication (attach token)
- Refresh Token (interceptor otomatis)
- Error Handler (normalisasi error response dari API)

## `packages/utils`

- Currency Formatter (format Rupiah)
- Date Formatter
- Tax Calculator
- Helper (generic utility functions)
- Constants (enum-like constants yang dishare)

## `packages/config`

Shared configuration lintas app/backend, misalnya skema environment variable, konstanta konfigurasi non-secret.

## `packages/eslint-config` & `packages/tsconfig`

Base config lint & TypeScript yang di-extend oleh setiap `apps/*` dan `packages/*` agar konsisten di seluruh monorepo.
