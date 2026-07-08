import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().nullable().optional(),
});

export const createPublicOrderSchema = z.object({
  customerName: z.string().min(1, "Nama wajib diisi"),
  paymentMethod: z.enum(["QRIS", "DEBIT_CREDIT", "E_WALLET"]).default("QRIS"),
  items: z.array(orderItemSchema).min(1, "Order harus punya minimal 1 item"),
});

export type CreatePublicOrderInput = z.infer<typeof createPublicOrderSchema>;
