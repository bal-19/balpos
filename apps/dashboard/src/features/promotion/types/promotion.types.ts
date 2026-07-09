import { z } from "zod";

export const promotionFormSchema = z.object({
  type: z.enum(["VOUCHER", "DISCOUNT", "HAPPY_HOUR", "BUY_X_GET_Y"]),
  code: z.string().optional(),
  name: z.string().min(1, "Nama promo wajib diisi"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.string().min(1, "Nilai diskon wajib diisi"),
  minPurchase: z.string().optional(),
  buyProductId: z.string().optional(),
  buyQuantity: z.coerce.number().int().positive().optional().or(z.literal(0)),
  getProductId: z.string().optional(),
  getQuantity: z.coerce.number().int().positive().optional().or(z.literal(0)),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isActive: z.boolean(),
});
export type PromotionFormValues = z.infer<typeof promotionFormSchema>;

export const PROMOTION_TYPE_LABELS: Record<PromotionFormValues["type"], string> = {
  VOUCHER: "Voucher (kode)",
  DISCOUNT: "Discount",
  HAPPY_HOUR: "Happy Hour",
  BUY_X_GET_Y: "Buy X Get Y",
};
