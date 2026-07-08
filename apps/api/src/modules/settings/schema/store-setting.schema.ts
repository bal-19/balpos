import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Warna harus format hex, contoh #2C4A3B");

const decimalString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Harus berupa angka desimal, contoh 10.00");

export const updateStoreSettingSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: hexColor,
  taxPercent: decimalString,
  serviceChargePercent: decimalString,
  currency: z.string().min(1).default("IDR"),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export type UpdateStoreSettingInput = z.infer<typeof updateStoreSettingSchema>;
