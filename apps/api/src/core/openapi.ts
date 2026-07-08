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
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};
