import { z } from "zod";

const decimalPrice = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Harga harus angka desimal, contoh 15000 atau 15000.50");

export const createProductSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().nullable().optional(),
  price: decimalPrice,
  imageUrl: z.string().url().nullable().optional(),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  categoryId: z.string().min(1).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
