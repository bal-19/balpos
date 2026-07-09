import type { AiInsightType } from "@restaurant-pos/types";

export const AI_INSIGHT_TYPE_LABELS: Record<AiInsightType, string> = {
  BEST_SELLING_MENU: "Menu Terlaris",
  BUSIEST_HOURS: "Jam Tersibuk",
  RESTOCK_PREDICTION: "Prediksi Restock",
  DECLINING_PRODUCTS: "Produk Mulai Jarang Terjual",
  SALES_SUMMARY: "Ringkasan Penjualan",
  BUSINESS_IMPROVEMENT: "Insight Peningkatan Bisnis",
};

export const AI_INSIGHT_TYPES_LIST: AiInsightType[] = [
  "BEST_SELLING_MENU",
  "BUSIEST_HOURS",
  "RESTOCK_PREDICTION",
  "DECLINING_PRODUCTS",
  "SALES_SUMMARY",
  "BUSINESS_IMPROVEMENT",
];
