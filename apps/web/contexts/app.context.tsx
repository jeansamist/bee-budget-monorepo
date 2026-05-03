"use client"

import { Contact, ExpenseCategory, IncomeCategory, Wallet, WalletType } from "@/types"
import { createContext, useCallback, useContext, useState } from "react"

const sortByName = <T extends { name: string }>(items: T[]) =>
  [...items].sort((left, right) => left.name.localeCompare(right.name))

const upsertById = <T extends { id: number; name: string }>(items: T[], item: T) =>
  sortByName([
    ...items.filter((existingItem) => existingItem.id !== item.id),
    item,
  ])

type AppContextValue = {
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  expenseCategories: ExpenseCategory[]
  wallets: Wallet[]
  contacts: Contact[]
  addWalletType: (walletType: WalletType) => void
  addIncomeCategory: (incomeCategory: IncomeCategory) => void
  addExpenseCategory: (expenseCategory: ExpenseCategory) => void
  addWallet: (wallet: Wallet) => void
  addContact: (contact: Contact) => void
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
  const [walletTypesState, setWalletTypesState] = useState(walletTypes)
  const [incomeCategoriesState, setIncomeCategoriesState] = useState(incomeCategories)
  const [expenseCategoriesState, setExpenseCategoriesState] = useState(expenseCategories)
  const [walletsState, setWalletsState] = useState(wallets)
  const [contactsState, setContactsState] = useState(contacts)

  const addWalletType = useCallback((walletType: WalletType) => {
    setWalletTypesState((previousWalletTypes) =>
      upsertById(previousWalletTypes, walletType)
    )
  }, [])

  const addIncomeCategory = useCallback((incomeCategory: IncomeCategory) => {
    setIncomeCategoriesState((previousIncomeCategories) =>
      upsertById(previousIncomeCategories, incomeCategory)
    )
  }, [])

  const addExpenseCategory = useCallback((expenseCategory: ExpenseCategory) => {
    setExpenseCategoriesState((previousExpenseCategories) =>
      upsertById(previousExpenseCategories, expenseCategory)
    )
  }, [])

  const addWallet = useCallback((wallet: Wallet) => {
    setWalletsState((previousWallets) => upsertById(previousWallets, wallet))
  }, [])

  const addContact = useCallback((contact: Contact) => {
    setContactsState((previousContacts) => upsertById(previousContacts, contact))
  }, [])

  return (
    <AppContext.Provider
      value={{
        walletTypes: walletTypesState,
        incomeCategories: incomeCategoriesState,
        expenseCategories: expenseCategoriesState,
        wallets: walletsState,
        contacts: contactsState,
        addWalletType,
        addIncomeCategory,
        addExpenseCategory,
        addWallet,
        addContact,
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
