export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  bookingId: string | null;
  createdAt: Date;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}
