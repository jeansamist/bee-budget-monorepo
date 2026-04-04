import { AppSidebar } from "@/components/app-sidebar"
import { AppProvider } from "@/contexts/app.context"
import { getContacts } from "@/services/contacts.services"
import { getExpenseCategories } from "@/services/expense-categories.services"
import { getIncomeCategories } from "@/services/income-categories.services"
import { getWalletTypes } from "@/services/wallet-types.services"
import { getWallets } from "@/services/wallets.services"
import {
  Contact,
  ExpenseCategory,
  IncomeCategory,
  Wallet,
  WalletType,
} from "@/types"
import { SidebarInset, SidebarProvider } from "@bee-budget/ui/sidebar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [walletTypes, incomeCategories, expenseCategories, wallets, contacts] =
    await Promise.allSettled([
      getWalletTypes({ fetchAll: true }),
      getIncomeCategories({ fetchAll: true }),
      getExpenseCategories({ fetchAll: true }),
      getWallets({ fetchAll: true }),
      getContacts({ fetchAll: true }),
    ])
  if (
    walletTypes.status === "rejected" ||
    incomeCategories.status === "rejected" ||
    expenseCategories.status === "rejected" ||
    wallets.status === "rejected" ||
    contacts.status === "rejected"
  ) {
    // Handle errors as needed, for now we just log them and provide empty arrays
    console.error("Error fetching initial data:", {
      walletTypes:
        walletTypes.status === "rejected" ? walletTypes.reason : null,
      incomeCategories:
        incomeCategories.status === "rejected" ? incomeCategories.reason : null,
      expenseCategories:
        expenseCategories.status === "rejected"
          ? expenseCategories.reason
          : null,
      wallets: wallets.status === "rejected" ? wallets.reason : null,
      contacts: contacts.status === "rejected" ? contacts.reason : null,
    })
    return (
      <AppProvider
        walletTypes={[]}
        incomeCategories={[]}
        expenseCategories={[]}
        wallets={[]}
        contacts={[]}
      >
        {children}
      </AppProvider>
    )
  }
  return (
    <AppProvider
      walletTypes={(walletTypes.value?.data as WalletType[]) || []}
      incomeCategories={
        (incomeCategories.value?.data as IncomeCategory[]) || []
      }
      expenseCategories={
        (expenseCategories.value?.data as ExpenseCategory[]) || []
      }
      wallets={(wallets.value?.data as Wallet[]) || []}
      contacts={(contacts.value?.data as Contact[]) || []}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
