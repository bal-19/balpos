import type { AiInsight, AiInsightType, ApiSuccessEnvelope, GenerateInsightResult } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchInsights(type: AiInsightType, limit = 1) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<AiInsight[]>>("/api/ai/insights", {
    params: { type, limit },
  });
  return data.data;
}

export async function generateInsight(input: { type: AiInsightType; force?: boolean }) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<GenerateInsightResult>>("/api/ai/insights", input);
  return data.data;
}
