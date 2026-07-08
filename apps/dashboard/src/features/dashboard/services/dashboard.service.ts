import type {
  ApiSuccessEnvelope,
  ItemPerformance,
  OverviewStats,
  RecentTransaction,
  SalesStatisticResponse,
} from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchOverview() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<OverviewStats>>("/api/dashboard/overview");
  return data.data;
}

export async function fetchSalesStatistic(range: "day" | "month" | "year") {
  const { data } = await apiClient.get<ApiSuccessEnvelope<SalesStatisticResponse>>(
    "/api/dashboard/sales-statistic",
    { params: { range } },
  );
  return data.data;
}

export async function fetchItemsPerformance(limit: number) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<ItemPerformance[]>>(
    "/api/dashboard/items-performance",
    { params: { limit } },
  );
  return data.data;
}

export async function fetchRecentTransactions(limit: number) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<RecentTransaction[]>>(
    "/api/dashboard/recent-transactions",
    { params: { limit } },
  );
  return data.data;
}
