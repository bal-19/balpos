import type { AiInsightType } from "@restaurant-pos/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInsights, generateInsight } from "../services/analytics.service";

export function useLatestInsight(type: AiInsightType) {
  return useQuery({
    queryKey: ["analytics", "insights", type],
    queryFn: () => fetchInsights(type, 1),
    select: (items) => items[0] ?? null,
  });
}

export function useGenerateInsight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: AiInsightType; force?: boolean }) => generateInsight(input),
    onSuccess: (result, variables) => {
      if ("cached" in result) {
        queryClient.invalidateQueries({ queryKey: ["analytics", "insights", variables.type] });
      }
    },
  });
}

