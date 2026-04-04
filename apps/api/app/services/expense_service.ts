import { ExpenseSchema } from '#database/schema'
import ContactRepository from '#repositories/contact_repository'
import ExpenseCategoryRepository from '#repositories/expense_category_repository'
import ExpenseRepository from '#repositories/expense_repository'
import WalletRepository from '#repositories/wallet_repository'
import { ModelProps } from '#utils/generics'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type CreateExpensePayload = {
  name: string
  description: string
  amount: number
  fees?: number | null
  expenseCategoryId: number
  walletId: number
  date: DateTime
  toContactId?: number | null
}

type UpdateExpensePayload = Partial<CreateExpensePayload>
type MassUpdateExpensePayload = UpdateExpensePayload & { id: number }

@inject()
export class ExpenseService {
  constructor(
    private readonly repository: ExpenseRepository,
    private readonly expenseCategoryRepository: ExpenseCategoryRepository,
    private readonly walletRepository: WalletRepository,
    private readonly contactRepository: ContactRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  private getTotalAmount(amount: number, fees: number | null | undefined) {
    return amount + (fees ?? 0)
  }

  private ensureWalletHasEnoughFunds(currentAmount: number, debitAmount: number) {
    if (debitAmount <= currentAmount) return
    throw httpError(422, 'Insufficient funds in the selected wallet')
  }

  checkOwnership(expense: ExpenseSchema) {
    if (expense.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this expense')
    }
  }

  private async getOwnedExpenseCategory(expenseCategoryId: number) {
    const expenseCategory = await this.expenseCategoryRepository.findById(expenseCategoryId)
    if (expenseCategory.userId !== this.userId) {
      throw httpError(422, 'The selected expense category is invalid')
    }
    return expenseCategory
  }

  private async getOwnedWallet(walletId: number) {
    const wallet = await this.walletRepository.findById(walletId)
    if (wallet.userId !== this.userId) {
      throw httpError(422, 'The selected wallet is invalid')
    }
    return wallet
  }

  private async validateWalletSelection({
    walletId,
    expenseCategoryId,
  }: Pick<CreateExpensePayload, 'walletId' | 'expenseCategoryId'>) {
    const [expenseCategory, wallet] = await Promise.all([
      this.getOwnedExpenseCategory(expenseCategoryId),
      this.getOwnedWallet(walletId),
    ])

    if (
      expenseCategory.defaultWalletTypeId !== null &&
      expenseCategory.defaultWalletTypeId !== undefined &&
      expenseCategory.defaultWalletTypeId !== wallet.walletTypeId
    ) {
      throw httpError(422, 'The selected wallet does not match the category default wallet type')
    }

    return { expenseCategory, wallet }
  }

  private async validateContactOwnership(toContactId: number | null | undefined) {
    if (toContactId === undefined || toContactId === null) return
    const contact = await this.contactRepository.findById(toContactId)
    if (contact.userId !== this.userId) {
      throw httpError(422, 'The selected contact is invalid')
    }
  }

  async createExpense(data: CreateExpensePayload) {
    const { wallet } = await this.validateWalletSelection(data)
    await this.validateContactOwnership(data.toContactId)
    const totalAmount = this.getTotalAmount(data.amount, data.fees)

    return db.transaction(async (trx) => {
      this.ensureWalletHasEnoughFunds(wallet.amount, totalAmount)
      wallet.useTransaction(trx)
      wallet.amount -= totalAmount
      await wallet.save()

      return this.repository.create(
        {
          name: data.name,
          description: data.description,
          amount: data.amount,
          fees: data.fees ?? null,
          date: data.date,
          expenseCategoryId: data.expenseCategoryId,
          walletId: data.walletId,
          toContactId: data.toContactId ?? null,
          userId: this.userId,
        } as ModelProps<ExpenseSchema>,
        trx
      )
    })
  }

  async updateExpense(id: number, data: UpdateExpensePayload) {
    const expense = await this.repository.findById(id)
    this.checkOwnership(expense)
    await this.validateContactOwnership(data.toContactId)

    const effectiveExpenseCategoryId = data.expenseCategoryId ?? expense.expenseCategoryId
    let targetWallet = expense.walletId ? await this.getOwnedWallet(expense.walletId) : null

    if (data.walletId !== undefined) {
      const { wallet } = await this.validateWalletSelection({
        walletId: data.walletId,
        expenseCategoryId: effectiveExpenseCategoryId,
      })
      targetWallet = wallet
    } else {
      if (!targetWallet) {
        throw httpError(422, 'This expense has no wallet assignment yet. Provide walletId')
      }

      const expenseCategory = await this.getOwnedExpenseCategory(effectiveExpenseCategoryId)
      if (
        expenseCategory.defaultWalletTypeId !== null &&
        expenseCategory.defaultWalletTypeId !== undefined &&
        expenseCategory.defaultWalletTypeId !== targetWallet.walletTypeId
      ) {
        throw httpError(422, 'The selected wallet does not match the category default wallet type')
      }
    }

    const nextAmount = data.amount ?? expense.amount
    const nextFees = data.fees !== undefined ? data.fees : expense.fees
    const currentTotal = this.getTotalAmount(expense.amount, expense.fees)
    const nextTotal = this.getTotalAmount(nextAmount, nextFees)

    return db.transaction(async (trx) => {
      if (!targetWallet) {
        throw httpError(422, 'A wallet is required for this expense')
      }

      const currentWallet = expense.walletId ? await this.getOwnedWallet(expense.walletId) : null

      if (!currentWallet || currentWallet.id === targetWallet.id) {
        this.ensureWalletHasEnoughFunds(targetWallet.amount + currentTotal, nextTotal)
        targetWallet.useTransaction(trx)
        targetWallet.amount -= nextTotal - currentTotal
        await targetWallet.save()
      } else {
        currentWallet.useTransaction(trx)
        currentWallet.amount += currentTotal
        await currentWallet.save()

        this.ensureWalletHasEnoughFunds(targetWallet.amount, nextTotal)
        targetWallet.useTransaction(trx)
        targetWallet.amount -= nextTotal
        await targetWallet.save()
      }

      return this.repository.update(
        expense,
        {
          name: data.name,
          description: data.description,
          amount: data.amount,
          fees: data.fees,
          date: data.date,
          expenseCategoryId: data.expenseCategoryId,
          walletId: targetWallet.id,
          toContactId: data.toContactId,
        } as Partial<ModelProps<ExpenseSchema>>,
        trx
      )
    })
  }

  async deleteExpense(id: number) {
    const expense = await this.repository.findById(id)
    this.checkOwnership(expense)

    return db.transaction(async (trx) => {
      if (expense.walletId) {
        const wallet = await this.getOwnedWallet(expense.walletId)
        wallet.useTransaction(trx)
        wallet.amount += this.getTotalAmount(expense.amount, expense.fees)
        await wallet.save()
      }

      return this.repository.delete(expense, trx)
    })
  }

  async getExpenseById(id: number) {
    const expense = await this.repository.findById(id)
    this.checkOwnership(expense)
    return expense
  }

  async getAllUserExpenses() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserExpenses(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassExpenses(items: CreateExpensePayload[]) {
    const expenses = []
    for (const item of items) {
      expenses.push(await this.createExpense(item))
    }
    return expenses
  }

  async updateMassExpenses(items: MassUpdateExpensePayload[]) {
    const expenses = []
    for (const item of items) {
      const { id, ...data } = item
      expenses.push(await this.updateExpense(id, data))
    }
    return expenses
  }

  async deleteMassExpenses(ids: number[]) {
    for (const id of ids) {
      await this.deleteExpense(id)
    }
  }
}
