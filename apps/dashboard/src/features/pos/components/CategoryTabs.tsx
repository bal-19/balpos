import { Spinner } from "@restaurant-pos/ui";
import { useCategories } from "../hooks/useCategories";

export function CategoryTabs({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const { data, isLoading } = useCategories();

  if (isLoading) return <Spinner className="h-24 justify-center" />;

  return (
    <div className="grid grid-cols-3 gap-3">
      {data?.map((category) => {
        const active = category.id === selected;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-black/10 bg-white text-black/70 hover:border-primary/50"
            }`}
          >
            <div className="text-sm font-semibold">{category.name}</div>
          </button>
        );
      })}
    </div>
  );
}
