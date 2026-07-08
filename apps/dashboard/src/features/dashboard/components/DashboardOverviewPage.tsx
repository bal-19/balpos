import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Banknote, Receipt, TrendingUp, Utensils } from "lucide-react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { ItemsPerformanceChart } from "./ItemsPerformanceChart";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { SalesStatisticChart } from "./SalesStatisticChart";
import { StatCard } from "./StatCard";

export function DashboardOverviewPage() {
  const { data } = useDashboardOverview();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue Hari Ini"
          value={formatCurrencyIDR(data?.totalRevenueToday ?? "0")}
          icon={<Banknote size={20} className="text-primary" />}
        />
        <StatCard
          label="Total Orders Hari Ini"
          value={String(data?.totalOrdersToday ?? 0)}
          icon={<Receipt size={20} className="text-primary" />}
        />
        <StatCard
          label="Rata-rata Nilai Order"
          value={formatCurrencyIDR(data?.averageOrderValueToday ?? "0")}
          icon={<TrendingUp size={20} className="text-primary" />}
        />
        <StatCard
          label="Menu Terlaris Hari Ini"
          value={
            data?.bestSellerToday
              ? `${data.bestSellerToday.productName} (${data.bestSellerToday.quantity})`
              : "-"
          }
          icon={<Utensils size={20} className="text-primary" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SalesStatisticChart />
        <ItemsPerformanceChart />
      </div>

      <RecentTransactionsTable />
    </div>
  );
}
