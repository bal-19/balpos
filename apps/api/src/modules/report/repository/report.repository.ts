import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function createExportJob(data: Prisma.ReportExportJobUncheckedCreateInput) {
  return prisma.reportExportJob.create({ data });
}

export function updateExportJobStatus(
  id: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
  extra?: Partial<{ fileUrl: string; failureReason: string; completedAt: Date }>,
) {
  return prisma.reportExportJob.update({ where: { id }, data: { status, ...extra } });
}

export function findExportJobById(id: string, outletId: string) {
  return prisma.reportExportJob.findFirst({ where: { id, outletId } });
}

export function findManyExportJobs(outletId: string, page: number, pageSize: number) {
  return prisma.reportExportJob.findMany({
    where: { outletId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export function countExportJobs(outletId: string) {
  return prisma.reportExportJob.count({ where: { outletId } });
}
