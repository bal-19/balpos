import type { Promotion } from "@restaurant-pos/types";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePromotionMutations, usePromotions } from "../hooks/usePromotions";
import { PROMOTION_TYPE_LABELS } from "../types/promotion.types";
import { PromotionFormDialog } from "./PromotionFormDialog";

function formatDiscount(promotion: Promotion) {
  return promotion.discountType === "PERCENTAGE"
    ? `${promotion.discountValue}%`
    : `Rp${promotion.discountValue}`;
}

export function PromotionTable() {
  const { data, isLoading } = usePromotions();
  const { remove } = usePromotionMutations();
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(promotion: Promotion) {
    setEditing(promotion);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Promo</h1>
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} /> Tambah Promo
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Tipe</TableHeaderCell>
              <TableHeaderCell>Kode</TableHeaderCell>
              <TableHeaderCell>Diskon</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>{PROMOTION_TYPE_LABELS[promotion.type]}</TableCell>
                <TableCell>{promotion.code ?? "-"}</TableCell>
                <TableCell>{formatDiscount(promotion)}</TableCell>
                <TableCell>
                  <Badge variant={promotion.isActive ? "success" : "outline"}>
                    {promotion.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(promotion)}
                      className="rounded p-1 hover:bg-black/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(promotion.id)}
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

      <PromotionFormDialog open={dialogOpen} onOpenChange={setDialogOpen} promotion={editing} />
    </div>
  );
}
