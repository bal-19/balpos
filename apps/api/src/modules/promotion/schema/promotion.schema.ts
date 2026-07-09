import { z } from "zod";

const decimalMoney = z.string().regex(/^\d+(\.\d{1,2})?$/, "Harus angka, contoh 15000");
const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam HH:mm, contoh 14:00")
  .nullable()
  .optional();

const basePromotionSchema = z.object({
  type: z.enum(["VOUCHER", "DISCOUNT", "HAPPY_HOUR", "BUY_X_GET_Y"]),
  code: z.string().nullable().optional(),
  name: z.string().min(1, "Nama promo wajib diisi"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: decimalMoney,
  minPurchase: decimalMoney.default("0"),
  buyProductId: z.string().nullable().optional(),
  buyQuantity: z.coerce.number().int().positive().nullable().optional(),
  getProductId: z.string().nullable().optional(),
  getQuantity: z.coerce.number().int().positive().nullable().optional(),
  startAt: z.string().datetime().nullable().optional(),
  endAt: z.string().datetime().nullable().optional(),
  startTime: timeOfDay,
  endTime: timeOfDay,
  isActive: z.boolean().default(true),
});

export const createPromotionSchema = basePromotionSchema.superRefine((data, ctx) => {
  if (data.type === "VOUCHER" && !data.code) {
    ctx.addIssue({ code: "custom", path: ["code"], message: "Kode wajib diisi untuk tipe Voucher" });
  }
  if (data.type === "HAPPY_HOUR" && (!data.startTime || !data.endTime)) {
    ctx.addIssue({
      code: "custom",
      path: ["startTime"],
      message: "Jam mulai & selesai wajib diisi untuk Happy Hour",
    });
  }
  if (
    data.type === "BUY_X_GET_Y" &&
    (!data.buyProductId || !data.buyQuantity || !data.getProductId || !data.getQuantity)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["buyProductId"],
      message: "Produk beli & produk dapat wajib diisi untuk tipe Buy X Get Y",
    });
  }
});

export const updatePromotionSchema = basePromotionSchema.partial();

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
