# 11. Data Model / ERD Draft

> Dokumen ini adalah **draft awal** entitas utama berdasarkan fitur yang didefinisikan. Skema final akan dituangkan sebagai Prisma schema (`schema.prisma`) saat fase implementasi, dan bisa berubah setelah review.

## Entitas Utama

### Identity & Access
- **Tenant** *(disiapkan sejak awal untuk SaaS, default 1 row di MVP)*
- **Outlet** (belongs to Tenant)
- **User** (belongs to Outlet/Tenant)
- **Role**, **Permission**, **RolePermission**

### POS & Ordering
- **Table** (meja, belongs to Outlet)
- **Order**
- **OrderItem**
- **Shift** (open/close shift kasir)
- **Payment** (metode, status, referensi Xendit)
- **Reservation**

### Produk & Menu
- **Category**
- **Product** (menu item)
- **ProductVariant** (opsional: size, topping)
- **Recipe**
- **RecipeIngredient**

### Inventory & Supplier
- **StockItem** (bahan baku)
- **StockMovement**
- **Supplier**
- **PurchaseOrder**
- **PurchaseOrderItem**
- **GoodsReceipt** (barang masuk)

### CRM & Promotion
- **Customer**
- **MembershipTier**
- **CustomerPoint** / **PointHistory**
- **Promotion** (voucher, discount, happy hour, buy X get Y)

### Reporting & System
- **AuditLog**
- **Notification**
- **AiInsight** (hasil analisis Gemini, cached)
- **StoreSetting** (profil toko, pajak, printer, payment, logo)

## Relasi Kunci (Ringkas)

```
Tenant 1---N Outlet
Outlet 1---N User
Outlet 1---N Table
Outlet 1---N Product
Outlet 1---N StockItem
Outlet 1---N Order

Order 1---N OrderItem
Order 1---N Payment
Order N---1 Table
Order N---1 Customer (nullable, walk-in tanpa customer)
Order N---1 Shift

Product 1---1 Recipe
Recipe 1---N RecipeIngredient
RecipeIngredient N---1 StockItem

Supplier 1---N PurchaseOrder
PurchaseOrder 1---N PurchaseOrderItem
PurchaseOrder 1---1 GoodsReceipt

Customer 1---N Order
Customer 1---1 MembershipTier (opsional)
Customer 1---N PointHistory

Promotion N---N Order (lewat tabel pivot, misal OrderPromotion)
```

## Prinsip Desain Skema

- Setiap tabel operasional (Order, Table, Product, StockItem, dll.) menyimpan `outletId` sejak awal — walaupun MVP hanya 1 outlet, ini menghindari migrasi besar saat masuk Phase 6 (Multi Outlet/Multi Tenant).
- **Soft delete** dipertimbangkan untuk entitas master data (Product, Customer, Supplier) agar riwayat transaksi tetap valid walau data master diarsipkan.
- **AuditLog** bersifat generic (`entity`, `entityId`, `action`, `actorId`, `before`, `after`, `createdAt`) agar bisa mencatat aktivitas dari module manapun tanpa skema khusus per-module.
- Precision desimal untuk kolom uang & stok mengikuti kebutuhan akuntansi (gunakan `Decimal` Prisma, bukan `Float`).

## Tindak Lanjut

Skema detail per module (kolom, index, constraint) akan disusun sebagai `schema.prisma` pada tahap implementasi Phase 1–3, dan didokumentasikan ulang di sini setelah finalisasi.
