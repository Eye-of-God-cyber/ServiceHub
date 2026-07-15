import { cn } from "@/lib/utils";
import type { Category } from "../types/domain.types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex w-full overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible gap-2">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          selectedCategoryId === null
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background text-foreground hover:bg-muted"
        )}
      >
        All Services
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            selectedCategoryId === category.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground hover:bg-muted"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
