import { AppHeader } from "@/components/app-header"
import { IncomeForm } from "@/components/forms/income.form"
import { getI18n } from "@/lib/i18n/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bee-budget/ui/card"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()

  return {
    title: t("app.forms.incomes.create.meta.title"),
    description: t("app.forms.incomes.create.meta.description"),
  }
}

export default async function Page() {
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
          { label: t("app.forms.incomes.create.page.title"), href: "#" },
        ]}
        title={t("app.forms.incomes.create.page.title")}
      />
      <section className="px-4">
        <Card className="container mx-auto">
          <CardHeader>
            <CardTitle>{t("app.forms.incomes.create.page.title")}</CardTitle>
            <CardDescription>
              {t("app.forms.incomes.create.page.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeForm />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
