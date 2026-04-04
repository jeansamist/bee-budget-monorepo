import { AnalyticView } from "@/components/analytics/analytic-view"
import { AppHeader } from "@/components/app-header"
import { getI18n } from "@/lib/i18n/server"

export default async function page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.analytics"), href: "#" },
        ]}
        title={t("app.header.titles.analytics")}
      />
      <AnalyticView />
    </main>
  )
}
