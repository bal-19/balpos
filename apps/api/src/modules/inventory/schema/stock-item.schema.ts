import { z } from "zod";

const decimalQty = z.string().regex(/^\d+(\.\d{1,3})?$/, "Harus angka, contoh 500 atau 0.5");

export const createStockItemSchema = z.object({
  name: z.string().min(1, "Nama bahan baku wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  currentStock: decimalQty.default("0"),
  minStockThreshold: decimalQty.default("0"),
});

export const updateStockItemSchema = createStockItemSchema.partial();

export const adjustStockSchema = z.object({
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: decimalQty,
  note: z.string().nullable().optional(),
});

export type CreateStockItemInput = z.infer<typeof createStockItemSchema>;
export type UpdateStockItemInput = z.infer<typeof updateStockItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
