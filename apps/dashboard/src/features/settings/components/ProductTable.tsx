import type { Product } from "@restaurant-pos/types";
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
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useProductMutations, useProducts } from "../hooks/useProducts";
import { ProductFormDialog } from "./ProductFormDialog";

export function ProductTable() {
  const { data, isLoading } = useProducts();
  const { remove } = useProductMutations();
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Produk
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Harga</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrencyIDR(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.isAvailable ? "success" : "outline"}>
                    {product.isAvailable ? "Tersedia" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(product.id)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />
    </div>
  );
}
