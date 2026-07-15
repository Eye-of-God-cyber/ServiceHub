import Link from "next/link";
import type { ServiceCategory } from "../mock/categories";

interface ServiceCategoryCardProps {
  category: ServiceCategory;
}

export function ServiceCategoryCard({ category }: ServiceCategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="group flex flex-col items-center p-6 text-center rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mb-1 text-sm font-semibold tracking-tight">{category.name}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {category.description}
      </p>
    </Link>
  );
}
