import { type IncomeCategorySchema } from '#database/schema'
import IncomeCategory from '#models/income_category'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
export default class IncomeCategoryRepository {
  private model = IncomeCategory
  get getModel(): typeof IncomeCategory {
    return this.model
  }
  async create(
    data: ModelProps<IncomeCategorySchema>,
    trx?: TransactionClientContract
  ): Promise<IncomeCategory> {
    const incomeCategory = new this.model()
    if (trx) {
      incomeCategory.useTransaction(trx)
    }
    incomeCategory.fill(data)
    await incomeCategory.save()
    return incomeCategory
  }
  async update(
    incomeCategory: IncomeCategory,
    data: Partial<ModelProps<IncomeCategorySchema>>,
    trx?: TransactionClientContract
  ): Promise<IncomeCategory> {
    if (trx) {
      incomeCategory.useTransaction(trx)
    }
    return incomeCategory.merge(data).save()
  }
  async delete(incomeCategory: IncomeCategory, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      incomeCategory.useTransaction(trx)
    }
    await incomeCategory.delete()
  }
  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }
  async findById(id: number): Promise<IncomeCategory> {
    return this.model.findOrFail(id)
  }
  async createMany(data: ModelProps<IncomeCategorySchema>[]): Promise<IncomeCategory[]> {
    const incomeCategories: IncomeCategory[] = []
    for (const item of data) {
      incomeCategories.push(await this.create(item))
    }
    return incomeCategories
  }
  async findAllByUserId(userId: number): Promise<IncomeCategory[]> {
    return this.model.query().where('user_id', userId).preload('defaultWalletType')
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('defaultWalletType')
      .paginate(page, perPage)
  }
}
