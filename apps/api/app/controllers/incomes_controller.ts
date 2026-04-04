import { IncomeService } from '#services/income_service'
import IncomeTransformer from '#transformers/income_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createIncomeValidator,
  createMassIncomeValidator,
  deleteMassIncomeValidator,
  updateIncomeValidator,
  updateMassIncomeValidator,
} from '#validators/income'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class IncomesController {
  constructor(protected readonly incomeService: IncomeService) {}
  /**
   * Display a list of resource
   */
  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.incomeService.getPaginatedUserIncomes(page, perPage)
    const serialized = await serialize(IncomeTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(serialized.data, 'Incomes retrieved successfully', paginator.getMeta())
    )
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createIncomeValidator)
    const income = await this.incomeService.createIncome(payload)
    const serialized = await serialize(IncomeTransformer.transform(income))
    return response.ok(ApiResponse.success(serialized.data, 'Income created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassIncomeValidator)
    const incomes = await this.incomeService.createMassIncomes(payload.items)
    const serialized = await serialize(IncomeTransformer.transform(incomes))
    return response.ok(ApiResponse.success(serialized.data, 'Incomes created successfully'))
  }

  /**
   * Show individual record
   */
  async show({ params, serialize, response }: HttpContext) {
    const income = await this.incomeService.getIncomeById(params.id)
    const serialized = await serialize(IncomeTransformer.transform(income))
    return response.ok(ApiResponse.success(serialized.data, 'Income retrieved successfully'))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateIncomeValidator)
    const income = await this.incomeService.updateIncome(params.id, payload)
    const serialized = await serialize(IncomeTransformer.transform(income))
    return response.ok(ApiResponse.success(serialized.data, 'Income updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassIncomeValidator)
    const incomes = await this.incomeService.updateMassIncomes(payload.items)
    const serialized = await serialize(IncomeTransformer.transform(incomes))
    return response.ok(ApiResponse.success(serialized.data, 'Incomes updated successfully'))
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.incomeService.deleteIncome(params.id)
    return response.ok(ApiResponse.success(null, 'Income deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassIncomeValidator)
    await this.incomeService.deleteMassIncomes(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Incomes deleted successfully')
    )
  }
}
