import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(1, "Nama pelanggan wajib diisi"),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  membershipTierId: z.string().optional(),
});
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const membershipTierFormSchema = z.object({
  name: z.string().min(1, "Nama tier wajib diisi"),
  minPoint: z.coerce.number().int().min(0),
  discountPercent: z.string().min(1, "Diskon wajib diisi"),
});
export type MembershipTierFormValues = z.infer<typeof membershipTierFormSchema>;
