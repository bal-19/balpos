/**
 * OpenAPI spec (lihat docs/09-api-documentation.md). Setiap module
 * menambahkan path/schema-nya sendiri saat endpoint diimplementasikan
 * — placeholder ini hanya menyiapkan dokumen dasar agar Scalar UI aktif.
 */
export const openApiDocument = {
    openapi: "3.1.0",
    info: {
        title: "Restaurant POS & CRM API",
        version: "0.0.1",
        description:
            "API documentation — endpoint ditambahkan per module mulai Phase 1.",
    },
    servers: [{ url: "/api" }],
    tags: [
        { name: "auth", description: "Login, refresh token, session" },
        {
            name: "settings",
            description: "Store settings, theme, category & product catalog",
        },
        { name: "pos", description: "POS ordering (tables, orders)" },
        {
            name: "dashboard",
            description: "Dashboard overview & report aggregation",
        },
        {
            name: "kitchen",
            description: "Kitchen Display System — order aktif & status masak",
        },
        {
            name: "ordering",
            description: "QR Table Ordering — publik, tanpa auth",
        },
        { name: "payment", description: "Payment gateway (Xendit) webhook" },
        { name: "inventory", description: "Stok bahan baku & stock movement" },
        { name: "recipe", description: "Resep produk (bahan baku per menu)" },
        { name: "supplier", description: "Supplier & Purchase Order" },
        {
            name: "crm",
            description: "Pelanggan, membership tier & riwayat poin",
        },
        {
            name: "promotion",
            description: "Voucher, discount, happy hour, buy X get Y",
        },
        {
            name: "reservation",
            description: "Reservasi meja (booking, check-in, status meja)",
        },
        {
            name: "report",
            description:
                "Laporan penjualan (filter harian/mingguan/bulanan/custom) & export PDF/Excel",
        },
        {
            name: "audit-log",
            description: "Riwayat aktivitas pengguna (audit log)",
        },
        { name: "ai", description: "AI Analytics — insight berbasis Gemini" },
    ],
    paths: {
        "/auth/login": {
            post: {
                tags: ["auth"],
                summary: "Login dengan email & password",
                responses: {
                    "200": { description: "OK" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/auth/refresh": {
            post: {
                tags: ["auth"],
                summary: "Refresh access token pakai refresh-token cookie",
                responses: {
                    "200": { description: "OK" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/auth/logout": {
            post: {
                tags: ["auth"],
                summary: "Logout",
                responses: { "200": { description: "OK" } },
            },
        },
        "/auth/me": {
            get: {
                tags: ["auth"],
                summary: "Data user yang sedang login",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "OK" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/settings/theme": {
            get: {
                tags: ["settings"],
                summary:
                    "Warna & identitas brand publik (dipakai halaman login)",
                responses: { "200": { description: "OK" } },
            },
        },
        "/settings/store": {
            get: {
                tags: ["settings"],
                summary: "Detail store setting",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            put: {
                tags: ["settings"],
                summary: "Update store setting",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/settings/categories": {
            get: {
                tags: ["settings"],
                summary: "List kategori",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["settings"],
                summary: "Buat kategori",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/settings/products": {
            get: {
                tags: ["settings"],
                summary: "List produk",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["settings"],
                summary: "Buat produk",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/pos/tables": {
            get: {
                tags: ["pos"],
                summary: "List meja outlet",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/pos/orders": {
            post: {
                tags: ["pos"],
                summary: "Buat order (checkout langsung, payment CASH)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "201": { description: "Created" },
                    "400": { description: "Bad Request" },
                },
            },
        },
        "/pos/shifts/current": {
            get: {
                tags: ["pos"],
                summary:
                    "Sesi kasir aktif untuk outlet (null kalau belum dibuka)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/pos/shifts/history": {
            get: {
                tags: ["pos"],
                summary:
                    "Riwayat sesi kasir (dengan paginasi & filter status/tanggal)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/pos/shifts/{id}": {
            get: {
                tags: ["pos"],
                summary: "Detail sesi kasir tertentu",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "OK" },
                    "404": { description: "Not Found" },
                },
            },
        },
        "/pos/shifts/open": {
            post: {
                tags: ["pos"],
                summary: "Buka sesi kasir (input kas awal)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "201": { description: "Created" },
                    "400": { description: "Bad Request" },
                },
            },
        },
        "/pos/shifts/close": {
            post: {
                tags: ["pos"],
                summary: "Tutup sesi kasir (input kas akhir, hitung selisih)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "OK" },
                    "404": { description: "Not Found" },
                },
            },
        },
        "/dashboard/overview": {
            get: {
                tags: ["dashboard"],
                summary: "Ringkasan stat hari ini",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/dashboard/sales-statistic": {
            get: {
                tags: ["dashboard"],
                summary: "Data chart penjualan per kategori",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/dashboard/items-performance": {
            get: {
                tags: ["dashboard"],
                summary: "Produk terlaris (radar chart)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/dashboard/recent-transactions": {
            get: {
                tags: ["dashboard"],
                summary: "Transaksi terbaru",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/kitchen/orders": {
            get: {
                tags: ["kitchen"],
                summary: "Order aktif hari ini (belum semua item READY)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/kitchen/order-items/{id}/status": {
            patch: {
                tags: ["kitchen"],
                summary: "Update status masak item (NEW/PREPARING/READY)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/ordering/context/{tableId}": {
            get: {
                tags: ["ordering"],
                summary: "Menu publik + info meja untuk landing QR",
                responses: {
                    "200": { description: "OK" },
                    "404": { description: "Not Found" },
                },
            },
        },
        "/ordering/orders/{tableId}": {
            post: {
                tags: ["ordering"],
                summary: "Buat order self-service (selalu non-CASH via Xendit)",
                responses: { "201": { description: "Created" } },
            },
        },
        "/ordering/orders/{orderId}/status": {
            get: {
                tags: ["ordering"],
                summary: "Polling status order + pembayaran",
                responses: { "200": { description: "OK" } },
            },
        },
        "/payments/webhook/xendit": {
            post: {
                tags: ["payment"],
                summary: "Callback Xendit (verifikasi x-callback-token)",
                responses: {
                    "200": { description: "OK" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/inventory/stock-items": {
            get: {
                tags: ["inventory"],
                summary: "List stok bahan baku",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["inventory"],
                summary: "Tambah bahan baku",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/inventory/stock-items/{id}/adjust": {
            post: {
                tags: ["inventory"],
                summary: "Sesuaikan stok manual (IN/OUT/ADJUSTMENT)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/recipe/products/{productId}": {
            get: {
                tags: ["recipe"],
                summary: "Lihat resep produk",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            put: {
                tags: ["recipe"],
                summary: "Ganti seluruh ingredient resep produk",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/supplier/suppliers": {
            get: {
                tags: ["supplier"],
                summary: "List supplier",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["supplier"],
                summary: "Buat supplier",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/supplier/purchase-orders": {
            get: {
                tags: ["supplier"],
                summary: "List purchase order",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["supplier"],
                summary: "Buat purchase order",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/supplier/purchase-orders/{id}/receive": {
            patch: {
                tags: ["supplier"],
                summary: "Terima barang (increment stok + StockMovement IN)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/crm/customers": {
            get: {
                tags: ["crm"],
                summary: "List pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["crm"],
                summary: "Buat pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/crm/customers/{id}": {
            get: {
                tags: ["crm"],
                summary: "Detail pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            patch: {
                tags: ["crm"],
                summary: "Update pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            delete: {
                tags: ["crm"],
                summary: "Hapus (soft delete) pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/crm/customers/{id}/points": {
            get: {
                tags: ["crm"],
                summary: "Riwayat poin pelanggan",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/crm/membership-tiers": {
            get: {
                tags: ["crm"],
                summary: "List membership tier",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["crm"],
                summary: "Buat membership tier",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/crm/membership-tiers/{id}": {
            patch: {
                tags: ["crm"],
                summary: "Update membership tier",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            delete: {
                tags: ["crm"],
                summary: "Hapus membership tier",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/promotion/promotions": {
            get: {
                tags: ["promotion"],
                summary: "List promo",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["promotion"],
                summary: "Buat promo (voucher/discount/happy hour/buy x get y)",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/promotion/promotions/{id}": {
            patch: {
                tags: ["promotion"],
                summary: "Update promo",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            delete: {
                tags: ["promotion"],
                summary: "Hapus promo",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/reservation/reservations": {
            get: {
                tags: ["reservation"],
                summary: "List reservasi (filter tanggal/status)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["reservation"],
                summary: "Buat reservasi meja (booking)",
                security: [{ bearerAuth: [] }],
                responses: { "201": { description: "Created" } },
            },
        },
        "/reservation/reservations/{id}/confirm": {
            patch: {
                tags: ["reservation"],
                summary: "Konfirmasi reservasi — meja jadi RESERVED",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/reservation/reservations/{id}/check-in": {
            patch: {
                tags: ["reservation"],
                summary: "Check-in tamu — meja jadi OCCUPIED",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/reservation/reservations/{id}/complete": {
            patch: {
                tags: ["reservation"],
                summary: "Selesaikan reservasi — meja jadi AVAILABLE",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/reservation/reservations/{id}/cancel": {
            patch: {
                tags: ["reservation"],
                summary: "Batalkan reservasi",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/reservation/reservations/{id}/no-show": {
            patch: {
                tags: ["reservation"],
                summary: "Tandai tamu tidak datang (no-show)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/report/summary": {
            get: {
                tags: ["report"],
                summary:
                    "Ringkasan laporan penjualan (filter harian/mingguan/bulanan/custom)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/report/export": {
            post: {
                tags: ["report"],
                summary: "Antrikan job export PDF/Excel",
                security: [{ bearerAuth: [] }],
                responses: { "202": { description: "Accepted" } },
            },
        },
        "/report/exports": {
            get: {
                tags: ["report"],
                summary: "Riwayat export job",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/report/exports/{id}": {
            get: {
                tags: ["report"],
                summary: "Detail status export job",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "OK" },
                    "404": { description: "Not Found" },
                },
            },
        },
        "/audit-log": {
            get: {
                tags: ["audit-log"],
                summary: "List audit log (filter user/method/path/tanggal)",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
        },
        "/ai/insights": {
            get: {
                tags: ["ai"],
                summary: "List insight yang sudah dibuat",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: ["ai"],
                summary:
                    "Minta insight baru (antri job, atau langsung 200 kalau masih cache)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "OK (cached)" },
                    "202": { description: "Accepted (queued)" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
    },
};
