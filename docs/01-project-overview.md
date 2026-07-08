# 1. Project Overview

## Deskripsi

Restaurant POS & CRM adalah aplikasi berbasis web yang dirancang untuk membantu operasional restoran, café, coffee shop, dan bisnis F&B secara menyeluruh dalam satu platform. Sistem ini mengintegrasikan proses pemesanan, pembayaran, dapur, inventaris, CRM, laporan, hingga analisis bisnis berbasis AI dengan arsitektur modern yang scalable dan mudah dipelihara.

Aplikasi dikembangkan menggunakan **TypeScript-first architecture**, **Monorepo**, dan **Docker**, sehingga siap berkembang dari single outlet (MVP) menjadi platform SaaS multi-tenant tanpa perubahan arsitektur yang signifikan.

## Tujuan

- Mempercepat proses transaksi.
- Mengurangi kesalahan operasional.
- Mempermudah pengelolaan restoran.
- Mengotomatisasi pengelolaan stok.
- Menyediakan insight bisnis menggunakan AI.
- Menjadi fondasi platform SaaS untuk banyak tenant.

## Visi

Membangun Restaurant POS & CRM modern yang cepat, modular, dan mudah dipelihara dengan arsitektur berbasis TypeScript, Monorepo, dan Docker, sehingga mampu melayani kebutuhan bisnis F&B dari skala UMKM hingga jaringan restoran multi-outlet, sekaligus menjadi fondasi kuat untuk berkembang menjadi platform SaaS yang andal dan mudah dikembangkan di masa depan.

## Target Pengguna

| Role | Deskripsi Singkat |
|---|---|
| Owner | Pemilik bisnis, akses penuh termasuk laporan & AI analytics |
| Admin | Mengelola operasional, master data, pengaturan |
| Cashier | Operasional kasir/POS harian |
| Kitchen | Mengelola Kitchen Display System |
| Waiter | Mengelola pesanan meja, reservasi, QR ordering |

## Lingkup MVP vs SaaS

- **MVP**: single outlet, seluruh fitur operasional (POS, KDS, Customer Display, Inventory, CRM, Report, AI Analytics) berjalan penuh untuk satu tenant/outlet.
- **SaaS (fase akhir)**: multi-tenant, multi-outlet, subscription & billing — dibangun di atas fondasi arsitektur yang sama tanpa migrasi besar.
