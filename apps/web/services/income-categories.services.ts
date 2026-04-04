"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateIncomeCategorySchema,
  UpdateIncomeCategorySchema,
  UpdateMassIncomeCategorySchema,
} from "@/schemas/income-categories.schemas"
import type {
  ApiResponse,
  IndexParams,
  IncomeCategory,
  MassDeleteResult,
} from "@/types"

export const getIncomeCategories = async (params: IndexParams = {}): Promise<ApiResponse<IncomeCategory[]>> => {
  const { page = 1, perPage = 15, fetchAll = false } = params
  const query = fetchAll ? { page: 1, perPage: 100000 } : { page, perPage }
  const [data, error] = await tuyau.api.incomeCategories.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory[]>
}

export const getIncomeCategory = async (id: number): Promise<ApiResponse<IncomeCategory>> => {
  const [data, error] = await tuyau.api.incomeCategories.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory>
}

export const createIncomeCategory = async (
  payload: CreateIncomeCategorySchema
): Promise<ApiResponse<IncomeCategory>> => {
  const [data, error] = await tuyau.api.incomeCategories.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory>
}

export const createMassIncomeCategories = async (
  items: CreateIncomeCategorySchema[]
): Promise<ApiResponse<IncomeCategory[]>> => {
  const [data, error] = await tuyau.api.incomeCategories.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory[]>
}

export const updateIncomeCategory = async (
  id: number,
  payload: UpdateIncomeCategorySchema
): Promise<ApiResponse<IncomeCategory>> => {
  const [data, error] = await tuyau.api.incomeCategories.update({
    params: { id },
    body: payload,
  }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory>
}

export const updateMassIncomeCategories = async (
  items: UpdateMassIncomeCategorySchema[]
): Promise<ApiResponse<IncomeCategory[]>> => {
  const [data, error] = await tuyau.api.incomeCategories.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<IncomeCategory[]>
}

export const deleteIncomeCategory = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.incomeCategories.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassIncomeCategories = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.incomeCategories.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
