import { ArrowDownRight, ArrowUpRight, Calendar, FileText } from "lucide-react";
import type { WalletTransaction } from "../types/domain.types";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatCurrency } from "@/shared/utils/currency";

export function TransactionIcon({ type }: { type: WalletTransaction["type"] }) {
  if (type === "CREDIT") {
    return (
      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center shrink-0">
        <ArrowDownRight className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
      <ArrowUpRight className="w-5 h-5" />
    </div>
  );
}

export function TransactionAmount({ amount, type }: { amount: number; type: WalletTransaction["type"] }) {
  const isCredit = type === "CREDIT";
  return (
    <div className={`font-bold text-lg whitespace-nowrap ${isCredit ? "text-green-600 dark:text-green-400" : ""}`}>
      {isCredit ? "+" : "-"}{formatCurrency(amount)}
    </div>
  );
}

export function TransactionMetadata({ date, bookingId }: { date: Date; bookingId: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-muted-foreground mt-2">
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        {new Intl.DateTimeFormat('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }).format(date)}
      </div>
      {bookingId && (
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Booking #{bookingId}
        </div>
      )}
    </div>
  );
}

export function TransactionCard({ transaction }: { transaction: WalletTransaction }) {
  return (
    <div className="bg-card border rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-4 transition-colors hover:bg-muted/30">
      <TransactionIcon type={transaction.type} />
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <h4 className="font-semibold text-base truncate">{transaction.description}</h4>
          <TransactionAmount amount={transaction.amount} type={transaction.type} />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          <TransactionMetadata date={transaction.createdAt} bookingId={transaction.bookingId} />
          <div>
            <TransactionStatusBadge status={transaction.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
