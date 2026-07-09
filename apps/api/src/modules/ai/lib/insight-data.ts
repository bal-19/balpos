import type { AiInsightType } from "@restaurant-pos/types";
import {
  findAllStockItems,
  findOrderTimestamps,
  getBestSellingItems,
  getProductQuantitySold,
  getStockUsageSince,
} from "../repository/ai.repository.js";

export interface InsightDataset {
  type: AiInsightType;
  summaryLines: string[];
  raw: Record<string, unknown>;
}

async function gatherBestSellingMenu(outletId: string, from: Date, to: Date): Promise<InsightDataset> {
  const items = await getBestSellingItems(outletId, from, to);
  return {
    type: "BEST_SELLING_MENU",
    summaryLines: items.map((i) => `${i.productNameSnapshot}: ${i._sum.quantity ?? 0} porsi terjual`),
    raw: { items },
  };
}

async function gatherBusiestHours(outletId: string, from: Date, to: Date): Promise<InsightDataset> {
  const orders = await findOrderTimestamps(outletId, from, to);
  const counts = new Array(24).fill(0) as number[];
  for (const order of orders) {
    const hour = order.createdAt.getHours();
    counts[hour] = (counts[hour] ?? 0) + 1;
  }
  const ranked = counts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  return {
    type: "BUSIEST_HOURS",
    summaryLines: ranked.map((r) => `Jam ${r.hour}:00 — ${r.count} order`),
    raw: { hourly: counts },
  };
}

async function gatherRestockPrediction(outletId: string): Promise<InsightDataset> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const [stockItems, usage] = await Promise.all([findAllStockItems(outletId), getStockUsageSince(outletId, since)]);
  const usageMap = new Map(usage.map((u) => [u.stockItemId, u._sum.quantity?.toNumber() ?? 0]));
  const predictions = stockItems
    .map((item) => {
      const dailyUsage = (usageMap.get(item.id) ?? 0) / 30;
      const daysUntilStockout = dailyUsage > 0 ? item.currentStock.toNumber() / dailyUsage : Infinity;
      return { name: item.name, currentStock: item.currentStock.toNumber(), dailyUsage, daysUntilStockout };
    })
    .filter((p) => Number.isFinite(p.daysUntilStockout))
    .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
  return {
    type: "RESTOCK_PREDICTION",
    summaryLines: predictions
      .slice(0, 5)
      .map((p) => `${p.name}: perkiraan habis dalam ${p.daysUntilStockout.toFixed(1)} hari`),
    raw: { predictions },
  };
}

async function gatherDecliningProducts(outletId: string, from: Date, to: Date): Promise<InsightDataset> {
  const durationMs = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - durationMs);
  const [current, previous] = await Promise.all([
    getProductQuantitySold(outletId, from, to),
    getProductQuantitySold(outletId, prevFrom, from),
  ]);
  const prevMap = new Map(previous.map((p) => [p.productNameSnapshot, p._sum.quantity ?? 0]));
  const declines = current
    .map((c) => {
      const prevQty = prevMap.get(c.productNameSnapshot) ?? 0;
      const curQty = c._sum.quantity ?? 0;
      const changePercent = prevQty > 0 ? ((curQty - prevQty) / prevQty) * 100 : 0;
      return { name: c.productNameSnapshot, curQty, prevQty, changePercent };
    })
    .filter((d) => d.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent);
  return {
    type: "DECLINING_PRODUCTS",
    summaryLines: declines
      .slice(0, 5)
      .map((d) => `${d.name}: turun ${Math.abs(d.changePercent).toFixed(0)}% (${d.prevQty} -> ${d.curQty} porsi)`),
    raw: { declines },
  };
}

export async function gatherInsightData(
  outletId: string,
  type: AiInsightType,
  from: Date,
  to: Date,
): Promise<InsightDataset> {
  switch (type) {
    case "BEST_SELLING_MENU":
      return gatherBestSellingMenu(outletId, from, to);
    case "BUSIEST_HOURS":
      return gatherBusiestHours(outletId, from, to);
    case "RESTOCK_PREDICTION":
      return gatherRestockPrediction(outletId);
    case "DECLINING_PRODUCTS":
      return gatherDecliningProducts(outletId, from, to);
    case "SALES_SUMMARY":
    case "BUSINESS_IMPROVEMENT":
    default: {
      const [bestSelling, declining] = await Promise.all([
        gatherBestSellingMenu(outletId, from, to),
        gatherDecliningProducts(outletId, from, to),
      ]);
      return {
        type,
        summaryLines: [...bestSelling.summaryLines, ...declining.summaryLines],
        raw: { bestSelling: bestSelling.raw, declining: declining.raw },
      };
    }
  }
}

const PROMPT_HEADERS: Record<AiInsightType, string> = {
  BEST_SELLING_MENU: "Analisis menu terlaris berikut dan berikan insight singkat untuk pemilik restoran:",
  BUSIEST_HOURS: "Analisis jam-jam tersibuk berikut dan berikan saran operasional:",
  RESTOCK_PREDICTION: "Analisis prediksi kehabisan stok berikut dan berikan rekomendasi restock:",
  DECLINING_PRODUCTS: "Analisis produk yang penjualannya menurun berikut dan berikan saran perbaikan:",
  SALES_SUMMARY: "Buatkan ringkasan penjualan naratif dari data berikut:",
  BUSINESS_IMPROVEMENT: "Berikan insight peningkatan bisnis berdasarkan data berikut:",
};

export function buildGeminiPrompt(dataset: InsightDataset): string {
  return `${PROMPT_HEADERS[dataset.type]}\n\n${dataset.summaryLines.join("\n")}\n\nJawab dalam Bahasa Indonesia, singkat (maks 150 kata), dalam bentuk paragraf naratif untuk pemilik restoran.`;
}
