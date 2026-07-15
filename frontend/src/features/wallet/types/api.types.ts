export interface ApiWalletTransaction {
  id: number;
  walletId: number;
  type: "CREDIT" | "DEBIT";
  amount: string;
  status: string;
  description: string;
  bookingId: number | null;
  balanceBefore: string;
  balanceAfter: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiWalletResponse {
  balance: string;
  transactions: ApiWalletTransaction[];
}
