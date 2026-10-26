"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateBudgetSchema,
  UpdateBudgetSchema,
} from "@/schemas/budgets.schemas"
import type {
  ApiResponse,
  Budget,
  IndexParams,
  MassDeleteResult,
} from "@/types"

export const getBudgets = async (
  params: IndexParams = {}
): Promise<ApiResponse<Budget[]>> => {
  const { page = 1, perPage = 15, fetchAll = false } = params
  const query = fetchAll ? { page: 1, perPage: 100000 } : { page, perPage }
  const [data, error] = await tuyau.api.budgets.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<Budget[]>
}

export const createBudget = async (
  payload: CreateBudgetSchema
): Promise<ApiResponse<Budget>> => {
  const [data, error] = await tuyau.api.budgets.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<Budget>
}

export const updateBudget = async (
  id: number,
  payload: UpdateBudgetSchema
): Promise<ApiResponse<Budget>> => {
  const [data, error] = await tuyau.api.budgets
    .update({ params: { id }, body: payload })
    .safe()
  return (error ? error.response : data) as ApiResponse<Budget>
}

export const deleteBudget = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.budgets
    .destroy({ params: { id } })
    .safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassBudgets = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.budgets
    .deleteMass({ body: { ids } })
    .safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
