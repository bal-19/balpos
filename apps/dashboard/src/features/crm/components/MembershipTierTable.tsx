import type { MembershipTier } from "@restaurant-pos/types";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMembershipTierMutations, useMembershipTiers } from "../hooks/useMembershipTiers";
import { MembershipTierFormDialog } from "./MembershipTierFormDialog";

export function MembershipTierTable() {
  const { data, isLoading } = useMembershipTiers();
  const { remove } = useMembershipTierMutations();
  const [editing, setEditing] = useState<MembershipTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(tier: MembershipTier) {
    setEditing(tier);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Tier
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Minimal Poin</TableHeaderCell>
              <TableHeaderCell>Diskon</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((tier) => (
              <TableRow key={tier.id}>
                <TableCell>{tier.name}</TableCell>
                <TableCell>{tier.minPoint}</TableCell>
                <TableCell>{tier.discountPercent}%</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(tier)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(tier.id)}
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

      <MembershipTierFormDialog open={dialogOpen} onOpenChange={setDialogOpen} tier={editing} />
    </div>
  );
}
