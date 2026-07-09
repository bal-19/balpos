import type { AuditLog } from "@prisma/client";
import type { AuditLogEntry, AuditLogListResponse } from "@restaurant-pos/types";
import { countAuditLogs, findManyAuditLogs } from "../repository/audit-log.repository.js";
import type { ListAuditLogQuery } from "../schema/audit-log.schema.js";

function toDto(log: AuditLog): AuditLogEntry {
  return {
    id: log.id,
    outletId: log.outletId,
    tenantId: log.tenantId,
    userId: log.userId,
    userName: log.userName,
    method: log.method,
    path: log.path,
    statusCode: log.statusCode,
    requestBody: (log.requestBody as Record<string, unknown> | null) ?? null,
    createdAt: log.createdAt.toISOString(),
  };
}

export async function listOutletAuditLogs(
  outletId: string,
  query: ListAuditLogQuery,
): Promise<AuditLogListResponse> {
  const filters = {
    userId: query.userId,
    method: query.method,
    path: query.path,
    from: query.from ? new Date(query.from) : undefined,
    to: query.to ? new Date(query.to) : undefined,
  };
  const [items, total] = await Promise.all([
    findManyAuditLogs(outletId, filters, query.page, query.pageSize),
    countAuditLogs(outletId, filters),
  ]);
  return { items: items.map(toDto), total, page: query.page, pageSize: query.pageSize };
}
