# 8. Queue Architecture

Menggunakan **BullMQ** dengan **Redis** sebagai backing store.

## Task yang Dijalankan Melalui Queue

- AI Analysis (Gemini)
- Notification
- Printer (kitchen printer, receipt printer)
- Voice Announcement (Google TTS)
- Export PDF
- Export Excel
- Email

## Alasan Menggunakan Queue

Proses di atas bersifat **berat, non-blocking, dan boleh eventual** (tidak perlu response instan ke user), sehingga tidak layak dijalankan secara sinkron di request-response cycle API.

## Struktur Job (Draft Konvensi)

| Queue Name | Job | Producer (Module) | Consumer/Processor |
|---|---|---|---|
| `ai-analysis` | `generate-insight` | `ai` | Worker panggil Gemini API, simpan hasil |
| `notification` | `send-notification` | berbagai module (order, inventory) | Worker kirim realtime/notif eksternal |
| `printer` | `print-receipt`, `print-kitchen-ticket` | `pos`, `kitchen` | Worker kirim ke printer service |
| `voice-announcement` | `announce-order-ready` | `kitchen` | Worker panggil Google TTS, broadcast audio |
| `export` | `export-pdf`, `export-excel` | `report` | Worker generate file, upload ke Supabase Storage |
| `email` | `send-email` | `auth`, `notification`, `report` | Worker kirim email (misal invoice, reset password) |

## Prinsip

- Setiap module yang butuh proses berat mendefinisikan queue & job-nya sendiri di folder `queues/` masing-masing (lihat [Backend Architecture](./04-backend-architecture.md)).
- Job harus **idempotent** bila memungkinkan (retry aman tanpa efek ganda), terutama untuk printer & notifikasi.
- Gunakan **job priority** & **retry with backoff** untuk job yang bergantung pada layanan eksternal (Gemini, Google TTS, Xendit callback retry, email provider).
- Hasil job yang perlu diketahui user (misal export selesai) dikembalikan lewat notifikasi realtime (Socket.IO) begitu job selesai, bukan polling dari frontend.
