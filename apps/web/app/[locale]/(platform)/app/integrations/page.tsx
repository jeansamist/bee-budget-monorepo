import { AppHeader } from "@/components/app-header"
import { IntegrationsView } from "@/components/integrations/integrations-view"
import { getI18n } from "@/lib/i18n/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return { title: t("app.header.titles.integrations") }
}

export default async function Page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.integrations"), href: "#" },
        ]}
        title={t("app.header.titles.integrations")}
      />
      <IntegrationsView />
    </main>
  )
}
