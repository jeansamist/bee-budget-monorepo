import Expense from '#models/expense'
import ExpenseCategory from '#models/expense_category'
import Income from '#models/income'
import IncomeCategory from '#models/income_category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

type PeriodConfig = {
  count: number
  cursorUnit: 'days' | 'weeks' | 'months' | 'years'
  bucketStartUnit: 'day' | 'week' | 'month' | 'year'
  bucketEndUnit: 'day' | 'week' | 'month' | 'year'
}

type CategoryStat = {
  id: number
  name: string
  color: string
  icon: string | null
  total: number
  count: number
}

type ChartBucket = {
  label: string
  incomes: number
  expenses: number
}

@inject()
export class WalletAnalyticsService {
  constructor(private readonly ctx: HttpContext) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  private getPeriodConfig(period: AnalyticsPeriod): PeriodConfig {
    switch (period) {
      case 'daily':
        return { count: 7, cursorUnit: 'days', bucketStartUnit: 'day', bucketEndUnit: 'day' }
      case 'weekly':
        return { count: 8, cursorUnit: 'weeks', bucketStartUnit: 'week', bucketEndUnit: 'week' }
      case 'monthly':
        return { count: 6, cursorUnit: 'months', bucketStartUnit: 'month', bucketEndUnit: 'month' }
      case 'yearly':
      default:
        return { count: 5, cursorUnit: 'years', bucketStartUnit: 'year', bucketEndUnit: 'year' }
    }
  }

  private buildPeriodLabel(period: AnalyticsPeriod, date: DateTime) {
    switch (period) {
      case 'daily':
        return date.toFormat('ccc')
      case 'weekly':
        return `W${date.weekNumber}`
      case 'monthly':
        return date.toFormat('LLL')
      case 'yearly':
      default:
        return date.toFormat('yyyy')
    }
  }

  private buildBuckets(period: AnalyticsPeriod) {
    const config = this.getPeriodConfig(period)
    const now = DateTime.now()

    return Array.from({ length: config.count }, (_, index) => {
      const bucketDate = now
        .minus({ [config.cursorUnit]: config.count - 1 - index })
        .startOf(config.bucketStartUnit)

      return {
        key: bucketDate.toISODate()!,
        label: this.buildPeriodLabel(period, bucketDate),
        start: bucketDate.startOf(config.bucketStartUnit),
        end: bucketDate.endOf(config.bucketEndUnit),
      }
    })
  }

  async getWalletAnalytics(walletId: number, period: AnalyticsPeriod = 'monthly') {
    const buckets = this.buildBuckets(period)
    const startDate = buckets[0]?.start.toISODate()
    const endDate = buckets.at(-1)?.end.toISODate()

    const [incomes, expenses, incomeCategories, expenseCategories] = await Promise.all([
      Income.query()
        .where('user_id', this.userId)
        .where('wallet_id', walletId)
        .if(startDate !== undefined, (q) => q.where('date', '>=', startDate!))
        .if(endDate !== undefined, (q) => q.where('date', '<=', endDate!))
        .select(['amount', 'date', 'income_category_id']),
      Expense.query()
        .where('user_id', this.userId)
        .where('wallet_id', walletId)
        .if(startDate !== undefined, (q) => q.where('date', '>=', startDate!))
        .if(endDate !== undefined, (q) => q.where('date', '<=', endDate!))
        .select(['amount', 'fees', 'date', 'expense_category_id']),
      IncomeCategory.query().where('user_id', this.userId).select(['id', 'name', 'color', 'icon']),
      ExpenseCategory.query().where('user_id', this.userId).select(['id', 'name', 'color', 'icon']),
    ])

    // Category breakdown stats
    const incomeCategoryMap = new Map<number, CategoryStat>()
    for (const cat of incomeCategories) {
      incomeCategoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        total: 0,
        count: 0,
      })
    }

    const expenseCategoryMap = new Map<number, CategoryStat>()
    for (const cat of expenseCategories) {
      expenseCategoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        total: 0,
        count: 0,
      })
    }

    for (const income of incomes) {
      const stat = incomeCategoryMap.get(income.incomeCategoryId)
      if (stat) {
        stat.total += income.amount
        stat.count += 1
      }
    }

    for (const expense of expenses) {
      const stat = expenseCategoryMap.get(expense.expenseCategoryId)
      if (stat) {
        stat.total += expense.amount + (expense.fees ?? 0)
        stat.count += 1
      }
    }

    const incomeCategoryBreakdown = [...incomeCategoryMap.values()]
      .filter((s) => s.count > 0)
      .sort((a, b) => b.total - a.total)

    const expenseCategoryBreakdown = [...expenseCategoryMap.values()]
      .filter((s) => s.count > 0)
      .sort((a, b) => b.total - a.total)

    // Time series chart data
    const chartData: ChartBucket[] = buckets.map((bucket) => ({
      label: bucket.label,
      incomes: incomes
        .filter((i) => {
          const ms = i.date.toMillis()
          return ms >= bucket.start.toMillis() && ms <= bucket.end.toMillis()
        })
        .reduce((sum, i) => sum + i.amount, 0),
      expenses: expenses
        .filter((e) => {
          const ms = e.date.toMillis()
          return ms >= bucket.start.toMillis() && ms <= bucket.end.toMillis()
        })
        .reduce((sum, e) => sum + e.amount + (e.fees ?? 0), 0),
    }))

    return {
      period,
      chartData,
      incomeCategoryBreakdown,
      expenseCategoryBreakdown,
    }
  }
}
