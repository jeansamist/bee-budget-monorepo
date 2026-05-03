import { AppHeader } from "@/components/app-header"
import { ExpenseForm } from "@/components/forms/expense.form"
import { getI18n } from "@/lib/i18n/server"
import { getExpense } from "@/services/expenses.services"
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
    title: t("app.forms.expenses.update.meta.title"),
    description: t("app.forms.expenses.update.meta.description"),
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
    redirect(`/${locale}/app/transactions?tab=expenses`)
  }

  const response = await getExpense(Number(id))
  if (!response.success || !response.data) {
    notFound()
  }

  const expense = response.data
  if (expense.internalTransferId) {
    redirect(
      `/${locale}/app/internal-transferts/update?id=${expense.internalTransferId}`
    )
  }

  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
          { label: t("app.forms.expenses.update.page.title"), href: "#" },
        ]}
        title={t("app.forms.expenses.update.page.title")}
      />
      <section className="px-4">
        <Card className="container mx-auto">
          <CardHeader>
            <CardTitle>{t("app.forms.expenses.update.page.title")}</CardTitle>
            <CardDescription>
              {t("app.forms.expenses.update.page.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              resourceId={expense.id}
              defaultValues={{
                name: expense.name,
                description: expense.description,
                amount: expense.amount,
                fees: expense.fees,
                expenseCategoryId: expense.expenseCategoryId,
                walletId: expense.walletId ?? undefined,
                date: parseDateValue(expense.date),
                toContactId: expense.toContactId,
              }}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
