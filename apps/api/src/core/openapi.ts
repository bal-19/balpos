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
    description: "API documentation — endpoint ditambahkan per module mulai Phase 1.",
  },
  servers: [{ url: "/api" }],
  tags: [
    { name: "auth", description: "Login, refresh token, session" },
    { name: "settings", description: "Store settings, theme, category & product catalog" },
    { name: "pos", description: "POS ordering (tables, orders)" },
    { name: "dashboard", description: "Dashboard overview & report aggregation" },
    { name: "kitchen", description: "Kitchen Display System — order aktif & status masak" },
    { name: "ordering", description: "QR Table Ordering — publik, tanpa auth" },
    { name: "payment", description: "Payment gateway (Xendit) webhook" },
    { name: "inventory", description: "Stok bahan baku & stock movement" },
    { name: "recipe", description: "Resep produk (bahan baku per menu)" },
    { name: "supplier", description: "Supplier & Purchase Order" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["auth"],
        summary: "Login dengan email & password",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["auth"],
        summary: "Refresh access token pakai refresh-token cookie",
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/auth/logout": {
      post: { tags: ["auth"], summary: "Logout", responses: { "200": { description: "OK" } } },
    },
    "/auth/me": {
      get: {
        tags: ["auth"],
        summary: "Data user yang sedang login",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/settings/theme": {
      get: {
        tags: ["settings"],
        summary: "Warna & identitas brand publik (dipakai halaman login)",
        responses: { "200": { description: "OK" } },
      },
    },
    "/settings/store": {
      get: { tags: ["settings"], summary: "Detail store setting", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      put: { tags: ["settings"], summary: "Update store setting", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/settings/categories": {
      get: { tags: ["settings"], summary: "List kategori", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["settings"], summary: "Buat kategori", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/settings/products": {
      get: { tags: ["settings"], summary: "List produk", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["settings"], summary: "Buat produk", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/pos/tables": {
      get: { tags: ["pos"], summary: "List meja outlet", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/pos/orders": {
      post: {
        tags: ["pos"],
        summary: "Buat order (checkout langsung, payment CASH)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" } },
      },
    },
    "/dashboard/overview": {
      get: { tags: ["dashboard"], summary: "Ringkasan stat hari ini", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/dashboard/sales-statistic": {
      get: { tags: ["dashboard"], summary: "Data chart penjualan per kategori", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/dashboard/items-performance": {
      get: { tags: ["dashboard"], summary: "Produk terlaris (radar chart)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/dashboard/recent-transactions": {
      get: { tags: ["dashboard"], summary: "Transaksi terbaru", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/kitchen/orders": {
      get: { tags: ["kitchen"], summary: "Order aktif hari ini (belum semua item READY)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/kitchen/order-items/{id}/status": {
      patch: { tags: ["kitchen"], summary: "Update status masak item (NEW/PREPARING/READY)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/ordering/context/{tableId}": {
      get: { tags: ["ordering"], summary: "Menu publik + info meja untuk landing QR", responses: { "200": { description: "OK" }, "404": { description: "Not Found" } } },
    },
    "/ordering/orders/{tableId}": {
      post: { tags: ["ordering"], summary: "Buat order self-service (selalu non-CASH via Xendit)", responses: { "201": { description: "Created" } } },
    },
    "/ordering/orders/{orderId}/status": {
      get: { tags: ["ordering"], summary: "Polling status order + pembayaran", responses: { "200": { description: "OK" } } },
    },
    "/payments/webhook/xendit": {
      post: { tags: ["payment"], summary: "Callback Xendit (verifikasi x-callback-token)", responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } } },
    },
    "/inventory/stock-items": {
      get: { tags: ["inventory"], summary: "List stok bahan baku", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["inventory"], summary: "Tambah bahan baku", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/inventory/stock-items/{id}/adjust": {
      post: { tags: ["inventory"], summary: "Sesuaikan stok manual (IN/OUT/ADJUSTMENT)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/recipe/products/{productId}": {
      get: { tags: ["recipe"], summary: "Lihat resep produk", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      put: { tags: ["recipe"], summary: "Ganti seluruh ingredient resep produk", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
    "/supplier/suppliers": {
      get: { tags: ["supplier"], summary: "List supplier", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["supplier"], summary: "Buat supplier", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/supplier/purchase-orders": {
      get: { tags: ["supplier"], summary: "List purchase order", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["supplier"], summary: "Buat purchase order", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/supplier/purchase-orders/{id}/receive": {
      patch: { tags: ["supplier"], summary: "Terima barang (increment stok + StockMovement IN)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};
