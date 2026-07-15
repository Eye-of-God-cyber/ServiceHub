"use client";

import { useWallet } from "@/features/wallet/hooks";
import { WalletBalanceCard, TransactionList } from "@/features/wallet/components";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";

export default function WalletPage() {
  const { data: wallet, isLoading, error, refetch, isRefetching } = useWallet();

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Wallet</h1>
          <p className="text-muted-foreground">
            Manage your balance and view transaction history.
          </p>
        </div>
        <div className="h-48 bg-muted animate-pulse rounded-3xl" />
        <div className="space-y-4 pt-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="container py-12 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Failed to Load Wallet</h2>
        <p className="text-muted-foreground">
          We encountered an error while retrieving your wallet information. Please try again.
        </p>
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your balance and view transaction history.
        </p>
      </div>

      <WalletBalanceCard balance={wallet.balance} />

      <TransactionList transactions={wallet.transactions} />
    </div>
  );
}
