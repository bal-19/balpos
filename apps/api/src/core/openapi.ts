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
  paths: {},
};
