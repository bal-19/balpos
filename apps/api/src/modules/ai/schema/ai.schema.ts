import { AI_INSIGHT_TYPES } from "@restaurant-pos/types";
import { z } from "zod";

export const generateInsightSchema = z.object({
  type: z.enum(AI_INSIGHT_TYPES),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  force: z.boolean().default(false),
});

export const listInsightsQuerySchema = z.object({
  type: z.enum(AI_INSIGHT_TYPES).optional(),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type GenerateInsightInput = z.infer<typeof generateInsightSchema>;
export type ListInsightsQuery = z.infer<typeof listInsightsQuerySchema>;
