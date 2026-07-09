import { z } from "zod";

const decimalPercent = z.string().regex(/^\d+(\.\d{1,2})?$/, "Harus angka, contoh 5 atau 10.5");

export const createMembershipTierSchema = z.object({
  name: z.string().min(1, "Nama tier wajib diisi"),
  minPoint: z.coerce.number().int().min(0).default(0),
  discountPercent: decimalPercent.default("0"),
});

export const updateMembershipTierSchema = createMembershipTierSchema.partial();

export type CreateMembershipTierInput = z.infer<typeof createMembershipTierSchema>;
export type UpdateMembershipTierInput = z.infer<typeof updateMembershipTierSchema>;
