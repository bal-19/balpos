import { Button, Dialog, DialogContent } from "@restaurant-pos/ui";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePurchaseOrderMutations, useStockItemsForPurchase } from "../hooks/usePurchaseOrders";
import { useSuppliers } from "../hooks/useSuppliers";

interface Row {
  stockItemId: string;
  quantity: string;
  unitCost: string;
}

export function PurchaseOrderFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: suppliers } = useSuppliers();
  const { data: stockItems } = useStockItemsForPurchase();
  const { create } = usePurchaseOrderMutations();
  const [supplierId, setSupplierId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSupplierId(suppliers?.[0]?.id ?? "");
      setRows([]);
      setError(null);
    }
  }, [open, suppliers]);

  function addRow() {
    if (!stockItems || stockItems.length === 0) return;
    setRows((prev) => [...prev, { stockItemId: stockItems[0]!.id, quantity: "0", unitCost: "0" }]);
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    setError(null);
    if (!supplierId || rows.length === 0) {
      setError("Pilih supplier dan tambah minimal 1 item.");
      return;
    }
    create.mutate(
      { supplierId, items: rows },
      {
        onSuccess: () => onOpenChange(false),
        onError: () => setError("Gagal membuat purchase order."),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Buat Purchase Order">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Supplier</label>
            <select
              className="h-10 rounded-lg border border-black/10 px-3 text-sm"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
            >
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Item</span>
              <Button type="button" size="sm" variant="outline" onClick={addRow}>
                Tambah Item
              </Button>
            </div>
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  className="h-9 flex-1 rounded-lg border border-black/10 px-2 text-sm"
                  value={row.stockItemId}
                  onChange={(event) => updateRow(index, { stockItemId: event.target.value })}
                >
                  {stockItems?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  className="h-9 w-20 rounded-lg border border-black/10 px-2 text-sm"
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(event) => updateRow(index, { quantity: event.target.value })}
                />
                <input
                  className="h-9 w-28 rounded-lg border border-black/10 px-2 text-sm"
                  placeholder="Harga satuan"
                  value={row.unitCost}
                  onChange={(event) => updateRow(index, { unitCost: event.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-black/30 hover:text-red-600"
                  aria-label="Hapus item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="button" disabled={create.isPending} onClick={handleSubmit}>
            {create.isPending ? "Menyimpan..." : "Buat Purchase Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
