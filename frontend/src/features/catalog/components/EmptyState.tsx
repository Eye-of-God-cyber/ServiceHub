import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your search or filters to find what you're looking for.",
  onReset,
  resetLabel = "Clear all filters",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-2xl bg-card border-dashed">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      
      {onReset && (
        <Button onClick={onReset} variant="outline" className="rounded-full">
          {resetLabel}
        </Button>
      )}
    </div>
  );
}
