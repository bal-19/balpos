# 5. Frontend Architecture

Seluruh aplikasi frontend (`dashboard`, `kitchen-display`, `customer-display`, `ordering`) menggunakan **Feature-Based Architecture** yang konsisten.

## Struktur

```
src/
├── features/
│   └── <feature-name>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── routes/
│
├── shared/
├── components/
├── layouts/
├── hooks/
├── services/
├── stores/
├── types/
└── utils/
```

## Isi per Feature

| Bagian | Tanggung Jawab |
|---|---|
| `components/` | UI komponen spesifik untuk feature tersebut |
| `hooks/` | Custom hooks (kombinasi TanStack Query + logic UI) |
| `services/` | Pemanggilan API lewat `packages/api-client` |
| `types/` | Tipe spesifik feature (selain yang di `packages/types`) |
| `routes/` | Definisi route TanStack Router untuk feature ini |

## Bagian Global (`shared/`, root-level folders)

- **components/**: komponen generik lintas-feature yang belum layak masuk `packages/ui`.
- **layouts/**: shell layout (sidebar, header, POS layout, KDS layout, dsb).
- **hooks/**: hooks generik (misal `useDebounce`, `useSocket`, `useAuth`).
- **services/**: instance API client, konfigurasi TanStack Query.
- **stores/**: Zustand store untuk state global (misal cart POS, current shift, active order).
- **types/**: tipe global frontend yang tidak dishare ke backend.
- **utils/**: helper spesifik frontend (formatting UI, dsb — logic umum tetap di `packages/utils`).

## Per Aplikasi

### Dashboard (Admin & POS)
Aplikasi terbesar — menggabungkan POS kasir dan seluruh modul admin (Inventory, CRM, Report, Settings, AI Analytics, dsb). Menggunakan TanStack Router untuk routing berbasis file/struktur, Zustand untuk state POS (cart, shift), React Hook Form + Zod untuk semua form.

### Kitchen Display System
Fokus pada tampilan order realtime dari Socket.IO, minim form, dioptimalkan untuk tablet/layar dapur, PWA agar bisa diinstall dan tetap responsif walau koneksi tidak stabil.

### Customer Display
Read-only display (daftar pesanan, total bayar, QRIS) yang mendengarkan event dari POS lewat Socket.IO. Tidak ada interaksi tulis dari sisi customer display.

### QR Table Ordering
Diakses oleh customer via scan QR meja. Flow: scan → pilih menu → checkout → pantau status. PWA agar experience mendekati native app di HP customer.

## Prinsip Konsistensi

- Semua app berbagi `packages/ui`, `packages/types`, `packages/api-client`, `packages/utils`, sehingga UI dan kontrak data konsisten di semua permukaan aplikasi.
- State server selalu lewat TanStack Query (cache, invalidation), state lokal/UI lewat Zustand — tidak dicampur.
- Validasi form di frontend menggunakan Zod schema yang idealnya identik/diselaraskan dengan schema backend (bisa saling reuse lewat `packages/types` bila skema disusun dari sumber yang sama).
