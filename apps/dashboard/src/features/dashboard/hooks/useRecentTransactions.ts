import { useQuery } from "@tanstack/react-query";
import { fetchRecentTransactions } from "../services/dashboard.service";

export function useRecentTransactions(limit: number) {
  return useQuery({
    queryKey: ["dashboard", "recent-transactions", limit],
    queryFn: () => fetchRecentTransactions(limit),
  });
}
