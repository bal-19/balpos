import { Worker } from "bullmq";
import { env } from "../../../config/env.js";
import { QUEUE_NAMES } from "../../../core/queue-names.js";
import { redis } from "../../../core/redis.js";
import { getIO } from "../../../core/socket.js";
import { generateGeminiNarrative } from "../lib/gemini.client.js";
import { buildGeminiPrompt, gatherInsightData } from "../lib/insight-data.js";
import { generateLocalNarrative } from "../lib/local-narrative.js";
import { createAiInsight } from "../repository/ai.repository.js";
import type { AiAnalysisJobPayload } from "./ai-analysis.queue.js";

function defaultRange(periodFrom?: string, periodTo?: string) {
  const to = periodTo ? new Date(periodTo) : new Date();
  const from = periodFrom ? new Date(periodFrom) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export function createAiAnalysisWorker(): Worker<AiAnalysisJobPayload> {
  return new Worker<AiAnalysisJobPayload>(
    QUEUE_NAMES.AI_ANALYSIS,
    async (job) => {
      const { outletId, type, periodFrom, periodTo, requestedBy } = job.data;
      const { from, to } = defaultRange(periodFrom, periodTo);
      const dataset = await gatherInsightData(outletId, type, from, to);

      let content: string;
      let source: "GEMINI" | "LOCAL";
      if (env.GOOGLE_GEMINI_API_KEY) {
        try {
          content = await generateGeminiNarrative(buildGeminiPrompt(dataset));
          source = "GEMINI";
        } catch (err) {
          console.error("[ai] panggilan Gemini gagal, fallback ke local narrative", err);
          content = generateLocalNarrative(dataset);
          source = "LOCAL";
        }
      } else {
        content = generateLocalNarrative(dataset);
        source = "LOCAL";
      }

      const insight = await createAiInsight({
        outletId,
        type,
        source,
        periodFrom: from,
        periodTo: to,
        content,
        metadata: dataset.raw as never,
        requestedBy,
      });

      getIO()
        .to(`outlet:${outletId}`)
        .emit("ai:insight.completed", {
          jobId: job.id,
          insight: {
            id: insight.id,
            type: insight.type,
            source: insight.source,
            content: insight.content,
            createdAt: insight.createdAt.toISOString(),
          },
        });
    },
    { connection: redis, concurrency: 1 },
  ).on("failed", (job, err) => {
    if (!job) return;
    getIO()
      .to(`outlet:${job.data.outletId}`)
      .emit("ai:insight.failed", {
        jobId: job.id,
        type: job.data.type,
        message: err instanceof Error ? err.message : "Gagal membuat insight",
      });
  });
}
