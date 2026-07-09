import { useQuery } from "@tanstack/react-query";
import { fetchReportSummary, type ReportSummaryParams } from "../services/report.service";

export function useReportSummary(params: ReportSummaryParams) {
  return useQuery({
    queryKey: ["report", "summary", params.filter, params.from, params.to],
    queryFn: () => fetchReportSummary(params),
    enabled: params.filter !== "CUSTOM" || (!!params.from && !!params.to),
  });
}
