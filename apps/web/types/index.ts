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

export type IncomeCategory = {
  id: number
  name: string
  createdAt: string | null
  updatedAt: string | null
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
}

export type Income = {
  id: number
  name: string
  description: string
  amount: number
  date: string | null
  incomeCategoryId: number
  walletId: number | null
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
  createdAt: string | null
  updatedAt: string | null
}
