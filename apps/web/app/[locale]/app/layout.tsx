import { AppSidebar } from "@/components/app-sidebar"
import { AppProvider } from "@/contexts/app.context"
import { getContacts } from "@/services/contacts.services"
import { getIncomeCategories } from "@/services/income-categories.services"
import { getWalletTypes } from "@/services/wallet-types.services"
import { getWallets } from "@/services/wallets.services"
import { Contact, IncomeCategory, Wallet, WalletType } from "@/types"
import { SidebarInset, SidebarProvider } from "@bee-budget/ui/sidebar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [walletTypes, incomeCategories, wallets, contacts] =
    await Promise.allSettled([
      getWalletTypes({ fetchAll: true }),
      getIncomeCategories({ fetchAll: true }),
      getWallets({ fetchAll: true }),
      getContacts({ fetchAll: true }),
    ])
  if (
    walletTypes.status === "rejected" ||
    incomeCategories.status === "rejected" ||
    wallets.status === "rejected" ||
    contacts.status === "rejected"
  ) {
    // Handle errors as needed, for now we just log them and provide empty arrays
    console.error("Error fetching initial data:", {
      walletTypes:
        walletTypes.status === "rejected" ? walletTypes.reason : null,
      incomeCategories:
        incomeCategories.status === "rejected" ? incomeCategories.reason : null,
      wallets: wallets.status === "rejected" ? wallets.reason : null,
      contacts: contacts.status === "rejected" ? contacts.reason : null,
    })
    return (
      <AppProvider
        walletTypes={[]}
        incomeCategories={[]}
        wallets={[]}
        contacts={[]}
      >
        {children}
      </AppProvider>
    )
  }
  return (
    <AppProvider
      walletTypes={(walletTypes.value.data as WalletType[]) || []}
      incomeCategories={(incomeCategories.value.data as IncomeCategory[]) || []}
      wallets={(wallets.value.data as Wallet[]) || []}
      contacts={(contacts.value.data as Contact[]) || []}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
