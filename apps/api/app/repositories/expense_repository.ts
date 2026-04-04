import { type ExpenseSchema } from '#database/schema'
import Expense from '#models/expense'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class ExpenseRepository {
  private model = Expense

  get getModel(): typeof Expense {
    return this.model
  }

  async create(data: ModelProps<ExpenseSchema>, trx?: TransactionClientContract): Promise<Expense> {
    const expense = new this.model()
    if (trx) {
      expense.useTransaction(trx)
    }
    expense.fill(data)
    await expense.save()
    if (expense.walletId) {
      await expense.load('wallet', (query) => {
        if (trx) {
          query.useTransaction(trx)
        }
      })
    }
    return expense
  }

  async update(
    expense: Expense,
    data: Partial<ModelProps<ExpenseSchema>>,
    trx?: TransactionClientContract
  ): Promise<Expense> {
    if (trx) {
      expense.useTransaction(trx)
    }
    await expense.merge(data).save()
    if (expense.walletId) {
      await expense.load('wallet', (query) => {
        if (trx) {
          query.useTransaction(trx)
        }
      })
    }
    return expense
  }

  async delete(expense: Expense, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      expense.useTransaction(trx)
    }
    await expense.delete()
  }

  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }

  async findById(id: number): Promise<Expense> {
    return this.model.query().where('id', id).preload('wallet').preload('toContact').firstOrFail()
  }

  async createMany(data: ModelProps<ExpenseSchema>[]): Promise<Expense[]> {
    return this.model.createMany(data)
  }

  async findAllByUserId(userId: number): Promise<Expense[]> {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('wallet')
      .preload('toContact')
      .orderBy('created_at', 'desc')
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('wallet')
      .preload('toContact')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
  }

  async paginateByWalletAndUserId(
    userId: number,
    walletId: number,
    page: number,
    perPage: number
  ) {
    return this.model
      .query()
      .where('user_id', userId)
      .where('wallet_id', walletId)
      .preload('wallet')
      .preload('toContact')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
  }
}
