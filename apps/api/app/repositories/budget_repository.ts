import Budget from '#models/budget'
import { type ModelProps } from '#utils/generics'
import type { BudgetSchema } from '#database/schema'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class BudgetRepository {
  private model = Budget

  get getModel(): typeof Budget {
    return this.model
  }

  async create(data: ModelProps<BudgetSchema>, trx?: TransactionClientContract): Promise<Budget> {
    const budget = new this.model()
    if (trx) {
      budget.useTransaction(trx)
    }
    budget.fill(data)
    await budget.save()
    return budget
  }

  async update(
    budget: Budget,
    data: Partial<ModelProps<BudgetSchema>>,
    trx?: TransactionClientContract
  ): Promise<Budget> {
    if (trx) {
      budget.useTransaction(trx)
    }
    return budget.merge(data).save()
  }

  async delete(budget: Budget, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      budget.useTransaction(trx)
    }
    await budget.delete()
  }

  async findById(id: number): Promise<Budget> {
    return this.model.findOrFail(id)
  }

  async findAllByUserId(userId: number): Promise<Budget[]> {
    return this.model.query().where('user_id', userId).orderBy('created_at', 'asc')
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model
      .query()
      .where('user_id', userId)
      .orderBy('created_at', 'asc')
      .paginate(page, perPage)
  }
}
