import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickAction } from "../mock/quickActions";

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className="group flex items-start gap-4 p-5 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105", action.colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold tracking-tight">{action.title}</h4>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 pr-4">
          {action.description}
        </p>
      </div>
    </Link>
  );
}
