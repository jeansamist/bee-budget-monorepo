import Expense from '#models/expense'
import ExpenseCategory from '#models/expense_category'
import Income from '#models/income'
import IncomeCategory from '#models/income_category'
import InternalTransfer from '#models/internal_transfer'
import User from '#models/user'
import Wallet from '#models/wallet'
import {
  buildInternalTransferExpenseDescription,
  buildInternalTransferIncomeDescription,
  buildInternalTransferName,
  INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME,
  INTERNAL_TRANSFER_INCOME_CATEGORY_NAME,
} from '#utils/internal_transfer'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class InternalTransferSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const [wallets, incomeCategories, expenseCategories, incomes, expenses, existingTransfers] =
      await Promise.all([
        Wallet.query().where('user_id', user.id),
        IncomeCategory.query().where('user_id', user.id),
        ExpenseCategory.query().where('user_id', user.id),
        Income.query().where('user_id', user.id),
        Expense.query().where('user_id', user.id),
        InternalTransfer.query().where('user_id', user.id),
      ])

    const walletByName = new Map(wallets.map((wallet) => [wallet.name, wallet]))
    const incomeCategory = incomeCategories.find(
      (category) => category.name === INTERNAL_TRANSFER_INCOME_CATEGORY_NAME
    )
    const expenseCategory = expenseCategories.find(
      (category) => category.name === INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME
    )

    if (!incomeCategory || !expenseCategory) {
      throw new Error('Missing internal transfer categories for demo seed')
    }

    const orangeMoney = walletByName.get('ORANGE_MONEY')
    const mtnMomo = walletByName.get('MTN_MOMO')
    const physical = walletByName.get('PHYSICAL')

    if (!orangeMoney || !mtnMomo || !physical) {
      throw new Error('Missing required wallets for internal transfer seed')
    }

    const now = DateTime.now()

    const transfers = [
      {
        amount: 60_000,
        fee: 1_000,
        sourceWalletId: orangeMoney.id,
        targetWalletId: physical.id,
        description: 'Cash replenishment for daily spending',
        date: now.minus({ months: 1, days: 7 }),
        userId: user.id,
      },
      {
        amount: 45_000,
        fee: 500,
        sourceWalletId: mtnMomo.id,
        targetWalletId: orangeMoney.id,
        description: 'Move project payout to main mobile wallet',
        date: now.minus({ months: 2, days: 13 }),
        userId: user.id,
      },
    ]

    const existingTransferKeys = new Set(
      existingTransfers.map((transfer) =>
        [
          transfer.sourceWalletId,
          transfer.targetWalletId,
          transfer.amount,
          transfer.fee ?? 0,
          transfer.date.toISODate(),
          transfer.description ?? '',
        ].join('|')
      )
    )

    const missingTransfers = transfers.filter((transfer) => {
      const key = [
        transfer.sourceWalletId,
        transfer.targetWalletId,
        transfer.amount,
        transfer.fee ?? 0,
        transfer.date.toISODate(),
        transfer.description ?? '',
      ].join('|')
      return !existingTransferKeys.has(key)
    })

    const walletNames = new Map(wallets.map((wallet) => [wallet.id, wallet.name]))
    const runningBalances = new Map<number, number>()
    const transferLedger = missingTransfers.flatMap((transfer) => [
      {
        walletId: transfer.sourceWalletId,
        date: transfer.date,
        label: `expense-${transfer.sourceWalletId}-${transfer.targetWalletId}-${transfer.amount}`,
        delta: -(transfer.amount + (transfer.fee ?? 0)),
      },
      {
        walletId: transfer.targetWalletId,
        date: transfer.date,
        label: `income-${transfer.sourceWalletId}-${transfer.targetWalletId}-${transfer.amount}`,
        delta: transfer.amount,
      },
    ])

    const ledger = [
      ...incomes.map((income) => ({
        walletId: income.walletId,
        date: income.date,
        label: `income-${income.id}`,
        delta: income.amount,
      })),
      ...expenses.map((expense) => ({
        walletId: expense.walletId,
        date: expense.date,
        label: `expense-${expense.id}`,
        delta: -(expense.amount + (expense.fees ?? 0)),
      })),
      ...transferLedger,
    ]
      .filter((entry) => entry.walletId !== null)
      .sort((left, right) => {
        const dateDiff = left.date.toMillis() - right.date.toMillis()
        if (dateDiff !== 0) return dateDiff
        return left.label.localeCompare(right.label)
      })

    for (const entry of ledger) {
      const walletId = entry.walletId
      if (walletId === null) continue

      const nextBalance = (runningBalances.get(walletId) ?? 0) + entry.delta
      if (nextBalance < 0) {
        throw new Error(
          `Internal transfer seed would make wallet ${
            walletNames.get(walletId) ?? walletId
          } negative on ${entry.date.toISODate()}`
        )
      }
      runningBalances.set(walletId, nextBalance)
    }

    for (const transferData of missingTransfers) {
      const sourceWallet = wallets.find((wallet) => wallet.id === transferData.sourceWalletId)!
      const targetWallet = wallets.find((wallet) => wallet.id === transferData.targetWalletId)!
      const name = buildInternalTransferName(sourceWallet.name, targetWallet.name)

      const transfer = await InternalTransfer.create({
        ...transferData,
        name,
        linkedExpenseId: null,
        linkedIncomeId: null,
      })

      const expense = await Expense.create({
        name,
        description: buildInternalTransferExpenseDescription(
          transferData.description,
          targetWallet.name
        ),
        amount: transferData.amount,
        fees: transferData.fee,
        expenseCategoryId: expenseCategory.id,
        walletId: sourceWallet.id,
        toContactId: null,
        internalTransferId: transfer.id,
        userId: user.id,
        date: transferData.date,
      })

      const income = await Income.create({
        name,
        description: buildInternalTransferIncomeDescription(
          transferData.description,
          sourceWallet.name
        ),
        amount: transferData.amount,
        incomeCategoryId: incomeCategory.id,
        walletId: targetWallet.id,
        fromContactId: null,
        internalTransferId: transfer.id,
        userId: user.id,
        date: transferData.date,
      })

      transfer.linkedExpenseId = expense.id
      transfer.linkedIncomeId = income.id
      await transfer.save()
    }

    const [seededIncomes, seededExpenses] = await Promise.all([
      Income.query().where('user_id', user.id),
      Expense.query().where('user_id', user.id),
    ])

    const incomeTotals = new Map<number, number>()
    seededIncomes.forEach((income) => {
      if (income.walletId === null) return
      incomeTotals.set(income.walletId, (incomeTotals.get(income.walletId) ?? 0) + income.amount)
    })

    const expenseTotals = new Map<number, number>()
    seededExpenses.forEach((expense) => {
      if (expense.walletId === null) return
      expenseTotals.set(
        expense.walletId,
        (expenseTotals.get(expense.walletId) ?? 0) + expense.amount + (expense.fees ?? 0)
      )
    })

    for (const wallet of wallets) {
      await Wallet.query()
        .where('id', wallet.id)
        .update({
          amount: (incomeTotals.get(wallet.id) ?? 0) - (expenseTotals.get(wallet.id) ?? 0),
        })
    }
  }
}
