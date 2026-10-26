import { AppHeader } from "@/components/app-header"
import { ReportsView } from "@/components/reports/reports-view"
import { getI18n } from "@/lib/i18n/server"
import { getReport } from "@/services/reports.services"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return { title: t("app.header.titles.reports") }
}

export default async function Page() {
  const t = await getI18n()
  // Transactions of the current month by default (the API's default range)
  const result = await getReport({ type: "transactions" })

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.reports"), href: "#" },
        ]}
        title={t("app.header.titles.reports")}
      />
      <ReportsView
        initialReport={result.success ? (result.data ?? null) : null}
      />
    </main>
  )
}
