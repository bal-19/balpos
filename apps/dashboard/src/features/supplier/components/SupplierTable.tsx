import type { Supplier } from "@restaurant-pos/types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSupplierMutations, useSuppliers } from "../hooks/useSuppliers";
import { SupplierFormDialog } from "./SupplierFormDialog";

export function SupplierTable() {
  const { data, isLoading } = useSuppliers();
  const { remove } = useSupplierMutations();
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(supplier: Supplier) {
    setEditing(supplier);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Supplier
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Telepon</TableHeaderCell>
              <TableHeaderCell>Alamat</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.phone ?? "-"}</TableCell>
                <TableCell>{supplier.address ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(supplier)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(supplier.id)}
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

      <SupplierFormDialog open={dialogOpen} onOpenChange={setDialogOpen} supplier={editing} />
    </div>
  );
}
