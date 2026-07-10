export interface OverviewStats {
  totalRevenueToday: string;
  totalRevenueTrendPercent: string;
  totalRevenueSparkline: number[];
  totalOrdersToday: number;
  totalOrdersTrendPercent: string;
  totalOrdersSparkline: number[];
  averageOrderValueToday: string;
  averageOrderValueTrendPercent: string;
  averageOrderValueSparkline: number[];
  bestSellerToday: { productName: string; quantity: number } | null;
}

export interface SalesStatisticPoint {
  label: string;
  [categoryName: string]: string | number;
}

export interface SalesStatisticResponse {
  categories: string[];
  data: SalesStatisticPoint[];
}

export interface ItemPerformance {
  productId: string;
  name: string;
  quantity: number;
  revenue: string;
  price: string;
  imageUrl: string | null;
}

export type RecentTransactionStatus = "OPEN" | "COMPLETED" | "CANCELLED";

export interface RecentTransaction {
  id: string;
  orderNumber: string;
  customerName: string | null;
  itemsSummary: string;
  totalAmount: string;
  status: RecentTransactionStatus;
  createdAt: string;
}
