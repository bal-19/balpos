import { z } from "zod";

export const createReservationSchema = z.object({
  tableId: z.string().min(1, "Meja wajib dipilih"),
  customerId: z.string().nullable().optional(),
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().nullable().optional(),
  partySize: z.coerce.number().int().positive("Jumlah tamu minimal 1"),
  reservedAt: z.string().datetime("Format tanggal/waktu tidak valid"),
  notes: z.string().nullable().optional(),
});

export const listReservationsQuerySchema = z.object({
  date: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ListReservationsQuery = z.infer<typeof listReservationsQuerySchema>;
