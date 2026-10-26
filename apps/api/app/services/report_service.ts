import Budget from '#models/budget'
import { BudgetService } from '#services/budget_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export const REPORT_TYPES = [
  'transactions',
  'cash_flow',
  'expenses_by_category',
  'incomes_by_category',
  'wallets',
  'contacts',
  'budgets',
] as const

export type ReportType = (typeof REPORT_TYPES)[number]

type ColumnKind = 'text' | 'date' | 'amount' | 'number' | 'percent'
type ReportColumn = { key: string; kind: ColumnKind }
type ReportRow = Record<string, string | number | null>

export type Report = {
  type: ReportType
  from: string
  to: string
  generatedAt: string
  columns: ReportColumn[]
  rows: ReportRow[]
  totals: Record<string, number>
}

type ReportOptions = {
  type: ReportType
  from?: string
  to?: string
  walletIds?: number[]
}

type IncomeRow = {
  date: Date | string
  name: string
  amount: number
  category: string | null
  wallet: string | null
  walletId: number | null
  contact: string | null
}

type ExpenseRow = IncomeRow & { fees: number | null }

// Label for transfer fees when they show up next to expense categories
const TRANSFER_FEES_LABEL = 'Transfer fees'

@inject()
export class ReportService {
  constructor(
    private readonly ctx: HttpContext,
    private readonly budgetService: BudgetService
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  /**
   * Whole days, both ends included. Defaults to the current month.
   */
  private resolveRange(from?: string, to?: string) {
    const now = DateTime.now()
    const start = from ? DateTime.fromISO(from).startOf('day') : now.startOf('month')
    const end = to ? DateTime.fromISO(to).endOf('day') : now.endOf('month')
    return start <= end ? { start, end } : { start: end.startOf('day'), end: start.endOf('day') }
  }

  async generate(options: ReportOptions): Promise<Report> {
    const { start, end } = this.resolveRange(options.from, options.to)
    const walletIds = options.walletIds?.length ? options.walletIds : undefined
    const builders: Record<
      ReportType,
      () => Promise<Omit<Report, 'type' | 'from' | 'to' | 'generatedAt'>>
    > = {
      transactions: () => this.transactions(start, end, walletIds),
      cash_flow: () => this.cashFlow(start, end, walletIds),
      expenses_by_category: () => this.expensesByCategory(start, end, walletIds),
      incomes_by_category: () => this.incomesByCategory(start, end, walletIds),
      wallets: () => this.wallets(start, end, walletIds),
      contacts: () => this.contacts(start, end, walletIds),
      budgets: () => this.budgets(),
    }

    return {
      type: options.type,
      from: start.toISODate()!,
      to: end.toISODate()!,
      generatedAt: DateTime.now().toISO()!,
      ...(await builders[options.type]()),
    }
  }

  // ---------------------------------------------------------------------------
  // Data access
  // ---------------------------------------------------------------------------

  /** Incomes in range; `transfers` selects transfer-linked rows instead of real incomes. */
  private incomes(start: DateTime, end: DateTime, walletIds?: number[], transfers = false) {
    const query = db
      .from('incomes as i')
      .leftJoin('income_categories as c', 'c.id', 'i.income_category_id')
      .leftJoin('wallets as w', 'w.id', 'i.wallet_id')
      .leftJoin('contacts as ct', 'ct.id', 'i.from_contact_id')
      .where('i.user_id', this.userId)
      .whereBetween('i.date', [start.toSQL()!, end.toSQL()!])
      .select(
        'i.date',
        'i.name',
        'i.amount',
        'c.name as category',
        'w.name as wallet',
        'i.wallet_id as walletId',
        'ct.name as contact'
      )
      .orderBy('i.date', 'asc')
    if (transfers) query.whereNotNull('i.internal_transfer_id')
    else query.whereNull('i.internal_transfer_id')
    if (walletIds) query.whereIn('i.wallet_id', walletIds)
    return query as unknown as Promise<IncomeRow[]>
  }

  private expenses(start: DateTime, end: DateTime, walletIds?: number[], transfers = false) {
    const query = db
      .from('expenses as e')
      .leftJoin('expense_categories as c', 'c.id', 'e.expense_category_id')
      .leftJoin('wallets as w', 'w.id', 'e.wallet_id')
      .leftJoin('contacts as ct', 'ct.id', 'e.to_contact_id')
      .where('e.user_id', this.userId)
      .whereBetween('e.date', [start.toSQL()!, end.toSQL()!])
      .select(
        'e.date',
        'e.name',
        'e.amount',
        'e.fees',
        'c.name as category',
        'w.name as wallet',
        'e.wallet_id as walletId',
        'ct.name as contact'
      )
      .orderBy('e.date', 'asc')
    if (transfers) query.whereNotNull('e.internal_transfer_id')
    else query.whereNull('e.internal_transfer_id')
    if (walletIds) query.whereIn('e.wallet_id', walletIds)
    return query as unknown as Promise<ExpenseRow[]>
  }

  private internalTransfers(start: DateTime, end: DateTime, walletIds?: number[]) {
    const query = db
      .from('internal_transfers as t')
      .leftJoin('wallets as sw', 'sw.id', 't.source_wallet_id')
      .leftJoin('wallets as tw', 'tw.id', 't.target_wallet_id')
      .where('t.user_id', this.userId)
      .whereBetween('t.date', [start.toSQL()!, end.toSQL()!])
      .select('t.date', 't.name', 't.amount', 't.fee', 'sw.name as source', 'tw.name as target')
      .orderBy('t.date', 'asc')
    if (walletIds) {
      query.where((q) =>
        q.whereIn('t.source_wallet_id', walletIds).orWhereIn('t.target_wallet_id', walletIds)
      )
    }
    return query as unknown as Promise<
      {
        date: Date | string
        name: string
        amount: number
        fee: number | null
        source: string | null
        target: string | null
      }[]
    >
  }

  private toDate(value: Date | string) {
    return value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromSQL(value)
  }

  private sum<T>(items: T[], pick: (item: T) => number) {
    return items.reduce((total, item) => total + pick(item), 0)
  }

  private share(part: number, total: number) {
    return total === 0 ? 0 : Math.round((part / total) * 1000) / 10
  }

  // ---------------------------------------------------------------------------
  // Reports
  // ---------------------------------------------------------------------------

  private async transactions(start: DateTime, end: DateTime, walletIds?: number[]) {
    const [incomes, expenses, transfers] = await Promise.all([
      this.incomes(start, end, walletIds),
      this.expenses(start, end, walletIds),
      this.internalTransfers(start, end, walletIds),
    ])

    const rows: (ReportRow & { sortKey: number })[] = [
      ...incomes.map((income) => ({
        date: this.toDate(income.date).toISODate(),
        kind: 'income',
        name: income.name,
        category: income.category,
        wallet: income.wallet,
        contact: income.contact,
        amount: income.amount,
        fees: 0,
        sortKey: this.toDate(income.date).toMillis(),
      })),
      ...expenses.map((expense) => ({
        date: this.toDate(expense.date).toISODate(),
        kind: 'expense',
        name: expense.name,
        category: expense.category,
        wallet: expense.wallet,
        contact: expense.contact,
        amount: -expense.amount,
        fees: expense.fees ?? 0,
        sortKey: this.toDate(expense.date).toMillis(),
      })),
      ...transfers.map((transfer) => ({
        date: this.toDate(transfer.date).toISODate(),
        kind: 'transfer',
        name: transfer.name,
        category: null,
        wallet: `${transfer.source ?? '?'} → ${transfer.target ?? '?'}`,
        contact: null,
        amount: transfer.amount,
        fees: transfer.fee ?? 0,
        sortKey: this.toDate(transfer.date).toMillis(),
      })),
    ]
    rows.sort((a, b) => a.sortKey - b.sortKey)

    const totalIncomes = this.sum(incomes, (income) => income.amount)
    const totalExpenses = this.sum(expenses, (expense) => expense.amount)
    const totalFees =
      this.sum(expenses, (expense) => expense.fees ?? 0) +
      this.sum(transfers, (transfer) => transfer.fee ?? 0)

    return {
      columns: [
        { key: 'date', kind: 'date' as const },
        { key: 'kind', kind: 'text' as const },
        { key: 'name', kind: 'text' as const },
        { key: 'category', kind: 'text' as const },
        { key: 'wallet', kind: 'text' as const },
        { key: 'contact', kind: 'text' as const },
        { key: 'amount', kind: 'amount' as const },
        { key: 'fees', kind: 'amount' as const },
      ],
      rows: rows.map(({ sortKey, ...row }) => row),
      totals: {
        incomes: totalIncomes,
        expenses: totalExpenses,
        fees: totalFees,
        net: totalIncomes - totalExpenses - totalFees,
        count: rows.length,
      },
    }
  }

  private async cashFlow(start: DateTime, end: DateTime, walletIds?: number[]) {
    const [incomes, expenses, transferExpenses] = await Promise.all([
      this.incomes(start, end, walletIds),
      this.expenses(start, end, walletIds),
      this.expenses(start, end, walletIds, true),
    ])

    // Daily up to ~6 weeks, monthly up to ~13 months, yearly beyond
    const days = end.diff(start, 'days').days
    const unit = days <= 45 ? 'day' : days <= 400 ? 'month' : 'year'
    const format = { day: 'yyyy-LL-dd', month: 'yyyy-LL', year: 'yyyy' }[unit]

    const buckets = new Map<string, { incomes: number; expenses: number }>()
    for (let cursor = start.startOf(unit); cursor <= end; cursor = cursor.plus({ [unit]: 1 })) {
      buckets.set(cursor.toFormat(format), { incomes: 0, expenses: 0 })
    }
    const add = (date: Date | string, field: 'incomes' | 'expenses', amount: number) => {
      const bucket = buckets.get(this.toDate(date).toFormat(format))
      if (bucket) bucket[field] += amount
    }
    incomes.forEach((income) => add(income.date, 'incomes', income.amount))
    expenses.forEach((expense) =>
      add(expense.date, 'expenses', expense.amount + (expense.fees ?? 0))
    )
    // A transfer only costs its fee
    transferExpenses.forEach((expense) => add(expense.date, 'expenses', expense.fees ?? 0))

    const rows = [...buckets.entries()].map(([period, bucket]) => ({
      period,
      incomes: bucket.incomes,
      expenses: bucket.expenses,
      net: bucket.incomes - bucket.expenses,
    }))
    const totalIncomes = this.sum(rows, (row) => row.incomes)
    const totalExpenses = this.sum(rows, (row) => row.expenses)

    return {
      columns: [
        { key: 'period', kind: 'text' as const },
        { key: 'incomes', kind: 'amount' as const },
        { key: 'expenses', kind: 'amount' as const },
        { key: 'net', kind: 'amount' as const },
      ],
      rows,
      totals: { incomes: totalIncomes, expenses: totalExpenses, net: totalIncomes - totalExpenses },
    }
  }

  private groupByCategory(items: { category: string | null; total: number }[]) {
    const groups = new Map<string, { count: number; total: number }>()
    for (const item of items) {
      const key = item.category ?? '—'
      const group = groups.get(key) ?? { count: 0, total: 0 }
      group.count += 1
      group.total += item.total
      groups.set(key, group)
    }
    const grandTotal = this.sum([...groups.values()], (group) => group.total)
    const rows = [...groups.entries()]
      .map(([category, group]) => ({
        category,
        count: group.count,
        total: group.total,
        share: this.share(group.total, grandTotal),
      }))
      .sort((a, b) => b.total - a.total)

    return {
      columns: [
        { key: 'category', kind: 'text' as const },
        { key: 'count', kind: 'number' as const },
        { key: 'total', kind: 'amount' as const },
        { key: 'share', kind: 'percent' as const },
      ],
      rows,
      totals: { total: grandTotal, count: this.sum(rows, (row) => row.count) },
    }
  }

  private async expensesByCategory(start: DateTime, end: DateTime, walletIds?: number[]) {
    const [expenses, transferExpenses] = await Promise.all([
      this.expenses(start, end, walletIds),
      this.expenses(start, end, walletIds, true),
    ])
    return this.groupByCategory([
      ...expenses.map((expense) => ({
        category: expense.category,
        total: expense.amount + (expense.fees ?? 0),
      })),
      ...transferExpenses
        .filter((expense) => (expense.fees ?? 0) > 0)
        .map((expense) => ({ category: TRANSFER_FEES_LABEL, total: expense.fees ?? 0 })),
    ])
  }

  private async incomesByCategory(start: DateTime, end: DateTime, walletIds?: number[]) {
    const incomes = await this.incomes(start, end, walletIds)
    return this.groupByCategory(
      incomes.map((income) => ({ category: income.category, total: income.amount }))
    )
  }

  private async wallets(start: DateTime, end: DateTime, walletIds?: number[]) {
    const walletsQuery = db
      .from('wallets as w')
      .leftJoin('wallet_types as wt', 'wt.id', 'w.wallet_type_id')
      .where('w.user_id', this.userId)
      .select('w.id', 'w.name', 'w.amount', 'wt.name as type')
      .orderBy('w.name', 'asc')
    if (walletIds) walletsQuery.whereIn('w.id', walletIds)

    const [wallets, incomes, expenses, transferIncomes, transferExpenses] = await Promise.all([
      walletsQuery as unknown as Promise<
        { id: number; name: string; amount: number; type: string | null }[]
      >,
      this.incomes(start, end, walletIds),
      this.expenses(start, end, walletIds),
      this.incomes(start, end, walletIds, true),
      this.expenses(start, end, walletIds, true),
    ])

    const rows = wallets.map((wallet) => {
      const own = <T extends { walletId: number | null }>(items: T[]) =>
        items.filter((item) => item.walletId === wallet.id)
      const walletIncomes = this.sum(own(incomes), (income) => income.amount)
      const walletExpenses = this.sum(own(expenses), (e) => e.amount + (e.fees ?? 0))
      const transfersIn = this.sum(own(transferIncomes), (income) => income.amount)
      const transfersOut = this.sum(own(transferExpenses), (e) => e.amount + (e.fees ?? 0))
      return {
        wallet: wallet.name,
        type: wallet.type,
        incomes: walletIncomes,
        expenses: walletExpenses,
        transfersIn,
        transfersOut,
        net: walletIncomes - walletExpenses + transfersIn - transfersOut,
        balance: wallet.amount,
      }
    })

    return {
      columns: [
        { key: 'wallet', kind: 'text' as const },
        { key: 'type', kind: 'text' as const },
        { key: 'incomes', kind: 'amount' as const },
        { key: 'expenses', kind: 'amount' as const },
        { key: 'transfersIn', kind: 'amount' as const },
        { key: 'transfersOut', kind: 'amount' as const },
        { key: 'net', kind: 'amount' as const },
        { key: 'balance', kind: 'amount' as const },
      ],
      rows,
      totals: {
        incomes: this.sum(rows, (row) => row.incomes),
        expenses: this.sum(rows, (row) => row.expenses),
        net: this.sum(rows, (row) => row.net),
        balance: this.sum(rows, (row) => row.balance),
      },
    }
  }

  private async contacts(start: DateTime, end: DateTime, walletIds?: number[]) {
    const [incomes, expenses] = await Promise.all([
      this.incomes(start, end, walletIds),
      this.expenses(start, end, walletIds),
    ])
    const groups = new Map<string, { received: number; paid: number; count: number }>()
    const add = (contact: string | null, field: 'received' | 'paid', amount: number) => {
      if (!contact) return
      const group = groups.get(contact) ?? { received: 0, paid: 0, count: 0 }
      group[field] += amount
      group.count += 1
      groups.set(contact, group)
    }
    incomes.forEach((income) => add(income.contact, 'received', income.amount))
    expenses.forEach((expense) =>
      add(expense.contact, 'paid', expense.amount + (expense.fees ?? 0))
    )

    const rows = [...groups.entries()]
      .map(([contact, group]) => ({
        contact,
        count: group.count,
        received: group.received,
        paid: group.paid,
        net: group.received - group.paid,
      }))
      .sort((a, b) => b.received + b.paid - (a.received + a.paid))

    return {
      columns: [
        { key: 'contact', kind: 'text' as const },
        { key: 'count', kind: 'number' as const },
        { key: 'received', kind: 'amount' as const },
        { key: 'paid', kind: 'amount' as const },
        { key: 'net', kind: 'amount' as const },
      ],
      rows,
      totals: {
        received: this.sum(rows, (row) => row.received),
        paid: this.sum(rows, (row) => row.paid),
        net: this.sum(rows, (row) => row.net),
      },
    }
  }

  /** Budgets are always reported for their current period. */
  private async budgets() {
    const budgets = await Budget.query()
      .where('user_id', this.userId)
      .preload('expenseCategory')
      .preload('wallet')
      .orderBy('created_at', 'asc')
    await Promise.all(budgets.map((budget) => this.budgetService.computeSpent(budget)))

    const rows = budgets.map((budget) => ({
      budget: budget.name,
      target:
        budget.targetType === 'wallet'
          ? (budget.wallet?.name ?? null)
          : (budget.expenseCategory?.name ?? null),
      period: budget.period,
      from: budget.periodStart,
      to: budget.periodEnd,
      amount: budget.amount,
      spent: budget.spent,
      remaining: budget.remaining,
      progress: budget.progress,
      status: budget.status,
    }))

    return {
      columns: [
        { key: 'budget', kind: 'text' as const },
        { key: 'target', kind: 'text' as const },
        { key: 'period', kind: 'text' as const },
        { key: 'from', kind: 'date' as const },
        { key: 'to', kind: 'date' as const },
        { key: 'amount', kind: 'amount' as const },
        { key: 'spent', kind: 'amount' as const },
        { key: 'remaining', kind: 'amount' as const },
        { key: 'progress', kind: 'percent' as const },
        { key: 'status', kind: 'text' as const },
      ],
      rows,
      totals: {
        amount: this.sum(rows, (row) => row.amount),
        spent: this.sum(rows, (row) => row.spent),
        remaining: this.sum(rows, (row) => row.remaining),
      },
    }
  }
}
