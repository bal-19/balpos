import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Banknote, Receipt, TrendingUp, Utensils } from "lucide-react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { ItemsPerformanceChart } from "./ItemsPerformanceChart";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { SalesStatisticChart } from "./SalesStatisticChart";
import { StatCard } from "./StatCard";

export function DashboardOverviewPage() {
    const { data, isLoading, isError, error } = useDashboardOverview();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-black/60">Memuat data dashboard...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-semibold text-red-900">Gagal memuat dashboard</p>
                <p className="mt-2 text-xs text-red-700">
                    {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data"}
                </p>
            </div>
        );
    }

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
