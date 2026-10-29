"use client"

import {
  AiProvider,
  Contact,
  ExpenseCategory,
  IncomeCategory,
  Wallet,
  WalletType,
} from "@/types"
import { createContext, useCallback, useContext, useState } from "react"

const sortByName = <T extends { name: string }>(items: T[]) =>
  [...items].sort((left, right) => left.name.localeCompare(right.name))

const upsertById = <T extends { id: number; name: string }>(
  items: T[],
  item: T
) =>
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
  aiProviders: AiProvider[]
  addWalletType: (walletType: WalletType) => void
  addIncomeCategory: (incomeCategory: IncomeCategory) => void
  addExpenseCategory: (expenseCategory: ExpenseCategory) => void
  addWallet: (wallet: Wallet) => void
  addContact: (contact: Contact) => void
  removeWalletType: (id: number) => void
  removeIncomeCategory: (id: number) => void
  removeExpenseCategory: (id: number) => void
  removeWallet: (id: number) => void
  setAiProviders: (aiProviders: AiProvider[]) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export type AppProviderProps = {
  children: React.ReactNode
  walletTypes: WalletType[]
  incomeCategories: IncomeCategory[]
  expenseCategories: ExpenseCategory[]
  wallets: Wallet[]
  contacts: Contact[]
  aiProviders: AiProvider[]
}

export function AppProvider({
  children,
  walletTypes,
  incomeCategories,
  expenseCategories,
  wallets,
  contacts,
  aiProviders,
}: AppProviderProps) {
  const [walletTypesState, setWalletTypesState] = useState(walletTypes)
  const [incomeCategoriesState, setIncomeCategoriesState] =
    useState(incomeCategories)
  const [expenseCategoriesState, setExpenseCategoriesState] =
    useState(expenseCategories)
  const [walletsState, setWalletsState] = useState(wallets)
  const [contactsState, setContactsState] = useState(contacts)
  const [aiProvidersState, setAiProviders] = useState(aiProviders)

  // A router.refresh() (e.g. after the AI assistant changed data) brings new
  // server data: it replaces the local copies.
  const [serverData, setServerData] = useState({
    walletTypes,
    incomeCategories,
    expenseCategories,
    wallets,
    contacts,
  })
  if (
    serverData.walletTypes !== walletTypes ||
    serverData.incomeCategories !== incomeCategories ||
    serverData.expenseCategories !== expenseCategories ||
    serverData.wallets !== wallets ||
    serverData.contacts !== contacts
  ) {
    setServerData({
      walletTypes,
      incomeCategories,
      expenseCategories,
      wallets,
      contacts,
    })
    setWalletTypesState(walletTypes)
    setIncomeCategoriesState(incomeCategories)
    setExpenseCategoriesState(expenseCategories)
    setWalletsState(wallets)
    setContactsState(contacts)
  }

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
    setContactsState((previousContacts) =>
      upsertById(previousContacts, contact)
    )
  }, [])

  const removeWalletType = useCallback((id: number) => {
    setWalletTypesState((previous) => previous.filter((item) => item.id !== id))
    // The API deletes the wallets of a deleted type as well
    setWalletsState((previous) =>
      previous.filter((wallet) => wallet.walletTypeId !== id)
    )
  }, [])

  const removeIncomeCategory = useCallback((id: number) => {
    setIncomeCategoriesState((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }, [])

  const removeExpenseCategory = useCallback((id: number) => {
    setExpenseCategoriesState((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }, [])

  const removeWallet = useCallback((id: number) => {
    setWalletsState((previous) => previous.filter((item) => item.id !== id))
  }, [])

  return (
    <AppContext.Provider
      value={{
        walletTypes: walletTypesState,
        incomeCategories: incomeCategoriesState,
        expenseCategories: expenseCategoriesState,
        wallets: walletsState,
        contacts: contactsState,
        aiProviders: aiProvidersState,
        addWalletType,
        addIncomeCategory,
        addExpenseCategory,
        addWallet,
        addContact,
        removeWalletType,
        removeIncomeCategory,
        removeExpenseCategory,
        removeWallet,
        setAiProviders,
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
