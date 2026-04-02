import { IncomeCategoryService } from '#services/income_category_service'
import IncomeCategoryTransformer from '#transformers/income_category_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createIncomeCategoryValidator,
  updateIncomeCategoryValidator,
} from '#validators/income_category'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class IncomeCategoriesController {
  constructor(protected readonly incomeCategoryService: IncomeCategoryService) {}

  /**
   * Display a list of resource
   */
  async index({ serialize, response }: HttpContext) {
    const incomeCategories = await this.incomeCategoryService.getAllUserIncomeCategories()
    const serialized = await serialize(IncomeCategoryTransformer.transform(incomeCategories))
    return response.ok(
      ApiResponse.success(serialized.data, 'Income categories retrieved successfully')
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

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.incomeCategoryService.deleteIncomeCategory(params.id)
    return response.ok(ApiResponse.success(null, 'Income category deleted successfully'))
  }
}
