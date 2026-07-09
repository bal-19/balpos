import type { ApiSuccessEnvelope, AuditLogListResponse } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export interface AuditLogQueryParams {
  userId?: string;
  method?: string;
  path?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchAuditLogs(params: AuditLogQueryParams) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<AuditLogListResponse>>("/api/audit-log", { params });
  return data.data;
}
