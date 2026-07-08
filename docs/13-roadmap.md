# 13. Roadmap Pengembangan

## Phase 1 — Foundation
- Monorepo
- Authentication
- Role & Permission
- Settings
- Dashboard

## Phase 2 — Restaurant Operations
- POS
- Customer Display
- QR Table Ordering
- Kitchen Display System
- Payment
- Voice Announcement

## Phase 3 — Business Management
- Inventory
- Recipe Management
- Supplier
- CRM
- Promo
- Reservasi Meja

## Phase 4 — Analytics
- Report
- Audit Log
- AI Analytics

## Phase 5 — Production Ready
- Notification
- Printer
- PWA
- Performance Optimization
- Testing

## Phase 6 — SaaS
- Multi Tenant
- Multi Outlet
- Subscription
- Billing

---

## Catatan Urutan Ketergantungan

- **Phase 1** wajib selesai dulu karena Auth & Role/Permission menjadi dependency semua module lain.
- **Phase 2** adalah inti operasional harian (MVP fungsional minimum untuk dipakai 1 outlet nyata).
- **Phase 3** melengkapi kebutuhan manajemen bisnis di luar transaksi harian.
- **Phase 4** bisa berjalan paralel dengan akhir Phase 3 karena bergantung pada data historis dari Phase 2 & 3.
- **Phase 5** adalah pengerasan (hardening) sebelum go-live produksi skala nyata.
- **Phase 6** dibangun terakhir, memanfaatkan `outletId`/`tenantId` yang sudah disiapkan sejak Phase 1 (lihat [Data Model](./11-data-model.md)) sehingga tidak memerlukan migrasi ulang skema besar-besaran.
