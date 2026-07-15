import api from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { ApiWalletResponse } from "../types/api.types";
import type { Wallet } from "../types/domain.types";
import { mapWalletToDomain } from "../mappers/wallet.mapper";

export async function getWallet(): Promise<Wallet> {
  const response = await api.get<ApiResponse<ApiWalletResponse>>(API_ROUTES.WALLETS.ME);
  return mapWalletToDomain(response.data.data);
}
