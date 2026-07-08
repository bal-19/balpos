import { z } from "zod";

const decimalQty = z.string().regex(/^\d+(\.\d{1,3})?$/, "Harus angka, contoh 10 atau 2.5");
const decimalMoney = z.string().regex(/^\d+(\.\d{1,2})?$/, "Harus angka, contoh 15000");

const purchaseOrderItemSchema = z.object({
  stockItemId: z.string().min(1),
  quantity: decimalQty,
  unitCost: decimalMoney,
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier wajib dipilih"),
  notes: z.string().nullable().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "Purchase order harus punya minimal 1 item"),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
