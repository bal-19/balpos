import { Worker } from "bullmq";
import { QUEUE_NAMES } from "../../../core/queue-names.js";
import { redis } from "../../../core/redis.js";
import { getIO } from "../../../core/socket.js";
import { uploadReportFile } from "../../../core/supabase.js";
import {
  findOrderItemsInRange,
  getOrderAggregateInRange,
} from "../../dashboard/repository/dashboard.repository.js";
import { generateExcelReport } from "../lib/excel-report.generator.js";
import { generatePdfReport, type ReportDataset } from "../lib/pdf-report.generator.js";
import { updateExportJobStatus } from "../repository/report.repository.js";
import type { ExportJobPayload } from "./export.queue.js";

async function buildDataset(outletId: string, from: Date, to: Date): Promise<ReportDataset> {
  const [aggregate, items] = await Promise.all([
    getOrderAggregateInRange(outletId, from, to),
    findOrderItemsInRange(outletId, from, to),
  ]);
  const totalRevenue = aggregate._sum.totalAmount?.toNumber() ?? 0;

  const byProduct = new Map<string, { quantity: number; revenue: number }>();
  for (const item of items) {
    const key = item.productNameSnapshot;
    const current = byProduct.get(key) ?? { quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += item.subtotal.toNumber();
    byProduct.set(key, current);
  }
  const rows = Array.from(byProduct.entries()).map(([label, v]) => ({
    label,
    value: `${v.quantity} pcs — Rp ${v.revenue.toFixed(2)}`,
  }));

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    totalRevenue: totalRevenue.toFixed(2),
    totalOrders: aggregate._count._all,
    rows,
  };
}

export function createExportWorker(): Worker<ExportJobPayload> {
  return new Worker<ExportJobPayload>(
    QUEUE_NAMES.EXPORT,
    async (job) => {
      const { jobId, outletId, fileType, periodFrom, periodTo } = job.data;
      await updateExportJobStatus(jobId, "PROCESSING");

      const dataset = await buildDataset(outletId, new Date(periodFrom), new Date(periodTo));
      const buffer = fileType === "PDF" ? await generatePdfReport(dataset) : await generateExcelReport(dataset);
      const ext = fileType === "PDF" ? "pdf" : "xlsx";
      const contentType =
        fileType === "PDF"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const fileUrl = await uploadReportFile(`reports/${outletId}/${jobId}.${ext}`, buffer, contentType);
      const updated = await updateExportJobStatus(jobId, "COMPLETED", { fileUrl, completedAt: new Date() });

      getIO().to(`outlet:${outletId}`).emit("report:export.completed", {
        jobId: updated.id,
        fileUrl,
        reportType: updated.reportType,
        fileType: updated.fileType,
      });
    },
    { connection: redis, concurrency: 2 },
  ).on("failed", async (job, err) => {
    if (!job) return;
    const message = err instanceof Error ? err.message : "Export gagal";
    await updateExportJobStatus(job.data.jobId, "FAILED", { failureReason: message }).catch(() => undefined);
    getIO().to(`outlet:${job.data.outletId}`).emit("report:export.failed", { jobId: job.data.jobId, message });
  });
}
