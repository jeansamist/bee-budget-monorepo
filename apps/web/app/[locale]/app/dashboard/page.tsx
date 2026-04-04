import { AppHeader } from "@/components/app-header"
import { DataCards } from "@/components/dashboard/data-cards"
import { LastExpenses } from "@/components/dashboard/last-expenses"
import { LastIncomes } from "@/components/dashboard/last-incomes"
import { LastInternalTransfers } from "@/components/dashboard/last-internal-transfers"
import { getI18n } from "@/lib/i18n/server"

export default async function page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.dashboard"), href: "#" },
        ]}
        title={`${t("app.header.welcomeBack")}, Ephraim.`}
      />
      <DataCards />
      <LastExpenses />
      <LastIncomes />
      <LastInternalTransfers />
    </main>
  )
}
