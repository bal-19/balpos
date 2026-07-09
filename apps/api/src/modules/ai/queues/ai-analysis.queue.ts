import type { AiInsightType } from "@restaurant-pos/types";
import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../../../core/queue-names.js";
import { redis } from "../../../core/redis.js";

export interface AiAnalysisJobPayload {
  outletId: string;
  tenantId: string;
  type: AiInsightType;
  periodFrom?: string;
  periodTo?: string;
  requestedBy: string;
}

export const aiAnalysisQueue = new Queue<AiAnalysisJobPayload>(QUEUE_NAMES.AI_ANALYSIS, { connection: redis });

export function enqueueInsightJob(payload: AiAnalysisJobPayload) {
  return aiAnalysisQueue.add("generate-insight", payload, {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 },
  });
}
