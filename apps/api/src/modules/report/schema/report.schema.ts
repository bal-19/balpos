import { EXPORT_FILE_TYPES, REPORT_FILTERS, REPORT_TYPES } from "@restaurant-pos/types";
import { z } from "zod";

export const reportSummaryQuerySchema = z
  .object({
    filter: z.enum(REPORT_FILTERS).default("DAILY"),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
  .refine((data) => data.filter !== "CUSTOM" || (data.from && data.to), {
    message: "from & to wajib diisi untuk filter CUSTOM",
    path: ["from"],
  });

export const createExportSchema = z.object({
  reportType: z.enum(REPORT_TYPES),
  fileType: z.enum(EXPORT_FILE_TYPES),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export const listExportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type ReportSummaryQuery = z.infer<typeof reportSummaryQuerySchema>;
export type CreateExportInput = z.infer<typeof createExportSchema>;
export type ListExportsQuery = z.infer<typeof listExportsQuerySchema>;
