import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi"),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
