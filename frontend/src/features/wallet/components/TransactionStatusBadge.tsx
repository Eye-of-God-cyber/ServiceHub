import type { TransactionStatus } from "../types/domain.types";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const statusStyles: Record<TransactionStatus, string> = {
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    FAILED: "bg-destructive/10 text-destructive",
    CANCELLED: "bg-muted text-muted-foreground",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
