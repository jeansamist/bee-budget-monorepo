import { IncomeSchema } from '#database/schema'
import IncomeRepository from '#repositories/income_repository'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class IncomeService {
  constructor(
    private readonly repository: IncomeRepository,
    private readonly ctx: HttpContext
  ) {}
  checkOwnership(income: IncomeSchema) {
    if (income.userId !== this.ctx.auth.user?.id) {
      throw new Error('Unauthorized')
    }
  }
  async createIncome(data: Omit<ModelProps<IncomeSchema>, 'userId'>) {
    return this.repository.create({ ...data, userId: this.ctx.auth.user!.id })
  }
  async updateIncome(id: number, data: Partial<ModelProps<IncomeSchema>>) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    return this.repository.update(income, data)
  }
  async deleteIncome(id: number) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    return this.repository.delete(income)
  }
  async getIncomeById(id: number) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    return income
  }
  async getAllUserIncomes() {
    return this.repository.findAllByUserId(this.ctx.auth.user!.id)
  }
}
