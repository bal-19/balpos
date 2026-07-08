import { useQuery } from "@tanstack/react-query";
import { fetchSalesStatistic } from "../services/dashboard.service";

export function useSalesStatistic(range: "day" | "month" | "year") {
  return useQuery({
    queryKey: ["dashboard", "sales-statistic", range],
    queryFn: () => fetchSalesStatistic(range),
  });
}
