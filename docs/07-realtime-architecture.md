# 7. Realtime Architecture

Menggunakan **Socket.IO**.

## Flow

```
POS
  ↓
Socket.IO
  ↓
Kitchen Display
  ↓
Customer Display
  ↓
Dashboard
```

Semua perubahan order akan diperbarui secara realtime ke seluruh permukaan aplikasi yang relevan.

## Contoh Event (Draft)

| Event | Trigger | Konsumer |
|---|---|---|
| `order:created` | Kasir membuat order baru / customer checkout QR ordering | Kitchen Display, Customer Display, Dashboard |
| `order:item.updated` | Status item order berubah (misal: cooking → ready) | Kitchen Display, Customer Display, Waiter |
| `order:completed` | Order selesai dibayar | Dashboard, CRM (update point), Notification |
| `payment:status.updated` | Status pembayaran Xendit berubah (webhook) | Customer Display, POS |
| `table:status.updated` | Status meja berubah (kosong/terisi/reserved) | Dashboard, Waiter, Reservation |
| `stock:low` | Stok di bawah ambang batas | Dashboard, Notification |
| `kitchen:ready` | Order dari dapur siap → trigger voice announcement | Voice Announcement Service, Waiter |

## Prinsip

- Event dipublish dari **Service layer** backend (bukan dari controller), setelah operasi database berhasil.
- Setiap event di-scope per **outlet/tenant** (room Socket.IO per outlet) — penting agar arsitektur langsung siap multi-outlet/multi-tenant sejak awal.
- Untuk proses yang membutuhkan efek samping berat (voice announcement, export, notifikasi eksternal), event trigger **queue job** (BullMQ) — Socket.IO hanya untuk update UI realtime yang ringan.
- Reconnection handling: seluruh frontend app (khususnya KDS & Customer Display) harus melakukan **resync** data via TanStack Query saat reconnect, karena event yang lewat saat disconnect tidak akan di-replay otomatis.
