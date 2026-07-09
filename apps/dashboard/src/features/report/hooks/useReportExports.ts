import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { createExport, fetchExports, type CreateExportPayload } from "../services/report.service";

export function useReportExports(page = 1, pageSize = 20) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["report", "exports", page, pageSize],
    queryFn: () => fetchExports(page, pageSize),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["report", "exports"] });
  useSocketEvent("report:export.completed", invalidate);
  useSocketEvent("report:export.failed", invalidate);

  return query;
}

export function useCreateExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExportPayload) => createExport(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["report", "exports"] }),
  });
}
