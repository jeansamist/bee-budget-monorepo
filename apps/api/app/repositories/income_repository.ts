import { type IncomeSchema } from '#database/schema'
import Income from '#models/income'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
export default class IncomeRepository {
  private model = Income
  get getModel(): typeof Income {
    return this.model
  }
  async create(data: ModelProps<IncomeSchema>, trx?: TransactionClientContract): Promise<Income> {
    const income = new this.model()
    if (trx) {
      income.useTransaction(trx)
    }
    income.fill(data)
    await income.save()
    if (income.walletId) {
      await income.load('wallet', (query) => {
        if (trx) {
          query.useTransaction(trx)
        }
      })
    }
    return income
  }
  async update(
    income: Income,
    data: Partial<ModelProps<IncomeSchema>>,
    trx?: TransactionClientContract
  ): Promise<Income> {
    if (trx) {
      income.useTransaction(trx)
    }
    await income.merge(data).save()
    if (income.walletId) {
      await income.load('wallet', (query) => {
        if (trx) {
          query.useTransaction(trx)
        }
      })
    }
    return income
  }
  async delete(income: Income, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      income.useTransaction(trx)
    }
    await income.delete()
  }
  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }
  async findById(id: number): Promise<Income> {
    return this.model.query().where('id', id).preload('wallet').firstOrFail()
  }
  async createMany(data: ModelProps<IncomeSchema>[]): Promise<Income[]> {
    return this.model.createMany(data)
  }
  async findAllByUserId(userId: number): Promise<Income[]> {
    return this.model.query().where('user_id', userId).preload('wallet')
  }
}
