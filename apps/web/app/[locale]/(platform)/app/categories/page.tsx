import { AppHeader } from "@/components/app-header"
import { CategoriesView } from "@/components/manage/categories-view"
import { getI18n } from "@/lib/i18n/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return { title: t("app.header.titles.categories") }
}

export default async function Page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.categories"), href: "#" },
        ]}
        title={t("app.header.titles.categories")}
      />
      <CategoriesView />
    </main>
  )
}
