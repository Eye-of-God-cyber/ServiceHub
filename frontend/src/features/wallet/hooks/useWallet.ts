import { useQuery } from "@tanstack/react-query";
import { getWallet } from "../services/wallet.service";
import { walletKeys } from "./walletKeys";
import type { Wallet } from "../types/domain.types";

export function useWallet() {
  return useQuery<Wallet, Error>({
    queryKey: walletKeys.details(),
    queryFn: getWallet,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Still refetch on window focus to ensure freshness
  });
}
