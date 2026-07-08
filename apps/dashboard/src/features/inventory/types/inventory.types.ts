import { z } from "zod";

const decimalQty = z.string().regex(/^\d+(\.\d{1,3})?$/, "Harus angka, contoh 500 atau 0.5");

export const stockItemFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  currentStock: decimalQty,
  minStockThreshold: decimalQty,
});
export type StockItemFormValues = z.infer<typeof stockItemFormSchema>;

export const adjustStockFormSchema = z.object({
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: decimalQty,
  note: z.string().optional(),
});
export type AdjustStockFormValues = z.infer<typeof adjustStockFormSchema>;
