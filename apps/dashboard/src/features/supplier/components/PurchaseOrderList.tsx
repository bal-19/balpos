import type { PurchaseOrder } from "@restaurant-pos/types";
import { Badge, Button, Spinner } from "@restaurant-pos/ui";
import { formatCurrencyIDR, formatDate } from "@restaurant-pos/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { usePurchaseOrderMutations, usePurchaseOrders } from "../hooks/usePurchaseOrders";
import { PurchaseOrderFormDialog } from "./PurchaseOrderFormDialog";

const STATUS_VARIANT: Record<PurchaseOrder["status"], "outline" | "warning" | "success" | "danger"> = {
  DRAFT: "outline",
  ORDERED: "warning",
  RECEIVED: "success",
  CANCELLED: "danger",
};

export function PurchaseOrderList() {
  const { data, isLoading } = usePurchaseOrders();
  const { receive } = usePurchaseOrderMutations();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={16} /> Buat Purchase Order
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada purchase order.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((po) => (
            <div key={po.id} className="rounded-xl border border-black/10 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{po.orderNumber}</div>
                  <div className="text-xs text-black/50">
                    {po.supplierName} — {formatDate(po.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[po.status]}>{po.status}</Badge>
                  {po.status !== "RECEIVED" && po.status !== "CANCELLED" && (
                    <Button size="sm" disabled={receive.isPending} onClick={() => receive.mutate(po.id)}>
                      Terima Barang
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                {po.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-black/70">
                    <span>
                      {item.stockItemName} x{item.quantity} {item.unit}
                    </span>
                    <span>{formatCurrencyIDR(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t border-black/10 pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrencyIDR(po.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <PurchaseOrderFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
