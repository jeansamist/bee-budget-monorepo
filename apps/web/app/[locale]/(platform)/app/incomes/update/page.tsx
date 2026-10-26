import { AppHeader } from "@/components/app-header"
import { IncomeForm } from "@/components/forms/income.form"
import { getI18n } from "@/lib/i18n/server"
import { getIncome } from "@/services/incomes.services"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bee-budget/ui/card"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

const parseDateValue = (value: string | null) =>
  value ? new Date(`${value.split("T")[0]}T12:00:00`) : undefined

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()

  return {
    title: t("app.forms.incomes.update.meta.title"),
    description: t("app.forms.incomes.update.meta.description"),
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const [{ locale }, { id }] = await Promise.all([params, searchParams])

  if (!id || Number.isNaN(Number(id))) {
    redirect(`/${locale}/app/transactions?tab=incomes`)
  }

  const response = await getIncome(Number(id))
  if (!response.success || !response.data) {
    notFound()
  }

  const income = response.data
  if (income.internalTransferId) {
    redirect(
      `/${locale}/app/internal-transferts/update?id=${income.internalTransferId}`
    )
  }

  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
          { label: t("app.forms.incomes.update.page.title"), href: "#" },
        ]}
        title={t("app.forms.incomes.update.page.title")}
      />
      <section className="px-4">
        <Card className="container mx-auto">
          <CardHeader>
            <CardTitle>{t("app.forms.incomes.update.page.title")}</CardTitle>
            <CardDescription>
              {t("app.forms.incomes.update.page.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeForm
              resourceId={income.id}
              defaultValues={{
                name: income.name,
                description: income.description,
                amount: income.amount,
                incomeCategoryId: income.incomeCategoryId,
                walletId: income.walletId ?? undefined,
                date: parseDateValue(income.date),
                fromContactId: income.fromContactId,
              }}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
