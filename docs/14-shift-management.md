# 14. Shift Management (Session Kasir)

## Overview

Shift Management adalah sistem untuk mencatat sesi kasir (kasir buka/tutup) yang digunakan untuk:

- **Akuntabilitas** — mencatat siapa yang buka/tutup kasir dan kapan
- **Rekonsiliasi kas** — memastikan kas fisik sesuai dengan transaksi
- **Audit trail** — riwayat lengkap operasional kasir per shift
- **Laporan shift** — analisis performa per kasir/shift

## Business Rules

### Open Shift (Buka Sesi Kasir)

1. Hanya bisa ada **1 shift aktif** per outlet pada satu waktu
2. Kasir harus memasukkan **kas awal** (opening balance) saat membuka shift
3. Kas awal tidak boleh negatif
4. User harus punya permission `pos.shift.manage`
5. Shift yang dibuka akan otomatis terhubung dengan semua order yang dibuat di outlet tersebut

### Close Shift (Tutup Sesi Kasir)

1. Harus ada shift aktif yang sedang berjalan
2. Kasir harus memasukkan **kas akhir** (closing balance) — kas fisik yang dihitung
3. Sistem akan otomatis menghitung:
    - **Expected Balance** = Opening Balance + Total Cash Sales (hanya order CASH yang COMPLETED)
    - **Variance** = Closing Balance - Expected Balance
4. Variance positif = ada kelebihan kas (cash over)
5. Variance negatif = ada kekurangan kas (cash short)
6. Kasir bisa menambahkan catatan (notes) opsional untuk menjelaskan variance
7. Setelah ditutup, shift tidak bisa dibuka kembali atau diubah

### View Shift

1. **Current shift** — melihat shift yang sedang aktif (untuk monitoring realtime)
2. **Shift history** — melihat riwayat shift (dengan paginasi & filter)
3. **Shift detail** — melihat detail shift tertentu (untuk audit)

## API Endpoints

### GET `/api/pos/shifts/current`

Mendapatkan shift yang sedang aktif untuk outlet user yang login.

**Permission:** `pos.shift.view`

**Response:**

```json
{
    "id": "clt1234567890",
    "outletId": "outlet-123",
    "openedBy": "user-456",
    "openedByName": "John Doe",
    "closedBy": null,
    "closedByName": null,
    "openingBalance": "500000.00",
    "closingBalance": null,
    "expectedBalance": null,
    "variance": null,
    "cashSalesSoFar": "1250000.00",
    "status": "OPEN",
    "notes": null,
    "openedAt": "2026-07-09T08:00:00.000Z",
    "closedAt": null
}
```

Jika tidak ada shift aktif, response: `null`

---

### GET `/api/pos/shifts/history`

Mendapatkan riwayat shift dengan paginasi dan filter.

**Permission:** `pos.shift.view`

**Query Parameters:**

- `page` (optional, default: 1) — halaman saat ini
- `limit` (optional, default: 20) — jumlah item per halaman
- `status` (optional) — filter berdasarkan status: `OPEN` atau `CLOSED`
- `startDate` (optional) — filter shift yang dibuka >= tanggal ini (ISO 8601)
- `endDate` (optional) — filter shift yang dibuka <= tanggal ini (ISO 8601)

**Response:**

```json
{
    "shifts": [
        {
            "id": "clt1234567890",
            "outletId": "outlet-123",
            "openedBy": "user-456",
            "openedByName": "John Doe",
            "closedBy": "user-456",
            "closedByName": "John Doe",
            "openingBalance": "500000.00",
            "closingBalance": "1755000.00",
            "expectedBalance": "1750000.00",
            "variance": "5000.00",
            "cashSalesSoFar": "1250000.00",
            "status": "CLOSED",
            "notes": "Kelebihan Rp 5.000 dari uang kembalian yang tidak diambil pelanggan",
            "openedAt": "2026-07-08T08:00:00.000Z",
            "closedAt": "2026-07-08T20:00:00.000Z"
        }
    ],
    "total": 45,
    "page": 1,
    "limit": 20
}
```

