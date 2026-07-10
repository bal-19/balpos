import type { Category } from "@restaurant-pos/types";
import {
    Badge,
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
import { useCategories, useCategoryMutations } from "../hooks/useCategories";
import { CategoryFormDialog } from "./CategoryFormDialog";

export function CategoryTable() {
    const { data, isLoading } = useCategories();
    const { remove } = useCategoryMutations();
    const [editing, setEditing] = useState<Category | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleCreate() {
        setEditing(null);
        setDialogOpen(true);
    }

    function handleEdit(category: Category) {
        setEditing(category);
        setDialogOpen(true);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button size="sm" onClick={handleCreate}>
                    <Plus size={16} /> Tambah Kategori
                </Button>
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Nama</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>
                                    <Badge variant={category.isActive ? "success" : "outline"}>
                                        {category.isActive ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(category)}
                                            className="rounded p-1 hover:bg-black/5"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => remove.mutate(category.id)}
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

            <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />
        </div>
    );
}
