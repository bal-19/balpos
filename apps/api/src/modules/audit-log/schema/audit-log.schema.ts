import { z } from "zod";

export const listAuditLogQuerySchema = z.object({
  userId: z.string().optional(),
  method: z.enum(["POST", "PUT", "PATCH", "DELETE"]).optional(),
  path: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListAuditLogQuery = z.infer<typeof listAuditLogQuerySchema>;
