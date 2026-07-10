import { Spinner } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Banknote, Receipt, TrendingUp, Utensils } from "lucide-react";
import { useAuthStore } from "../../../stores/auth.store";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { ItemsPerformanceChart } from "./ItemsPerformanceChart";
import { LowStockWidget } from "./LowStockWidget";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { SalesStatisticChart } from "./SalesStatisticChart";
import { StatCard } from "./StatCard";
import { UpcomingReservationsWidget } from "./UpcomingReservationsWidget";

export function DashboardOverviewPage() {
    const { data, isLoading, isError, error } = useDashboardOverview();
    const hasPermission = useAuthStore((state) => state.hasPermission);
    const showLowStock = hasPermission("inventory.view");
    const showReservations = hasPermission("reservation.view");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
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

    const hasSideWidgets = showLowStock || showReservations;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Revenue Hari Ini"
                    value={formatCurrencyIDR(data?.totalRevenueToday ?? "0")}
                    icon={<Banknote size={20} />}
                    trendPercent={data?.totalRevenueTrendPercent}
                    sparkline={data?.totalRevenueSparkline}
                />
                <StatCard
                    label="Total Order Hari Ini"
                    value={String(data?.totalOrdersToday ?? 0)}
                    icon={<Receipt size={20} />}
                    trendPercent={data?.totalOrdersTrendPercent}
                    sparkline={data?.totalOrdersSparkline}
                />
                <StatCard
                    label="Rata-rata Nilai Order"
                    value={formatCurrencyIDR(data?.averageOrderValueToday ?? "0")}
                    icon={<TrendingUp size={20} />}
                    trendPercent={data?.averageOrderValueTrendPercent}
                    sparkline={data?.averageOrderValueSparkline}
                />
                <StatCard
                    label="Menu Terlaris Hari Ini"
                    value={
                        data?.bestSellerToday
                            ? `${data.bestSellerToday.productName} (${data.bestSellerToday.quantity})`
                            : "-"
                    }
                    icon={<Utensils size={20} />}
                />
            </div>

            <div className={`grid grid-cols-1 gap-4 ${hasSideWidgets ? "lg:grid-cols-3" : ""}`}>
                <div className={hasSideWidgets ? "lg:col-span-2" : ""}>
                    <SalesStatisticChart />
                </div>
                {hasSideWidgets && (
                    <div className="flex flex-col gap-4">
                        {showLowStock && <LowStockWidget />}
                        {showReservations && <UpcomingReservationsWidget />}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <ItemsPerformanceChart />
                </div>
                <div className="lg:col-span-2">
                    <RecentTransactionsTable />
                </div>
            </div>
        </div>
    );
}
