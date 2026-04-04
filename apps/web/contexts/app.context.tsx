"use client"

import { Contact, ExpenseCategory, IncomeCategory, Wallet, WalletType } from "@/types"
import { createContext, useContext } from "react"

type AppContextValue = {
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  expenseCategories: ExpenseCategory[]
  wallets: Wallet[]
  contacts: Contact[]
}

const AppContext = createContext<AppContextValue | null>(null)

export type AppProviderProps = {
  children: React.ReactNode
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  expenseCategories: ExpenseCategory[]
  wallets: Wallet[]
  contacts: Contact[]
}

export function AppProvider({
  children,
  walletTypes,
  incomeCategories,
  expenseCategories,
  wallets,
  contacts,
}: AppProviderProps) {
  // Initialize any global state or functions here

  return (
    <AppContext.Provider
      value={{
        walletTypes,
        incomeCategories,
        expenseCategories,
        wallets,
        contacts,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
