import { BudgetService } from '#services/budget_service'
import BudgetTransformer from '#transformers/budget_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createBudgetValidator,
  deleteMassBudgetValidator,
  updateBudgetValidator,
} from '#validators/budget'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BudgetsController {
  constructor(protected readonly budgetService: BudgetService) {}

  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.budgetService.getPaginatedUserBudgets(page, perPage)
    const serialized = await serialize(BudgetTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(serialized.data, 'Budgets retrieved successfully', paginator.getMeta())
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createBudgetValidator)
    const budget = await this.budgetService.createBudget(payload)
    const serialized = await serialize(BudgetTransformer.transform(budget))
    return response.ok(ApiResponse.success(serialized.data, 'Budget created successfully'))
  }

  async show({ params, serialize, response }: HttpContext) {
    const budget = await this.budgetService.getBudgetById(params.id)
    const serialized = await serialize(BudgetTransformer.transform(budget))
    return response.ok(ApiResponse.success(serialized.data, 'Budget retrieved successfully'))
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateBudgetValidator)
    const budget = await this.budgetService.updateBudget(params.id, payload)
    const serialized = await serialize(BudgetTransformer.transform(budget))
    return response.ok(ApiResponse.success(serialized.data, 'Budget updated successfully'))
  }

  async destroy({ params, response }: HttpContext) {
    await this.budgetService.deleteBudget(params.id)
    return response.ok(ApiResponse.success(null, 'Budget deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassBudgetValidator)
    await this.budgetService.deleteMassBudgets(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Budgets deleted successfully')
    )
  }
}
