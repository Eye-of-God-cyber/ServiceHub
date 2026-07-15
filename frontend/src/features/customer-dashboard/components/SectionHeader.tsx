import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionHeader({
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Button 
          variant="ghost" 
          size="sm" 
          render={<Link href={viewAllHref} />} 
          className="shrink-0 -ml-3 sm:ml-0 self-start sm:self-auto text-primary"
        >
          {viewAllLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
