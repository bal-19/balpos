export interface AuditLogEntry {
  id: string;
  outletId: string;
  tenantId: string;
  userId: string;
  userName: string;
  method: string;
  path: string;
  statusCode: number;
  requestBody: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogListResponse {
  items: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}
