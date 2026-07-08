import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ categoryId }: { categoryId: string | null }) {
  const { data, isLoading } = useProducts(categoryId ?? undefined);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-2xl bg-black/5" />
        ))}
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
