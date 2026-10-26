import { AppHeader } from "@/components/app-header"
import { DataCards } from "@/components/transactions/data-cards"
import { Expenses } from "@/components/transactions/expenses"
import { Incomes } from "@/components/transactions/incomes"
import { InternalTransfers } from "@/components/transactions/internal-transfers"
import { getI18n } from "@/lib/i18n/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bee-budget/ui/tabs"

const TRANSACTION_TABS = ["expenses", "incomes", "internal-transfers"] as const

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const t = await getI18n()
  const defaultTab = TRANSACTION_TABS.includes(
    tab as (typeof TRANSACTION_TABS)[number]
  )
    ? tab
    : "expenses"

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
        ]}
        title={t("app.header.titles.transactions")}
      />
      <DataCards />
      <Tabs defaultValue={defaultTab} className="w-full gap-4 px-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="incomes">Incomes</TabsTrigger>
          <TabsTrigger value="internal-transfers">
            Internal Transfers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Expenses />
        </TabsContent>
        <TabsContent value="incomes">
          <Incomes />
        </TabsContent>
        <TabsContent value="internal-transfers">
          <InternalTransfers />
        </TabsContent>
      </Tabs>
    </main>
  )
}
