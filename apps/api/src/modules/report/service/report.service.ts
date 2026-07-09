import type { ReportExportJob } from "@prisma/client";
import type {
  ReportExportJob as ReportExportJobDto,
  ReportExportJobListResponse,
  ReportSummaryResponse,
} from "@restaurant-pos/types";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import { findOrderItemsInRange, getOrderAggregateInRange } from "../../dashboard/repository/dashboard.repository.js";
import { resolveReportRange } from "../lib/date-buckets.js";
import { enqueueExportJob } from "../queues/export.queue.js";
import {
  countExportJobs,
  createExportJob,
  findExportJobById,
  findManyExportJobs,
} from "../repository/report.repository.js";
import type { CreateExportInput, ListExportsQuery, ReportSummaryQuery } from "../schema/report.schema.js";

function toExportDto(job: ReportExportJob): ReportExportJobDto {
  return {
    id: job.id,
    outletId: job.outletId,
    reportType: job.reportType,
    fileType: job.fileType,
    status: job.status,
    periodFrom: job.periodFrom.toISOString(),
    periodTo: job.periodTo.toISOString(),
    fileUrl: job.fileUrl,
    failureReason: job.failureReason,
    requestedBy: job.requestedBy,
    createdAt: job.createdAt.toISOString(),
    completedAt: job.completedAt?.toISOString() ?? null,
  };
}

export async function getSummary(outletId: string, query: ReportSummaryQuery): Promise<ReportSummaryResponse> {
  const { from, to, buckets } = resolveReportRange(query.filter, query.from, query.to);

  const [aggregate, items] = await Promise.all([
    getOrderAggregateInRange(outletId, from, to),
    findOrderItemsInRange(outletId, from, to),
  ]);

  const totalRevenue = aggregate._sum.totalAmount?.toNumber() ?? 0;
  const totalOrders = aggregate._count._all;

  const points = buckets.map((bucket) => {
    const inBucket = items.filter(
      (item) => item.order.createdAt >= bucket.start && item.order.createdAt < bucket.end,
    );
    return {
      label: bucket.label,
      revenue: inBucket.reduce((sum, item) => sum + item.subtotal.toNumber(), 0).toFixed(2),
      orderCount: new Set(inBucket.map((item) => item.order.createdAt.getTime())).size,
    };
  });

  const topItemsMap = new Map<string, { quantity: number; revenue: number }>();
  for (const item of items) {
    const current = topItemsMap.get(item.productNameSnapshot) ?? { quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += item.subtotal.toNumber();
    topItemsMap.set(item.productNameSnapshot, current);
  }
  const topItems = Array.from(topItemsMap.entries())
    .map(([name, v]) => ({ name, quantity: v.quantity, revenue: v.revenue.toFixed(2) }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return {
    filter: query.filter,
    from: from.toISOString(),
    to: to.toISOString(),
    totalRevenue: totalRevenue.toFixed(2),
    totalOrders,
    averageOrderValue: (totalOrders > 0 ? totalRevenue / totalOrders : 0).toFixed(2),
    points,
    topItems,
  };
}

export async function requestExport(
  outletId: string,
  tenantId: string,
  requestedBy: string,
  input: CreateExportInput,
): Promise<ReportExportJobDto> {
  const job = await createExportJob({
    outletId,
    reportType: input.reportType,
    fileType: input.fileType,
    periodFrom: new Date(input.from),
    periodTo: new Date(input.to),
    requestedBy,
    status: "PENDING",
  });

  await enqueueExportJob({
    jobId: job.id,
    outletId,
    tenantId,
    reportType: input.reportType,
    fileType: input.fileType,
    periodFrom: input.from,
    periodTo: input.to,
  });

  return toExportDto(job);
}

export async function listExports(outletId: string, query: ListExportsQuery): Promise<ReportExportJobListResponse> {
  const [items, total] = await Promise.all([
    findManyExportJobs(outletId, query.page, query.pageSize),
    countExportJobs(outletId),
  ]);
  return { items: items.map(toExportDto), total, page: query.page, pageSize: query.pageSize };
}

export async function getExportById(id: string, outletId: string): Promise<ReportExportJobDto> {
  const job = await findExportJobById(id, outletId);
  if (!job) throw new NotFoundError("Export job tidak ditemukan");
  return toExportDto(job);
}
