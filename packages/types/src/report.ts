import type { ExportFileType, ExportJobStatus, ReportFilter, ReportType } from "./enums.js";

export interface ReportSummaryPoint {
  label: string;
  revenue: string;
  orderCount: number;
}

export interface ReportSummaryTopItem {
  name: string;
  quantity: number;
  revenue: string;
}

export interface ReportSummaryResponse {
  filter: ReportFilter;
  from: string;
  to: string;
  totalRevenue: string;
  totalOrders: number;
  averageOrderValue: string;
  points: ReportSummaryPoint[];
  topItems: ReportSummaryTopItem[];
}

export interface ReportExportJob {
  id: string;
  outletId: string;
  reportType: ReportType;
  fileType: ExportFileType;
  status: ExportJobStatus;
  periodFrom: string;
  periodTo: string;
  fileUrl: string | null;
  failureReason: string | null;
  requestedBy: string;
  createdAt: string;
  completedAt: string | null;
}

export interface ReportExportJobListResponse {
  items: ReportExportJob[];
  total: number;
  page: number;
  pageSize: number;
}
