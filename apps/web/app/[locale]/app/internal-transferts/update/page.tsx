import { AppHeader } from "@/components/app-header"
import { InternalTransferForm } from "@/components/forms/internal-transfer.form"
import { getI18n } from "@/lib/i18n/server"
import { getInternalTransfer } from "@/services/internal-transfers.services"
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
    title: t("app.forms.internalTransfers.update.meta.title"),
    description: t("app.forms.internalTransfers.update.meta.description"),
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
    redirect(`/${locale}/app/transactions?tab=internal-transfers`)
  }

  const response = await getInternalTransfer(Number(id))
  if (!response.success || !response.data) {
    notFound()
  }

  const transfer = response.data
  const t = await getI18n()

  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.transactions"), href: "#" },
          {
            label: t("app.forms.internalTransfers.update.page.title"),
            href: "#",
          },
        ]}
        title={t("app.forms.internalTransfers.update.page.title")}
      />
      <section className="px-4">
        <Card className="container mx-auto">
          <CardHeader>
            <CardTitle>
              {t("app.forms.internalTransfers.update.page.title")}
            </CardTitle>
            <CardDescription>
              {t("app.forms.internalTransfers.update.page.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InternalTransferForm
              resourceId={transfer.id}
              defaultValues={{
                amount: transfer.amount,
                fee: transfer.fee,
                sourceWalletId: transfer.sourceWalletId,
                targetWalletId: transfer.targetWalletId,
                date: parseDateValue(transfer.date),
                description: transfer.description,
              }}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