---

### GET `/api/pos/shifts/:id`

Mendapatkan detail shift tertentu.

**Permission:** `pos.shift.view`

**Response:**

```json
{
    "id": "clt1234567890",
    "outletId": "outlet-123",
    "openedBy": "user-456",
    "openedByName": "John Doe",
    "closedBy": "user-456",
    "closedByName": "John Doe",
    "openingBalance": "500000.00",
    "closingBalance": "1755000.00",
    "expectedBalance": "1750000.00",
    "variance": "5000.00",
    "cashSalesSoFar": "1250000.00",
    "status": "CLOSED",
    "notes": "Kelebihan Rp 5.000 dari uang kembalian yang tidak diambil pelanggan",
    "openedAt": "2026-07-08T08:00:00.000Z",
    "closedAt": "2026-07-08T20:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` — shift tidak ditemukan

---

### POST `/api/pos/shifts/open`

Membuka sesi kasir baru.

**Permission:** `pos.shift.manage`

**Request Body:**

```json
{
    "openingBalance": "500000.00"
}
```

**Validation:**

- `openingBalance` harus berupa string numerik dengan maksimal 2 desimal (contoh: "500000", "500000.50")
- `openingBalance` tidak boleh negatif

**Response:** `201 Created`

```json
{
    "id": "clt1234567890",
    "outletId": "outlet-123",
    "openedBy": "user-456",
    "openedByName": "John Doe",
    "closedBy": null,
    "closedByName": null,
    "openingBalance": "500000.00",
    "closingBalance": null,
    "expectedBalance": null,
    "variance": null,
    "cashSalesSoFar": "0.00",
    "status": "OPEN",
    "notes": null,
    "openedAt": "2026-07-09T08:00:00.000Z",
    "closedAt": null
}
```

**Error Responses:**

- `400 Bad Request` — sudah ada shift yang sedang aktif
- `400 Bad Request` — validasi input gagal

---

### POST `/api/pos/shifts/close`

Menutup sesi kasir yang sedang aktif.

**Permission:** `pos.shift.manage`

**Request Body:**

```json
{
    "closingBalance": "1755000.00",
    "notes": "Kelebihan Rp 5.000 dari uang kembalian yang tidak diambil pelanggan"
}
```

**Validation:**

- `closingBalance` harus berupa string numerik dengan maksimal 2 desimal
- `closingBalance` tidak boleh negatif
- `notes` (optional) — maksimal 500 karakter

**Response:** `200 OK`

```json
{
    "id": "clt1234567890",
    "outletId": "outlet-123",
    "openedBy": "user-456",
    "openedByName": "John Doe",
    "closedBy": "user-456",
    "closedByName": "John Doe",
    "openingBalance": "500000.00",
    "closingBalance": "1755000.00",
    "expectedBalance": "1750000.00",
    "variance": "5000.00",
    "cashSalesSoFar": "1250000.00",
    "status": "CLOSED",
    "notes": "Kelebihan Rp 5.000 dari uang kembalian yang tidak diambil pelanggan",
    "openedAt": "2026-07-09T08:00:00.000Z",
    "closedAt": "2026-07-09T20:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` — tidak ada shift yang sedang aktif
- `400 Bad Request` — validasi input gagal

---

## Database Schema

```prisma
model Shift {
  id              String      @id @default(cuid())
  outletId        String
  openedBy        String
  closedBy        String?
  openingBalance  Decimal     @db.Decimal(12, 2)
  closingBalance  Decimal?    @db.Decimal(12, 2)
  expectedBalance Decimal?    @db.Decimal(12, 2)
  variance        Decimal?    @db.Decimal(12, 2)
  status          ShiftStatus @default(OPEN)
  notes           String?
  openedAt        DateTime    @default(now())
  closedAt        DateTime?

  outlet       Outlet  @relation(fields: [outletId], references: [id], onDelete: Cascade)
  openedByUser User    @relation("ShiftOpenedBy", fields: [openedBy], references: [id])
  closedByUser User?   @relation("ShiftClosedBy", fields: [closedBy], references: [id])
  orders       Order[]

  @@index([outletId, status])
  @@map("shifts")
}

enum ShiftStatus {
  OPEN
  CLOSED
}
```

