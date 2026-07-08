import { z } from "zod";

const decimalString = z.string().regex(/^\d+(\.\d{1,2})?$/, "Harus angka, contoh 10 atau 10.00");

export const storeSettingFormSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  currency: z.string().min(1, "Mata uang wajib diisi"),
  taxPercent: decimalString,
  serviceChargePercent: decimalString,
});
export type StoreSettingFormValues = z.infer<typeof storeSettingFormSchema>;

export const themeFormSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna: #RRGGBB"),
});
export type ThemeFormValues = z.infer<typeof themeFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
});
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const productFormSchema = z.object({
  categoryId: z.string().min(1, "Pilih kategori"),
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: decimalString,
  description: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url("URL tidak valid"), z.literal("")]).optional(),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
