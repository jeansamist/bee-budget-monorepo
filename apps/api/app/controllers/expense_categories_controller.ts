import { ExpenseCategoryService } from '#services/expense_category_service'
import ExpenseCategoryTransformer from '#transformers/expense_category_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createExpenseCategoryValidator,
  createMassExpenseCategoryValidator,
  deleteMassExpenseCategoryValidator,
  updateExpenseCategoryValidator,
  updateMassExpenseCategoryValidator,
} from '#validators/expense_category'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ExpenseCategoriesController {
  constructor(protected readonly expenseCategoryService: ExpenseCategoryService) {}

  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.expenseCategoryService.getPaginatedUserExpenseCategories(
      page,
      perPage
    )
    const serialized = await serialize(ExpenseCategoryTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(
        serialized.data,
        'Expense categories retrieved successfully',
        paginator.getMeta()
      )
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createExpenseCategoryValidator)
    const expenseCategory = await this.expenseCategoryService.createExpenseCategory(payload)
    const serialized = await serialize(ExpenseCategoryTransformer.transform(expenseCategory))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expense category created successfully')
    )
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassExpenseCategoryValidator)
    const expenseCategories = await this.expenseCategoryService.createMassExpenseCategories(
      payload.items
    )
    const serialized = await serialize(ExpenseCategoryTransformer.transform(expenseCategories))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expense categories created successfully')
    )
  }

  async show({ params, serialize, response }: HttpContext) {
    const expenseCategory = await this.expenseCategoryService.getExpenseCategoryById(params.id)
    const serialized = await serialize(ExpenseCategoryTransformer.transform(expenseCategory))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expense category retrieved successfully')
    )
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateExpenseCategoryValidator)
    const expenseCategory = await this.expenseCategoryService.updateExpenseCategory(
      params.id,
      payload
    )
    const serialized = await serialize(ExpenseCategoryTransformer.transform(expenseCategory))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expense category updated successfully')
    )
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassExpenseCategoryValidator)
    const expenseCategories = await this.expenseCategoryService.updateMassExpenseCategories(
      payload.items
    )
    const serialized = await serialize(ExpenseCategoryTransformer.transform(expenseCategories))
    return response.ok(
      ApiResponse.success(serialized.data, 'Expense categories updated successfully')
    )
  }

  async destroy({ params, response }: HttpContext) {
    await this.expenseCategoryService.deleteExpenseCategory(params.id)
    return response.ok(ApiResponse.success(null, 'Expense category deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassExpenseCategoryValidator)
    await this.expenseCategoryService.deleteMassExpenseCategories(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Expense categories deleted successfully')
    )
  }
}
