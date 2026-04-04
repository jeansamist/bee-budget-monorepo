import { AppHeader } from "@/components/app-header"
import { Expenses } from "@/components/transactions/expenses"
import { Incomes } from "@/components/transactions/incomes"
import { InternalTransfers } from "@/components/transactions/internal-transfers"
import { getI18n } from "@/lib/i18n/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bee-budget/ui/tabs"
export default async function page() {
  const t = await getI18n()
  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
        ]}
        title={t("app.header.titles.transactions")}
      />
      <Tabs defaultValue="expenses" className="w-full px-4">
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