## Realtime Events

### `pos:shift.updated`

Dipanggil saat shift dibuka atau ditutup untuk notifikasi realtime ke semua user di outlet tersebut.

**Payload:**

```typescript
{
    status: "OPEN" | "CLOSED";
}
```

**Socket Room:** `outlet:${outletId}`

## Integration Points

### 1. Order Module

Saat order POS dibuat, sistem akan:

1. Cek apakah ada shift aktif untuk outlet tersebut
2. Jika tidak ada → error "Sesi kasir belum dibuka"
3. Jika ada → order akan terhubung dengan shift tersebut (`order.shiftId`)

### 2. Report Module

Shift history bisa digunakan untuk:

- Laporan performa kasir (total sales per shift)
- Analisis variance kas (shift mana yang sering ada selisih)
- Audit trail operasional kasir

### 3. Dashboard Module

Dashboard bisa menampilkan:

- Status shift saat ini (open/closed)
- Ringkasan shift hari ini (jumlah transaksi, total sales)

## Best Practices

1. **Buka shift di awal operasional** — sebelum menerima order pertama
2. **Hitung kas fisik dengan teliti** saat close shift untuk menghindari variance besar
3. **Catat notes** jika ada variance untuk audit trail
4. **Review variance** secara berkala untuk mengidentifikasi masalah operasional
5. **Training kasir** tentang pentingnya akurasi dalam menghitung kas

## Frontend Implementation Notes

### Dashboard App

**ShiftBar Component** — komponen yang selalu terlihat di header/sidebar untuk menampilkan:

- Status shift saat ini (OPEN/CLOSED)
- Tombol "Buka Shift" jika belum ada shift aktif
- Tombol "Tutup Shift" jika ada shift aktif
- Kas awal & kas penjualan saat ini (realtime)

**Shift History Page** — halaman untuk melihat:

- Table riwayat shift dengan kolom: tanggal, kasir, kas awal, kas akhir, variance
- Filter berdasarkan status dan rentang tanggal
- Detail shift (modal/drawer) saat klik row

**Open Shift Dialog:**

```typescript
interface OpenShiftForm {
    openingBalance: string; // input text untuk Rupiah
}
```

**Close Shift Dialog:**

```typescript
interface CloseShiftForm {
    closingBalance: string; // input text untuk Rupiah
    notes?: string; // textarea optional
}

// Tampilkan di UI sebelum submit:
// - Kas Awal: Rp 500.000
// - Penjualan Cash: Rp 1.250.000
// - Kas Seharusnya: Rp 1.750.000
// - Kas Akhir (input): Rp 1.755.000
// - Selisih: Rp 5.000 (LEBIH) - tampilkan dengan warna hijau/merah
```

### POS Integration

Sebelum checkout, sistem harus:

1. Cek apakah ada shift aktif
2. Jika tidak ada → tampilkan error "Sesi kasir belum dibuka"
3. Redirect ke dialog Open Shift

## Troubleshooting

### Error: "Sesi kasir belum dibuka"

**Solusi:** Buka shift terlebih dahulu sebelum membuat order

### Error: "Sesi kasir sudah dibuka"

**Solusi:** Tutup shift yang sedang aktif sebelum membuka shift baru

### Variance terlalu besar

**Investigasi:**

- Cek transaksi yang dilakukan selama shift tersebut
- Pastikan semua order CASH sudah tercatat dengan benar
- Review apakah ada transaksi yang dibatalkan
- Periksa apakah ada uang kembalian yang tidak dikembalikan atau kelebihan bayar
