import { Spinner } from "@restaurant-pos/ui";
import { useEffect, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useCurrentShift } from "../hooks/useShift";
import { CartPanel } from "./CartPanel";
import { CategoryTabs } from "./CategoryTabs";
import { ProductGrid } from "./ProductGrid";
import { ShiftStatusBar } from "./ShiftStatusBar";

export function PosPage() {
    const { data: shift, isLoading: isShiftLoading } = useCurrentShift();
    const { data: categories } = useCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedCategoryId && categories && categories.length > 0) {
            setSelectedCategoryId(categories[0]!.id);
        }
    }, [categories, selectedCategoryId]);

    if (isShiftLoading) {
        return <Spinner size="lg" fullPage />;
    }

    if (!shift) {
        return (
            <div className="flex flex-col gap-4">
                <ShiftStatusBar />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <ShiftStatusBar />
            <div className="flex gap-4">
                <div className="flex-1">
                    <CategoryTabs selected={selectedCategoryId} onSelect={setSelectedCategoryId} />
                    <div className="mt-4">
                        <ProductGrid categoryId={selectedCategoryId} />
                    </div>
                </div>
                <CartPanel />
            </div>
        </div>
    );
}
