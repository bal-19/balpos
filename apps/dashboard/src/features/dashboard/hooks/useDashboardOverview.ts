import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "../services/dashboard.service";

export function useDashboardOverview() {
  return useQuery({ queryKey: ["dashboard", "overview"], queryFn: fetchOverview });
}
