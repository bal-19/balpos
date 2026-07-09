import type { AiInsightSource, AiInsightType } from "./enums.js";

export interface AiInsight {
  id: string;
  outletId: string;
  type: AiInsightType;
  source: AiInsightSource;
  periodFrom: string | null;
  periodTo: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  requestedBy: string;
  createdAt: string;
}

export type GenerateInsightResult = { cached: AiInsight } | { queued: true; jobId: string; type: AiInsightType };
