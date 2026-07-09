import type { InsightDataset } from "./insight-data.js";

/** Fallback tanpa Gemini — ringkasan deterministik dari data lokal, tetap testable tanpa API key. */
export function generateLocalNarrative(dataset: InsightDataset): string {
  if (dataset.summaryLines.length === 0) {
    return "Belum ada cukup data pada periode ini untuk menghasilkan insight.";
  }
  return `Berdasarkan data periode ini:\n- ${dataset.summaryLines.join("\n- ")}`;
}
