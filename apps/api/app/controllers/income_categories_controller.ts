import { IncomeCategoryService } from '#services/income_category_service'
import IncomeCategoryTransformer from '#transformers/income_category_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createIncomeCategoryValidator,
  createMassIncomeCategoryValidator,
  deleteMassIncomeCategoryValidator,
  updateIncomeCategoryValidator,
  updateMassIncomeCategoryValidator,
} from '#validators/income_category'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class IncomeCategoriesController {
  constructor(protected readonly incomeCategoryService: IncomeCategoryService) {}

  /**
   * Display a list of resource
   */
  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.incomeCategoryService.getPaginatedUserIncomeCategories(page, perPage)
    const serialized = await serialize(IncomeCategoryTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(
        serialized.data,
        'Income categories retrieved successfully',
        paginator.getMeta()
      )
    )
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createIncomeCategoryValidator)
    const incomeCategory = await this.incomeCategoryService.createIncomeCategory(payload)
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategory))
    return response.ok(ApiResponse.success(serialized.data, 'Income category created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassIncomeCategoryValidator)
    const incomeCategories = await this.incomeCategoryService.createMassIncomeCategories(
      payload.items
    )
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategories))
    return response.ok(
      ApiResponse.success(serialized.data, 'Income categories created successfully')
    )
  }

  /**
   * Show individual record
   */
  async show({ params, serialize, response }: HttpContext) {
    const incomeCategory = await this.incomeCategoryService.getIncomeCategoryById(params.id)
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategory))
    return response.ok(
      ApiResponse.success(serialized.data, 'Income category retrieved successfully')
    )
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateIncomeCategoryValidator)
    const incomeCategory = await this.incomeCategoryService.updateIncomeCategory(params.id, payload)
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategory))
    return response.ok(ApiResponse.success(serialized.data, 'Income category updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassIncomeCategoryValidator)
    const incomeCategories = await this.incomeCategoryService.updateMassIncomeCategories(
      payload.items
    )
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategories))
    return response.ok(
      ApiResponse.success(serialized.data, 'Income categories updated successfully')
    )
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.incomeCategoryService.deleteIncomeCategory(params.id)
    return response.ok(ApiResponse.success(null, 'Income category deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassIncomeCategoryValidator)
    await this.incomeCategoryService.deleteMassIncomeCategories(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Income categories deleted successfully')
    )
  }
}
