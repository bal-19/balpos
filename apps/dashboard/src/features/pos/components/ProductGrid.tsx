import { Spinner } from "@restaurant-pos/ui";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ categoryId }: { categoryId: string | null }) {
  const { data, isLoading } = useProducts(categoryId ?? undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-black/40">Belum ada produk di kategori ini.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
