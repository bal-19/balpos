import type {
  ApiSuccessEnvelope,
  ReportExportJob,
  ReportExportJobListResponse,
  ReportSummaryResponse,
} from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export interface ReportSummaryParams {
  filter: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
  from?: string;
  to?: string;
}

export async function fetchReportSummary(params: ReportSummaryParams) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<ReportSummaryResponse>>("/api/report/summary", {
    params,
  });
  return data.data;
}

export interface CreateExportPayload {
  reportType: string;
  fileType: "PDF" | "EXCEL";
  from: string;
  to: string;
}

export async function createExport(payload: CreateExportPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<ReportExportJob>>("/api/report/export", payload);
  return data.data;
}

export async function fetchExports(page = 1, pageSize = 20) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<ReportExportJobListResponse>>("/api/report/exports", {
    params: { page, pageSize },
  });
  return data.data;
}
