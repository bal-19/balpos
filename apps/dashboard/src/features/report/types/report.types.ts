import { z } from "zod";

export const exportFormSchema = z.object({
  reportType: z.enum(["SALES_SUMMARY", "ITEMS_PERFORMANCE", "TRANSACTIONS"]),
  fileType: z.enum(["PDF", "EXCEL"]),
  from: z.string().min(1, "Tanggal mulai wajib diisi"),
  to: z.string().min(1, "Tanggal akhir wajib diisi"),
});
export type ExportFormValues = z.infer<typeof exportFormSchema>;

export const REPORT_TYPE_LABELS: Record<ExportFormValues["reportType"], string> = {
  SALES_SUMMARY: "Ringkasan Penjualan",
  ITEMS_PERFORMANCE: "Performa Produk",
  TRANSACTIONS: "Transaksi",
};

export const REPORT_FILTER_LABELS: Record<"DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM", string> = {
  DAILY: "Harian",
  WEEKLY: "Mingguan",
  MONTHLY: "Bulanan",
  CUSTOM: "Custom",
};

export const EXPORT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PROCESSING: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
};
