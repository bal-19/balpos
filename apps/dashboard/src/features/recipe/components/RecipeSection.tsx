import { Button } from "@restaurant-pos/ui";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductRecipe, useSaveProductRecipe, useStockItemsForRecipe } from "../hooks/useRecipe";

interface Row {
  stockItemId: string;
  quantity: string;
}

export function RecipeSection({ productId }: { productId: string }) {
  const { data: recipe, isLoading } = useProductRecipe(productId);
  const { data: stockItems } = useStockItemsForRecipe();
  const saveRecipe = useSaveProductRecipe(productId);
  const [rows, setRows] = useState<Row[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (recipe) {
      setRows(
        recipe.ingredients.map((ingredient) => ({
          stockItemId: ingredient.stockItemId,
          quantity: ingredient.quantity,
        })),
      );
    }
  }, [recipe]);

  function addRow() {
    if (!stockItems || stockItems.length === 0) return;
    setRows((prev) => [...prev, { stockItemId: stockItems[0]!.id, quantity: "0" }]);
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    setSaved(false);
    saveRecipe.mutate(rows, { onSuccess: () => setSaved(true) });
  }

  if (isLoading) return <p className="text-xs text-black/40">Memuat resep...</p>;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-black/10 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Resep (Bahan Baku)</span>
        <Button type="button" size="sm" variant="outline" onClick={addRow}>
          Tambah Bahan
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-black/40">Belum ada bahan baku di resep produk ini.</p>
      ) : (
        rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="h-9 flex-1 rounded-lg border border-black/10 px-2 text-sm"
              value={row.stockItemId}
              onChange={(event) => updateRow(index, { stockItemId: event.target.value })}
            >
              {stockItems?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.unit})
                </option>
              ))}
            </select>
            <input
              className="h-9 w-24 rounded-lg border border-black/10 px-2 text-sm"
              value={row.quantity}
              onChange={(event) => updateRow(index, { quantity: event.target.value })}
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-black/30 hover:text-red-600"
              aria-label="Hapus bahan"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))
      )}

      <Button type="button" size="sm" disabled={saveRecipe.isPending} onClick={handleSave}>
        {saveRecipe.isPending ? "Menyimpan..." : "Simpan Resep"}
      </Button>
      {saved && <p className="text-xs text-emerald-600">Resep tersimpan.</p>}
    </div>
  );
}
