"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateExpenseSchema,
  UpdateExpenseSchema,
  UpdateMassExpenseSchema,
} from "@/schemas/expenses.schemas"
import type {
  ApiResponse,
  Expense,
  IndexParams,
  MassDeleteResult,
} from "@/types"

export const getExpenses = async (params: IndexParams = {}): Promise<ApiResponse<Expense[]>> => {
  const { page = 1, perPage = 15, fetchAll = false } = params
  const query = fetchAll ? { page: 1, perPage: 100000 } : { page, perPage }
  const [data, error] = await tuyau.api.expenses.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<Expense[]>
}

export const getExpense = async (id: number): Promise<ApiResponse<Expense>> => {
  const [data, error] = await tuyau.api.expenses.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<Expense>
}

export const createExpense = async (
  payload: CreateExpenseSchema
): Promise<ApiResponse<Expense>> => {
  const [data, error] = await tuyau.api.expenses.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<Expense>
}

export const createMassExpenses = async (
  items: CreateExpenseSchema[]
): Promise<ApiResponse<Expense[]>> => {
  const [data, error] = await tuyau.api.expenses.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Expense[]>
}

export const updateExpense = async (
  id: number,
  payload: UpdateExpenseSchema
): Promise<ApiResponse<Expense>> => {
  const [data, error] = await tuyau.api.expenses
    .update({
      params: { id },
      body: payload,
    })
    .safe()
  return (error ? error.response : data) as ApiResponse<Expense>
}

export const updateMassExpenses = async (
  items: UpdateMassExpenseSchema[]
): Promise<ApiResponse<Expense[]>> => {
  const [data, error] = await tuyau.api.expenses.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Expense[]>
}

export const deleteExpense = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.expenses.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassExpenses = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.expenses.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
