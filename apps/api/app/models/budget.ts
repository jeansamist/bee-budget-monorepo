import { BudgetSchema } from '#database/schema'
import { belongsTo, computed } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ExpenseCategory from './expense_category.ts'
import User from './user.ts'
import Wallet from './wallet.ts'

export type BudgetTargetType = 'expense_category' | 'wallet'
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'

const PERIOD_UNITS = {
  weekly: 'week',
  monthly: 'month',
  yearly: 'year',
} as const

export default class Budget extends BudgetSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ExpenseCategory)
  declare expenseCategory: BelongsTo<typeof ExpenseCategory>

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  /**
   * Amount spent in the current period, set by the budget service.
   */
  private spentAmount = 0

  setSpent(amount: number) {
    this.spentAmount = amount
    return this
  }

  /**
   * Current period window, e.g. this month for a monthly budget.
   */
  periodRange(now = DateTime.now()) {
    const unit = PERIOD_UNITS[this.period as BudgetPeriod] ?? 'month'
    return { start: now.startOf(unit), end: now.endOf(unit) }
  }

  @computed()
  get spent() {
    return this.spentAmount
  }

  @computed()
  get remaining() {
    return this.amount - this.spentAmount
  }

  @computed()
  get progress() {
    if (this.amount <= 0) return 0
    return Math.round((this.spentAmount / this.amount) * 100)
  }

  @computed()
  get status(): 'ok' | 'warning' | 'exceeded' {
    if (this.spentAmount > this.amount) return 'exceeded'
    if (this.progress >= this.alertThreshold) return 'warning'
    return 'ok'
  }

  @computed()
  get periodStart() {
    return this.periodRange().start.toISODate()
  }

  @computed()
  get periodEnd() {
    return this.periodRange().end.toISODate()
  }
}
