import { Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Utensils } from "lucide-react";
import { useItemsPerformance } from "../hooks/useItemsPerformance";

export function ItemsPerformanceChart() {
  const { data, isLoading } = useItemsPerformance(5);

  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black/90">Produk Terlaris</CardTitle>
        <span className="text-xs font-medium text-black/40">30 Hari Terakhir</span>
      </CardHeader>
      {isLoading ? (
        <Spinner />
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada data.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item, index) => (
            <div
              key={item.productId}
              className={`flex items-center gap-3 ${index > 0 ? "border-t border-black/5 pt-3" : ""}`}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Utensils size={18} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-black/40">{item.quantity} porsi terjual</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold">{formatCurrencyIDR(item.price)}</p>
                <p className="text-[11px] text-black/40">{formatCurrencyIDR(item.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
