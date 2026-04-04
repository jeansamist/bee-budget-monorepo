"use server"

import { tuyau } from "@/lib/api"
import type { ApiResponse, WalletAnalytics, WalletAnalyticsPeriod } from "@/types"

export const getWalletAnalytics = async (
  walletId: number,
  period: WalletAnalyticsPeriod = "monthly"
): Promise<ApiResponse<WalletAnalytics>> => {
  const [data, error] = await tuyau.api.walletAnalytics
    .index({ params: { id: walletId }, query: { period } })
    .safe()
  return (error ? error.response : data) as ApiResponse<WalletAnalytics>
}
