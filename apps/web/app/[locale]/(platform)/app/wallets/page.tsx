import { AppHeader } from "@/components/app-header"
import { InternalTransfers } from "@/components/wallets/internal-transfers"
import { WalletsView } from "@/components/wallets/wallets-view"
import { getI18n } from "@/lib/i18n/server"

export default async function page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.wallets"), href: "#" },
        ]}
        title={t("app.header.titles.wallets")}
      />
      <WalletsView />
      <InternalTransfers />
    </main>
  )
}
