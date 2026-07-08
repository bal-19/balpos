export interface OverviewStats {
  totalRevenueToday: string;
  totalOrdersToday: number;
  averageOrderValueToday: string;
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
  name: string;
  quantity: number;
}

export interface RecentTransaction {
  id: string;
  orderNumber: string;
  customerName: string | null;
  itemsSummary: string;
  totalAmount: string;
  createdAt: string;
}
