import type { ExportFileType, ReportType } from "@restaurant-pos/types";
import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../../../core/queue-names.js";
import { redis } from "../../../core/redis.js";

export interface ExportJobPayload {
  jobId: string;
  outletId: string;
  tenantId: string;
  reportType: ReportType;
  fileType: ExportFileType;
  periodFrom: string;
  periodTo: string;
}

export const exportQueue = new Queue<ExportJobPayload>(QUEUE_NAMES.EXPORT, { connection: redis });

export function enqueueExportJob(payload: ExportJobPayload) {
  return exportQueue.add("export-report", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}
