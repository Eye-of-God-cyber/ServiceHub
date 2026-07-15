import type { WalletTransaction } from "../types/domain.types";
import { TransactionCard } from "./TransactionCard";
import { TransactionEmptyState } from "./TransactionEmptyState";
import { Activity } from "lucide-react";

interface TransactionListProps {
  transactions: WalletTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <TransactionEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Recent Activity</h3>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
