"use server"

import { tuyau } from "@/lib/api"
import type {
  ApiResponse,
  TransactionAnalytics,
  TransactionAnalyticsPeriod,
} from "@/types"

export const getTransactionAnalytics = async (
  period: TransactionAnalyticsPeriod = "monthly"
): Promise<ApiResponse<TransactionAnalytics>> => {
  const [data, error] = await tuyau.api.transactionAnalytics
    .index({ query: { period } })
    .safe()
  return (error ? error.response : data) as ApiResponse<TransactionAnalytics>
}
