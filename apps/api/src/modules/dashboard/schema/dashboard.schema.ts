import { z } from "zod";

export const salesStatisticQuerySchema = z.object({
  range: z.enum(["day", "month", "year"]).default("day"),
});

export const itemsPerformanceQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(20).default(6),
});

export const recentTransactionsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type SalesStatisticQuery = z.infer<typeof salesStatisticQuerySchema>;
export type ItemsPerformanceQuery = z.infer<typeof itemsPerformanceQuerySchema>;
export type RecentTransactionsQuery = z.infer<typeof recentTransactionsQuerySchema>;
