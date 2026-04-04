import Expense from '#models/expense'
import Income from '#models/income'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly'

type AnalyticsPoint = {
  label: string
  amount: number
}

type AnalyticsMetric = {
  total: number
  data: AnalyticsPoint[]
}

type PeriodConfig = {
  count: number
  cursorUnit: 'days' | 'weeks' | 'months'
  bucketStartUnit: 'day' | 'week' | 'month'
  bucketEndUnit: 'day' | 'week' | 'month'
}

@inject()
export class TransactionAnalyticsService {
  constructor(private readonly ctx: HttpContext) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  private getPeriodConfig(period: AnalyticsPeriod): PeriodConfig {
    switch (period) {
      case 'daily':
        return {
          count: 7,
          cursorUnit: 'days',
          bucketStartUnit: 'day',
          bucketEndUnit: 'day',
        }
      case 'weekly':
        return {
          count: 8,
          cursorUnit: 'weeks',
          bucketStartUnit: 'week',
          bucketEndUnit: 'week',
        }
      case 'monthly':
      default:
        return {
          count: 6,
          cursorUnit: 'months',
          bucketStartUnit: 'month',
          bucketEndUnit: 'month',
        }
    }
  }

  private buildPeriodLabel(period: AnalyticsPeriod, date: DateTime) {
    switch (period) {
      case 'daily':
        return date.toFormat('ccc')
      case 'weekly':
        return `W${date.weekNumber}`
      case 'monthly':
      default:
        return date.toFormat('LLL')
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

  private sumMetric(points: AnalyticsPoint[]) {
    return points.reduce((total, point) => total + point.amount, 0)
  }

  async getTransactionAnalytics(period: AnalyticsPeriod = 'monthly') {
    const buckets = this.buildBuckets(period)
    const startDate = buckets[0]?.start.toISODate()
    const endDate = buckets.at(-1)?.end.toISODate()

    const [incomes, expenses] = await Promise.all([
      Income.query()
        .where('user_id', this.userId)
        .if(startDate !== undefined, (query) => query.where('date', '>=', startDate!))
        .if(endDate !== undefined, (query) => query.where('date', '<=', endDate!))
        .select(['amount', 'date']),
      Expense.query()
        .where('user_id', this.userId)
        .if(startDate !== undefined, (query) => query.where('date', '>=', startDate!))
        .if(endDate !== undefined, (query) => query.where('date', '<=', endDate!))
        .select(['amount', 'fees', 'date']),
    ])

    const incomeSeries = buckets.map((bucket) => ({
      label: bucket.label,
      amount: incomes
        .filter((income) => {
          const millis = income.date.toMillis()
          return millis >= bucket.start.toMillis() && millis <= bucket.end.toMillis()
        })
        .reduce((total, income) => total + income.amount, 0),
    }))

    const expenseSeries = buckets.map((bucket) => ({
      label: bucket.label,
      amount: expenses
        .filter((expense) => {
          const millis = expense.date.toMillis()
          return millis >= bucket.start.toMillis() && millis <= bucket.end.toMillis()
        })
        .reduce((total, expense) => total + expense.amount + (expense.fees ?? 0), 0),
    }))

    const feeSeries = buckets.map((bucket) => ({
      label: bucket.label,
      amount: expenses
        .filter((expense) => {
          const millis = expense.date.toMillis()
          return millis >= bucket.start.toMillis() && millis <= bucket.end.toMillis()
        })
        .reduce((total, expense) => total + (expense.fees ?? 0), 0),
    }))

    return {
      period,
      incomes: {
        total: this.sumMetric(incomeSeries),
        data: incomeSeries,
      } satisfies AnalyticsMetric,
      expenses: {
        total: this.sumMetric(expenseSeries),
        data: expenseSeries,
      } satisfies AnalyticsMetric,
      fees: {
        total: this.sumMetric(feeSeries),
        data: feeSeries,
      } satisfies AnalyticsMetric,
    }
  }
}
