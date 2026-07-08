import type { StockItem } from "@restaurant-pos/types";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { Pencil, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useStockItems } from "../hooks/useStockItems";
import { StockAdjustmentDialog } from "./StockAdjustmentDialog";
import { StockItemFormDialog } from "./StockItemFormDialog";

export function StockItemTable() {
  const { data, isLoading } = useStockItems();
  const [editing, setEditing] = useState<StockItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [adjusting, setAdjusting] = useState<StockItem | null>(null);

  function handleCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(item: StockItem) {
    setEditing(item);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Inventory</h1>
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Bahan Baku
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Satuan</TableHeaderCell>
              <TableHeaderCell>Stok Saat Ini</TableHeaderCell>
              <TableHeaderCell>Ambang Batas</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.minStockThreshold}</TableCell>
                <TableCell>
                  {item.isLowStock ? (
                    <Badge variant="danger">Stok Rendah</Badge>
                  ) : (
                    <Badge variant="success">Aman</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjusting(item)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Sesuaikan stok"
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <StockItemFormDialog open={formOpen} onOpenChange={setFormOpen} stockItem={editing} />
      <StockAdjustmentDialog stockItem={adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />
    </div>
  );
}
