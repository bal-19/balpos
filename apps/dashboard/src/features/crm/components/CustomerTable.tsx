import type { Customer } from "@restaurant-pos/types";
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
import { Coins, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCustomerMutations, useCustomers } from "../hooks/useCustomers";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { PointHistoryDialog } from "./PointHistoryDialog";

export function CustomerTable() {
  const { data, isLoading } = useCustomers();
  const { remove } = useCustomerMutations();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pointsFor, setPointsFor] = useState<Customer | null>(null);
  const [pointsOpen, setPointsOpen] = useState(false);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(customer: Customer) {
    setEditing(customer);
    setDialogOpen(true);
  }

  function handleShowPoints(customer: Customer) {
    setPointsFor(customer);
    setPointsOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Pelanggan
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
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Tier</TableHeaderCell>
              <TableHeaderCell>Poin</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone ?? "-"}</TableCell>
                <TableCell>{customer.email ?? "-"}</TableCell>
                <TableCell>
                  {customer.membershipTierName ? (
                    <Badge variant="outline">{customer.membershipTierName}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{customer.pointBalance}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleShowPoints(customer)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Riwayat Poin"
                    >
                      <Coins size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(customer)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(customer.id)}
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

      <CustomerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} customer={editing} />
      <PointHistoryDialog open={pointsOpen} onOpenChange={setPointsOpen} customer={pointsFor} />
    </div>
  );
}
