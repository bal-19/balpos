import { z } from "zod";

export const reservationFormSchema = z.object({
  tableId: z.string().min(1, "Meja wajib dipilih"),
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().optional(),
  partySize: z.coerce.number().int().positive("Jumlah tamu minimal 1"),
  reservedAt: z.string().min(1, "Tanggal & jam wajib diisi"),
  notes: z.string().optional(),
});
export type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Terkonfirmasi",
  SEATED: "Sedang Berlangsung",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  NO_SHOW: "Tidak Datang",
};
