export type IndexParams = {
  page?: number
  perPage?: number
  fetchAll?: boolean
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
