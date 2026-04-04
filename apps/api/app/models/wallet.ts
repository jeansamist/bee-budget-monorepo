import { WalletSchema } from '#database/schema'
import { belongsTo, computed, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Expense from './expense.ts'
import Income from './income.ts'
import User from './user.ts'
import WalletType from './wallet_type.ts'

const MONTHS_TO_SHOW = 5

type WalletMonthData = {
  month: string
  amount: number
}

export default class Wallet extends WalletSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => WalletType)
  declare walletType: BelongsTo<typeof WalletType>

  @hasMany(() => Income)
  declare incomes: HasMany<typeof Income>

  @hasMany(() => Expense)
  declare expenses: HasMany<typeof Expense>

  private buildMonthBuckets() {
    const currentMonth = DateTime.now().startOf('month')

    return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
      const monthDate = currentMonth.minus({ months: MONTHS_TO_SHOW - 1 - index })
      return {
        key: monthDate.toFormat('yyyy-LL'),
        month: monthDate.toFormat('LLL'),
      }
    })
  }

  private computeEvolution(currentAmount: number, previousAmount: number) {
    if (previousAmount === 0) {
      if (currentAmount === 0) return 0
      return currentAmount > 0 ? 100 : -100
    }

    return Math.round(((currentAmount - previousAmount) / Math.abs(previousAmount)) * 100)
  }

  private getMonthlyNetAmounts() {
    const monthBuckets = this.buildMonthBuckets()
    const amountsByMonth = new Map(monthBuckets.map((bucket) => [bucket.key, 0]))

    this.incomes.forEach((income) => {
      if (!income.date) return
      const key = income.date.toFormat('yyyy-LL')
      if (!amountsByMonth.has(key)) return
      amountsByMonth.set(key, (amountsByMonth.get(key) ?? 0) + income.amount)
    })

    this.expenses.forEach((expense) => {
      if (!expense.date) return
      const key = expense.date.toFormat('yyyy-LL')
      if (!amountsByMonth.has(key)) return
      amountsByMonth.set(key, (amountsByMonth.get(key) ?? 0) - expense.amount - (expense.fees ?? 0))
    })

    return { amountsByMonth, monthBuckets }
  }

  @computed()
  get lastMonthsData(): WalletMonthData[] {
    const { amountsByMonth, monthBuckets } = this.getMonthlyNetAmounts()
    const monthEndAmounts = new Map<string, number>()
    let runningAmount = this.amount

    for (const bucket of [...monthBuckets].reverse()) {
      monthEndAmounts.set(bucket.key, runningAmount)
      runningAmount -= amountsByMonth.get(bucket.key) ?? 0
    }

    return monthBuckets.map((bucket) => ({
      month: bucket.month,
      amount: monthEndAmounts.get(bucket.key) ?? 0,
    }))
  }

  @computed()
  get evolution(): number {
    const currentMonthAmount = this.lastMonthsData.at(-1)?.amount ?? 0
    const previousMonthAmount = this.lastMonthsData.at(-2)?.amount ?? 0
    return this.computeEvolution(currentMonthAmount, previousMonthAmount)
  }
}
