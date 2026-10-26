"use server"

import { tuyau } from "@/lib/api"
import type { ApiResponse, Report, ReportType } from "@/types"

export type ReportParams = {
  type: ReportType
  from?: string
  to?: string
  walletIds?: number[]
}

export const getReport = async ({
  walletIds,
  ...params
}: ReportParams): Promise<ApiResponse<Report>> => {
  const query = {
    ...params,
    ...(walletIds?.length ? { walletIds: walletIds.join(",") } : {}),
  }
  const [data, error] = await tuyau.api.reports.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<Report>
}
