import { useEffect, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { CartPanel } from "./CartPanel";
import { CategoryTabs } from "./CategoryTabs";
import { ProductGrid } from "./ProductGrid";

export function PosPage() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategoryId && categories && categories.length > 0) {
      setSelectedCategoryId(categories[0]!.id);
    }
  }, [categories, selectedCategoryId]);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <CategoryTabs selected={selectedCategoryId} onSelect={setSelectedCategoryId} />
        <div className="mt-4">
          <ProductGrid categoryId={selectedCategoryId} />
        </div>
      </div>
      <CartPanel />
    </div>
  );
}
