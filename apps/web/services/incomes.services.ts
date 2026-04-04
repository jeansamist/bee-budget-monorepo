"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateIncomeSchema,
  UpdateIncomeSchema,
  UpdateMassIncomeSchema,
} from "@/schemas/incomes.schemas"
import type {
  ApiResponse,
  IndexParams,
  Income,
  MassDeleteResult,
} from "@/types"

export const getIncomes = async (params: IndexParams = {}): Promise<ApiResponse<Income[]>> => {
  const { page = 1, perPage = 15, fetchAll = false, walletId } = params
  const query = fetchAll
    ? { page: 1, perPage: 100000, walletId }
    : { page, perPage, walletId }
  const [data, error] = await tuyau.api.incomes.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<Income[]>
}

export const getIncome = async (id: number): Promise<ApiResponse<Income>> => {
  const [data, error] = await tuyau.api.incomes.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<Income>
}

export const createIncome = async (
  payload: CreateIncomeSchema
): Promise<ApiResponse<Income>> => {
  const [data, error] = await tuyau.api.incomes.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<Income>
}

export const createMassIncomes = async (
  items: CreateIncomeSchema[]
): Promise<ApiResponse<Income[]>> => {
  const [data, error] = await tuyau.api.incomes.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Income[]>
}

export const updateIncome = async (
  id: number,
  payload: UpdateIncomeSchema
): Promise<ApiResponse<Income>> => {
  const [data, error] = await tuyau.api.incomes.update({
    params: { id },
    body: payload,
  }).safe()
  return (error ? error.response : data) as ApiResponse<Income>
}

export const updateMassIncomes = async (
  items: UpdateMassIncomeSchema[]
): Promise<ApiResponse<Income[]>> => {
  const [data, error] = await tuyau.api.incomes.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Income[]>
}

export const deleteIncome = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.incomes.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassIncomes = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.incomes.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
