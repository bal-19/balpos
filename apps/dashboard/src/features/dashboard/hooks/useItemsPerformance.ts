import { useQuery } from "@tanstack/react-query";
import { fetchItemsPerformance } from "../services/dashboard.service";

export function useItemsPerformance(limit: number) {
  return useQuery({
    queryKey: ["dashboard", "items-performance", limit],
    queryFn: () => fetchItemsPerformance(limit),
  });
}
