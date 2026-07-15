import { cn } from "@/lib/utils";
import type { BookingStatus } from "../types/domain.types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-purple-100 text-purple-800 border-purple-200" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  NO_SHOW: { label: "No Show", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
