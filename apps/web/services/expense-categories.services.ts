"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateExpenseCategorySchema,
  UpdateExpenseCategorySchema,
  UpdateMassExpenseCategorySchema,
} from "@/schemas/expense-categories.schemas"
import type {
  ApiResponse,
  ExpenseCategory,
  IndexParams,
  MassDeleteResult,
} from "@/types"

export const getExpenseCategories = async (
  params: IndexParams = {}
): Promise<ApiResponse<ExpenseCategory[]>> => {
  const { page = 1, perPage = 15, fetchAll = false } = params
  const query = fetchAll ? { page: 1, perPage: 100000 } : { page, perPage }
  const [data, error] = await tuyau.api.expenseCategories.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory[]>
}

export const getExpenseCategory = async (
  id: number
): Promise<ApiResponse<ExpenseCategory>> => {
  const [data, error] = await tuyau.api.expenseCategories.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory>
}

export const createExpenseCategory = async (
  payload: CreateExpenseCategorySchema
): Promise<ApiResponse<ExpenseCategory>> => {
  const [data, error] = await tuyau.api.expenseCategories.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory>
}

export const createMassExpenseCategories = async (
  items: CreateExpenseCategorySchema[]
): Promise<ApiResponse<ExpenseCategory[]>> => {
  const [data, error] = await tuyau.api.expenseCategories.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory[]>
}

export const updateExpenseCategory = async (
  id: number,
  payload: UpdateExpenseCategorySchema
): Promise<ApiResponse<ExpenseCategory>> => {
  const [data, error] = await tuyau.api.expenseCategories
    .update({
      params: { id },
      body: payload,
    })
    .safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory>
}

export const updateMassExpenseCategories = async (
  items: UpdateMassExpenseCategorySchema[]
): Promise<ApiResponse<ExpenseCategory[]>> => {
  const [data, error] = await tuyau.api.expenseCategories.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<ExpenseCategory[]>
}

export const deleteExpenseCategory = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.expenseCategories.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassExpenseCategories = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.expenseCategories.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
