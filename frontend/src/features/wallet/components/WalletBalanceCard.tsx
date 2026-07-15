import { Wallet as WalletIcon } from "lucide-react";
import { formatCurrency } from "@/shared/utils/currency";

interface WalletBalanceCardProps {
  balance: number;
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  return (
    <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-md relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-xl" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary-foreground/80">
            <WalletIcon className="w-5 h-5" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Available Balance</h2>
          </div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
