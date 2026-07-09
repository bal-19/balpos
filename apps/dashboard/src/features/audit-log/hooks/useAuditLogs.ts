import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs, type AuditLogQueryParams } from "../services/audit-log.service";

export function useAuditLogs(params: AuditLogQueryParams) {
  return useQuery({
    queryKey: ["audit-log", params],
    queryFn: () => fetchAuditLogs(params),
  });
}
