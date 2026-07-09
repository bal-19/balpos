import type { AiInsight } from "@prisma/client";
import type { AiInsight as AiInsightDto, GenerateInsightResult } from "@restaurant-pos/types";
import { enqueueInsightJob } from "../queues/ai-analysis.queue.js";
import { findLatestInsight, findManyInsights } from "../repository/ai.repository.js";
import type { GenerateInsightInput, ListInsightsQuery } from "../schema/ai.schema.js";

const CACHE_TTL_MS = 15 * 60 * 1000;

function toDto(insight: AiInsight): AiInsightDto {
  return {
    id: insight.id,
    outletId: insight.outletId,
    type: insight.type,
    source: insight.source,
    periodFrom: insight.periodFrom?.toISOString() ?? null,
    periodTo: insight.periodTo?.toISOString() ?? null,
    content: insight.content,
    metadata: (insight.metadata as Record<string, unknown> | null) ?? null,
    requestedBy: insight.requestedBy,
    createdAt: insight.createdAt.toISOString(),
  };
}

export async function requestInsight(
  outletId: string,
  tenantId: string,
  requestedBy: string,
  input: GenerateInsightInput,
): Promise<GenerateInsightResult> {
  if (!input.force) {
    const latest = await findLatestInsight(outletId, input.type);
    if (latest && Date.now() - latest.createdAt.getTime() < CACHE_TTL_MS) {
      return { cached: toDto(latest) };
    }
  }

  const job = await enqueueInsightJob({
    outletId,
    tenantId,
    type: input.type,
    periodFrom: input.from,
    periodTo: input.to,
    requestedBy,
  });

  return { queued: true, jobId: job.id!, type: input.type };
}

export async function listOutletInsights(outletId: string, query: ListInsightsQuery): Promise<AiInsightDto[]> {
  const insights = await findManyInsights(outletId, query.type, query.limit);
  return insights.map(toDto);
}
