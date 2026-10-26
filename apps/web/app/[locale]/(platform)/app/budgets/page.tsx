import { AppHeader } from "@/components/app-header"
import { BudgetsView } from "@/components/budgets/budgets-view"
import { getI18n } from "@/lib/i18n/server"
import { getBudgets } from "@/services/budgets.services"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return { title: t("app.header.titles.budgets") }
}

export default async function Page() {
  const t = await getI18n()
  const result = await getBudgets({ fetchAll: true })

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.budgets"), href: "#" },
        ]}
        title={t("app.header.titles.budgets")}
      />
      <BudgetsView initialBudgets={result.success ? (result.data ?? []) : []} />
    </main>
  )
}
