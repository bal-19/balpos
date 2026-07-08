# 10. Fitur (Features)

## 1. POS (Kasir)

- Open Shift
- Close Shift
- Checkout
- Hold Order
- Split Bill
- Multi Payment
- Receipt
- Shortcut Keyboard

## 2. Customer Display

- Daftar pesanan
- Total pembayaran
- QRIS
- Status pembayaran

## 3. QR Table Ordering

- Scan QR
- Pilih menu
- Checkout
- Status pesanan

## 4. Kitchen Display System

- Order realtime
- Timer
- Status memasak
- Ready Order

## 5. Voice Announcement

Pengumuman otomatis, contoh: *"Meja nomor 12 sudah selesai."* Menggunakan **Google TTS**, dipicu saat status order menjadi `ready` di Kitchen Display System, dijalankan lewat queue job (lihat [Queue Architecture](./08-queue-architecture.md)).

## 6. Dashboard

- Omset
- Total transaksi
- Customer
- Menu terlaris
- Grafik

## 7. Report

**Filter:**
- Harian
- Mingguan
- Bulanan
- Custom

**Export:**
- PDF
- Excel

## 8. CRM

- Data pelanggan
- Membership
- Point
- Riwayat transaksi

## 9. Promo

- Voucher
- Discount
- Happy Hour
- Buy X Get Y

## 10. Payment

- Cash
- Xendit
  - QRIS
  - Virtual Account
  - E-Wallet

## 11. Inventory

- Stock
- Stock Movement
- Low Stock Alert

## 12. Recipe Management

- Resep menu
- Pengurangan stok otomatis (saat order dikonfirmasi, stok bahan baku berkurang sesuai resep)

## 13. Supplier

- Supplier
- Purchase Order
- Barang Masuk

## 14. Role & Permission

- Owner
- Admin
- Cashier
- Kitchen
- Waiter

## 15. Notification

- Order baru
- Order selesai
- Low Stock

Realtime (lihat [Realtime Architecture](./07-realtime-architecture.md)).

## 16. Printer

- Kitchen Printer
- Receipt Printer

## 17. Audit Log

Mencatat seluruh aktivitas pengguna (siapa, apa, kapan, data sebelum/sesudah bila relevan).

## 18. Settings

- Profil toko
- Pajak
- Printer
- Payment
- Logo

## 19. Progressive Web App (PWA)

- Install sebagai aplikasi
- Offline asset caching
- Responsive

## 20. SaaS (Tahap Akhir)

- Multi Tenant
- Multi Outlet
- Subscription
- Billing

## 21. Reservasi Meja

- Booking
- Check In
- Jadwal
- Status meja

## 22. AI Analytics (Gemini)

Pemilik dapat meminta analisis seperti:

- Menu terlaris
- Jam tersibuk
- Prediksi restock
- Produk yang mulai jarang terjual
- Ringkasan penjualan
- Insight peningkatan bisnis

---

## Pemetaan Fitur ke Backend Module

| Fitur | Module Backend |
|---|---|
| POS, Split Bill, Multi Payment | `pos` |
| Customer Display | `pos` (event consumer, tanpa module backend sendiri) |
| QR Table Ordering | `ordering` |
| Kitchen Display System, Voice Announcement | `kitchen` |
| Dashboard, Report | `dashboard`, `report` |
| CRM, Membership, Point | `crm` |
| Promo | `promotion` |
| Payment (Cash, Xendit) | `payment` |
| Inventory, Low Stock Alert | `inventory` |
| Recipe Management | `recipe` |
| Supplier, Purchase Order | `supplier` |
| Role & Permission | `auth` |
| Notification | `notification` |
| Printer | `printer` |
| Audit Log | `shared`/`core` (cross-cutting, dicatat lewat middleware/event listener) |
| Settings | `settings` |
| Reservasi Meja | `reservation` |
| AI Analytics | `ai` |
| SaaS (Multi Tenant, Billing) | module baru di Phase 6, lihat [Roadmap](./13-roadmap.md) |
