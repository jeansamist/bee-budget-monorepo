import { ExpenseService } from '#services/expense_service'
import ExpenseTransformer from '#transformers/expense_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createExpenseValidator,
  createMassExpenseValidator,
  deleteMassExpenseValidator,
  updateExpenseValidator,
  updateMassExpenseValidator,
} from '#validators/expense'
import { paginateWithWalletValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ExpensesController {
  constructor(protected readonly expenseService: ExpenseService) {}

  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15, walletId } = await request.validateUsing(paginateWithWalletValidator)
    const paginator = await this.expenseService.getPaginatedUserExpenses(page, perPage, walletId)
    const serialized = await serialize(ExpenseTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expenses retrieved successfully', paginator.getMeta())
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createExpenseValidator)
    const expense = await this.expenseService.createExpense(payload)
    const serialized = await serialize(ExpenseTransformer.transform(expense))
    return response.ok(ApiResponse.success(serialized.data, 'Expense created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassExpenseValidator)
    const expenses = await this.expenseService.createMassExpenses(payload.items)
    const serialized = await serialize(ExpenseTransformer.transform(expenses))
    return response.ok(ApiResponse.success(serialized.data, 'Expenses created successfully'))
  }

  async show({ params, serialize, response }: HttpContext) {
    const expense = await this.expenseService.getExpenseById(params.id)
    const serialized = await serialize(ExpenseTransformer.transform(expense))
    return response.ok(ApiResponse.success(serialized.data, 'Expense retrieved successfully'))
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateExpenseValidator)
    const expense = await this.expenseService.updateExpense(params.id, payload)
    const serialized = await serialize(ExpenseTransformer.transform(expense))
    return response.ok(ApiResponse.success(serialized.data, 'Expense updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassExpenseValidator)
    const expenses = await this.expenseService.updateMassExpenses(payload.items)
    const serialized = await serialize(ExpenseTransformer.transform(expenses))
    return response.ok(ApiResponse.success(serialized.data, 'Expenses updated successfully'))
  }

  async destroy({ params, response }: HttpContext) {
    await this.expenseService.deleteExpense(params.id)
    return response.ok(ApiResponse.success(null, 'Expense deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassExpenseValidator)
    await this.expenseService.deleteMassExpenses(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Expenses deleted successfully')
    )
  }
}
