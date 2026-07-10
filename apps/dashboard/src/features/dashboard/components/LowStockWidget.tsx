import { Badge, Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { AlertTriangle } from "lucide-react";
import { useStockItems } from "../../inventory/hooks/useStockItems";

export function LowStockWidget() {
  const { data, isLoading } = useStockItems();
  const lowStockItems = (data ?? []).filter((item) => item.isLowStock);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
            <div key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs font-medium text-red-600">
                Sisa {item.currentStock} {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
