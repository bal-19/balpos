# 9. API Documentation

Menggunakan **Scalar** untuk dokumentasi API interaktif, digenerate dari OpenAPI spec.

## Flow

```
Express
  ↓
OpenAPI
  ↓
Scalar
```

## Pendekatan

- Setiap route Express didefinisikan dengan metadata OpenAPI (path, method, request schema, response schema, tags per module).
- Zod schema pada layer `schema/` (lihat [Backend Architecture](./04-backend-architecture.md)) dijadikan sumber tunggal untuk validasi **dan** dokumentasi (misal via `zod-to-openapi` atau pendekatan sejenis), sehingga dokumentasi tidak pernah "basi" dibanding implementasi.
- OpenAPI spec (JSON/YAML) disajikan lewat endpoint khusus (misal `/openapi.json`), lalu Scalar merender UI dokumentasi interaktif dari spec tersebut (misal di `/docs` pada API).
- Tags di OpenAPI dikelompokkan per module (`auth`, `pos`, `kitchen`, `inventory`, dst.) agar dokumentasi mudah dinavigasi.

## Prinsip

- **API-first**: dokumentasi ini juga berfungsi sebagai kontrak untuk integrasi mobile app di masa depan tanpa perlu membaca source code backend.
- Setiap endpoint baru **wajib** terdokumentasi sebelum dianggap selesai (definition of done).
