import { Badge, Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { AlertTriangle, Package } from "lucide-react";
import { useStockItems } from "../../inventory/hooks/useStockItems";

export function LowStockWidget() {
  const { data, isLoading } = useStockItems();
  const lowStockItems = (data ?? []).filter((item) => item.isLowStock);

  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-black/90">
          <AlertTriangle size={16} className="text-red-600" />
          Stok Menipis
        </CardTitle>
        {lowStockItems.length > 0 && <Badge variant="danger">{lowStockItems.length} item</Badge>}
      </CardHeader>
      {isLoading ? (
        <Spinner />
      ) : lowStockItems.length === 0 ? (
        <p className="text-sm text-black/40">Semua stok aman.</p>
      ) : (
        <div className="flex flex-col divide-y divide-black/5">
          {lowStockItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-black/60 shadow-sm">
                <Package size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black/85">{item.name}</p>
                <p className="text-xs font-medium text-red-600">
                  Sisa {item.currentStock} {item.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
