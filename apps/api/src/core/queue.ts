import type { Worker } from "bullmq";
import { createAiAnalysisWorker } from "../modules/ai/queues/ai-analysis.worker.js";
import { createExportWorker } from "../modules/report/queues/export.worker.js";

let workers: Worker[] = [];

/** Dipanggil sekali dari core/server.ts saat startup, setelah createSocketServer(). */
export function startWorkers(): void {
  workers = [createExportWorker(), createAiAnalysisWorker()];
  for (const worker of workers) {
    worker.on("error", (err) => console.error(`[queue:${worker.name}] worker error`, err));
  }
  console.log(`[queue] ${workers.length} worker(s) started: ${workers.map((w) => w.name).join(", ")}`);
}

export async function stopWorkers(): Promise<void> {
  await Promise.all(workers.map((worker) => worker.close()));
  workers = [];
}
