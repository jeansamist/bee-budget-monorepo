"use client"

import { IncomeCategory, Wallet, WalletType } from "@/types"
import { createContext, useContext } from "react"

type AppContextValue = {
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  wallets: Wallet[]
}

const AppContext = createContext<AppContextValue | null>(null)

export type AppProviderProps = {
  children: React.ReactNode
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  wallets: Wallet[]
}

export function AppProvider({
  children,
  walletTypes,
  incomeCategories,
  wallets,
}: AppProviderProps) {
  // Initialize any global state or functions here

  return (
    <AppContext.Provider
      value={{
        walletTypes,
        incomeCategories,
        wallets,
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
