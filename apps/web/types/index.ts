export type IndexParams = {
  page?: number
  perPage?: number
  fetchAll?: boolean
  walletId?: number
}

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export type ApiSuccessResponse<T> = {
  success: true
  data?: T
  message?: string
  meta?: PaginationMeta
}

export type ApiFailureResponse<T = unknown> = {
  success: false
  data?: T
  message?: string
}

export type ApiResponse<T, E = unknown> = ApiSuccessResponse<T> | ApiFailureResponse<E>

export type MassDeleteResult = {
  count: number
}

export type AuthAccessTokenPayload = {
  accessToken: unknown
}

export type User = {
  id: number
  avatar: string | null
  firstName: string
  lastName: string
  email: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string | null
  initials: string
}

export type Contact = {
  id: number
  name: string
  image: string | null
  color: string
  type: 'person' | 'entreprise' | 'other'
  phoneNumber: string | null
  email: string | null
  comments: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type IncomeCategory = {
  id: number
  name: string
  createdAt: string | null
  updatedAt: string | null
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
  defaultContactId: number | null
  isSystem: boolean
}

export type ExpenseCategory = {
  id: number
  name: string
  createdAt: string | null
  updatedAt: string | null
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
  defaultContactId: number | null
  isSystem: boolean
}

export type Income = {
  id: number
  name: string
  description: string
  amount: number
  date: string | null
  incomeCategoryId: number
  walletId: number | null
  fromContactId: number | null
  internalTransferId: number | null
  isInternalTransfer: boolean
  createdAt: string | null
  updatedAt: string | null
}

export type Expense = {
  id: number
  name: string
  description: string
  amount: number
  fees: number | null
  date: string | null
  expenseCategoryId: number
  walletId: number | null
  toContactId: number | null
  internalTransferId: number | null
  isInternalTransfer: boolean
  createdAt: string | null
  updatedAt: string | null
}

export type InternalTransfer = {
  id: number
  name: string
  description: string | null
  amount: number
  fee: number | null
  sourceWalletId: number
  targetWalletId: number
  linkedExpenseId: number | null
  linkedIncomeId: number | null
  date: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type WalletType = {
  id: number
  name: string
  color: string
  icon: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type Wallet = {
  id: number
  name: string
  description: string
  walletTypeId: number
  image: string | null
  amount: number
  lastMonthsData: { month: string; amount: number }[]
  evolution: number
  createdAt: string | null
  updatedAt: string | null
}

export type WalletAnalyticsPeriod = "daily" | "weekly" | "monthly" | "yearly"

export type WalletAnalyticsCategoryStat = {
  id: number
  name: string
  color: string
  icon: string | null
  total: number
  count: number
}

export type WalletAnalyticsChartBucket = {
  label: string
  incomes: number
  expenses: number
}

export type WalletAnalytics = {
  period: WalletAnalyticsPeriod
  chartData: WalletAnalyticsChartBucket[]
  incomeCategoryBreakdown: WalletAnalyticsCategoryStat[]
  expenseCategoryBreakdown: WalletAnalyticsCategoryStat[]
}

export type TransactionAnalyticsPeriod = "daily" | "weekly" | "monthly" | "yearly"

export type TransactionAnalyticsPoint = {
  label: string
  amount: number
}

export type TransactionAnalyticsMetric = {
  total: number
  data: TransactionAnalyticsPoint[]
}

export type TransactionAnalytics = {
  period: TransactionAnalyticsPeriod
  incomes: TransactionAnalyticsMetric
  expenses: TransactionAnalyticsMetric
  fees: TransactionAnalyticsMetric
}

export type BudgetTargetType = 'expense_category' | 'wallet'
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'
export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export type Budget = {
  id: number
  name: string
  targetType: BudgetTargetType
  expenseCategoryId: number | null
  walletId: number | null
  amount: number
  period: BudgetPeriod
  alertThreshold: number
  spent: number
  remaining: number
  progress: number
  status: BudgetStatus
  periodStart: string
  periodEnd: string
  createdAt: string | null
  updatedAt: string | null
}

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
export type ReportColumnKind = 'text' | 'date' | 'amount' | 'number' | 'percent'

export type Report = {
  type: ReportType
  from: string
  to: string
  generatedAt: string
  columns: { key: string; kind: ReportColumnKind }[]
  rows: Record<string, string | number | null>[]
  totals: Record<string, number>
}

export const AI_PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "mistral",
] as const

export type AiProviderName = (typeof AI_PROVIDERS)[number]

export type AiProvider = {
  id: number
  provider: AiProviderName
  // Last characters of the key, the key itself never reaches the browser
  keyHint: string
  createdAt: string
  updatedAt: string
}

export type AiModel = { id: string; name: string }

export type AiProviderModels = {
  provider: AiProviderName
  models: AiModel[]
  error: string | null
}
