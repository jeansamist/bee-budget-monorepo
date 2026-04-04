import { type ExpenseCategorySchema } from '#database/schema'
import ExpenseCategory from '#models/expense_category'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class ExpenseCategoryRepository {
  private model = ExpenseCategory

  get getModel(): typeof ExpenseCategory {
    return this.model
  }

  async create(
    data: ModelProps<ExpenseCategorySchema>,
    trx?: TransactionClientContract
  ): Promise<ExpenseCategory> {
    const expenseCategory = new this.model()
    if (trx) {
      expenseCategory.useTransaction(trx)
    }
    expenseCategory.fill(data)
    await expenseCategory.save()
    return expenseCategory
  }

  async update(
    expenseCategory: ExpenseCategory,
    data: Partial<ModelProps<ExpenseCategorySchema>>,
    trx?: TransactionClientContract
  ): Promise<ExpenseCategory> {
    if (trx) {
      expenseCategory.useTransaction(trx)
    }
    return expenseCategory.merge(data).save()
  }

  async delete(expenseCategory: ExpenseCategory, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      expenseCategory.useTransaction(trx)
    }
    await expenseCategory.delete()
  }

  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }

  async findById(id: number): Promise<ExpenseCategory> {
    return this.model.findOrFail(id)
  }

  async createMany(data: ModelProps<ExpenseCategorySchema>[]): Promise<ExpenseCategory[]> {
    const expenseCategories: ExpenseCategory[] = []
    for (const item of data) {
      expenseCategories.push(await this.create(item))
    }
    return expenseCategories
  }

  async findAllByUserId(userId: number): Promise<ExpenseCategory[]> {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('defaultWalletType')
      .preload('defaultContact')
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('defaultWalletType')
      .preload('defaultContact')
      .paginate(page, perPage)
  }
}
