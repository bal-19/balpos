import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
  return prisma.auditLog.create({ data });
}

export interface AuditLogFilters {
  userId?: string;
  method?: string;
  path?: string;
  from?: Date;
  to?: Date;
}

function buildWhere(outletId: string, filters: AuditLogFilters): Prisma.AuditLogWhereInput {
  return {
    outletId,
    ...(filters.userId ? { userId: filters.userId } : {}),
    ...(filters.method ? { method: filters.method } : {}),
    ...(filters.path ? { path: { contains: filters.path } } : {}),
    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {}),
  };
}

export function findManyAuditLogs(outletId: string, filters: AuditLogFilters, page: number, pageSize: number) {
  return prisma.auditLog.findMany({
    where: buildWhere(outletId, filters),
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export function countAuditLogs(outletId: string, filters: AuditLogFilters) {
  return prisma.auditLog.count({ where: buildWhere(outletId, filters) });
}
