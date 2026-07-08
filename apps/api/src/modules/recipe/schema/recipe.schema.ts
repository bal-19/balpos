import { z } from "zod";

const ingredientSchema = z.object({
  stockItemId: z.string().min(1),
  quantity: z.string().regex(/^\d+(\.\d{1,3})?$/, "Harus angka, contoh 18 atau 0.5"),
});

export const upsertRecipeSchema = z.object({
  ingredients: z.array(ingredientSchema),
});

export type UpsertRecipeInput = z.infer<typeof upsertRecipeSchema>;
