import { IncomeCategorySchema } from '#database/schema'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class IncomeCategoryService {
  constructor(
    private readonly repository: IncomeCategoryRepository,
    private readonly ctx: HttpContext
  ) {}
  // Your code here
  checkOwnership(incomeCategory: IncomeCategorySchema) {
    if (incomeCategory.userId !== this.ctx.auth.user?.id) {
      throw new Error('Unauthorized')
    }
  }
  async createIncomeCategory(data: Omit<ModelProps<IncomeCategorySchema>, 'userId'>) {
    return this.repository.getModel.create({ ...data, userId: this.ctx.auth.user!.id })
  }
  async updateIncomeCategory(id: number, data: Partial<ModelProps<IncomeCategorySchema>>) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    return incomeCategory.merge(data).save()
  }
  async deleteIncomeCategory(id: number) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    return this.repository.delete(incomeCategory)
  }
  async getIncomeCategoryById(id: number) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    return incomeCategory
  }
  async getAllUserIncomeCategories() {
    return this.repository.findAllByUserId(this.ctx.auth.user!.id)
  }
}
