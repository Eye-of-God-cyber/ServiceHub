import type { ApiWalletResponse, ApiWalletTransaction } from "../types/api.types";
import type { Wallet, WalletTransaction, TransactionType, TransactionStatus } from "../types/domain.types";

export function mapWalletTransactionToDomain(apiTransaction: ApiWalletTransaction): WalletTransaction {
  return {
    id: apiTransaction.id.toString(),
    type: apiTransaction.type as TransactionType,
    amount: parseFloat(apiTransaction.amount),
    status: apiTransaction.status as TransactionStatus,
    description: apiTransaction.description,
    bookingId: apiTransaction.bookingId ? apiTransaction.bookingId.toString() : null,
    createdAt: new Date(apiTransaction.createdAt),
  };
}

export function mapWalletToDomain(apiWallet: ApiWalletResponse): Wallet {
  return {
    balance: parseFloat(apiWallet.balance),
    transactions: (apiWallet.transactions || []).map(mapWalletTransactionToDomain),
  };
}
