import { z } from "zod";

export const updateItemStatusSchema = z.object({
  status: z.enum(["NEW", "PREPARING", "READY"]),
});

export type UpdateItemStatusInput = z.infer<typeof updateItemStatusSchema>;
