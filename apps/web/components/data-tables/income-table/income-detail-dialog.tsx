/* eslint-disable @next/next/no-img-element */
"use client"

import { useApp } from "@/contexts/app.context"
import { useScopedI18n } from "@/lib/i18n/client"
import { Contact, Income, IncomeCategory, Wallet, WalletType } from "@/types"
import { cn, findById } from "@bee-budget/functions"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bee-budget/ui/dialog"
import { Separator } from "@bee-budget/ui/separator"
import { useMemo } from "react"

type DetailRowProps = {
  label: string
  children: React.ReactNode
}

const DetailRow = ({ label, children }: DetailRowProps) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
    <span className="text-right text-sm font-medium">{children}</span>
  </div>
)

type IncomeDetailDialogProps = {
  income: Income
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IncomeDetailDialog({
  income,
  open,
  onOpenChange,
}: IncomeDetailDialogProps) {
  const t = useScopedI18n("app.dataTables.incomeTable.detail")
  const { incomeCategories, contacts, wallets, walletTypes } = useApp()

  const category = useMemo<IncomeCategory | undefined>(
    () => findById(incomeCategories, income.incomeCategoryId),
    [incomeCategories, income.incomeCategoryId]
  )

  const contact = useMemo<Contact | undefined>(
    () => (income.fromContactId ? findById(contacts, income.fromContactId) : undefined),
    [contacts, income.fromContactId]
  )

  const wallet = useMemo<Wallet | undefined>(
    () => (income.walletId ? findById(wallets, income.walletId) : undefined),
    [wallets, income.walletId]
  )

  const walletType = useMemo<WalletType | undefined>(
    () => (wallet ? findById(walletTypes, wallet.walletTypeId) : undefined),
    [walletTypes, wallet]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="divide-y">
          <DetailRow label={t("id")}>
            <span className="font-mono text-muted-foreground">
              #{income.id.toString().padStart(5, "0")}
            </span>
          </DetailRow>

          <DetailRow label={t("name")}>{income.name}</DetailRow>

          <DetailRow label={t("description")}>
            {income.description || (
              <span className="text-muted-foreground">{t("noDescription")}</span>
            )}
          </DetailRow>

          <DetailRow label={t("amount")}>
            <span>
              <span className="font-semibold">
                {income.amount.toLocaleString()}
              </span>
              <span className="ml-1 text-muted-foreground">XAF</span>
            </span>
          </DetailRow>

          <DetailRow label={t("date")}>
            {income.date
              ? new Date(income.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "---"}
          </DetailRow>

          {income.internalTransferId && (
            <DetailRow label={t("transfer")}>
              <span className="flex flex-col items-end gap-1">
                <span className="font-mono text-muted-foreground">
                  #{income.internalTransferId.toString().padStart(5, "0")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("manageFromTransfers")}
                </span>
              </span>
            </DetailRow>
          )}

          <Separator />

          <DetailRow label={t("category")}>
            {category ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            ) : (
              "---"
            )}
          </DetailRow>

          <DetailRow label={t("wallet")}>
            {wallet && walletType ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: walletType.color }}
                />
                {wallet.name}
              </span>
            ) : (
              "---"
            )}
          </DetailRow>

          <DetailRow label={t("from")}>
            {contact ? (
              <span className="flex items-center gap-2">
                {contact.image ? (
                  <img
                    src={contact.image}
                    alt={contact.name}
                    className="h-5 w-5 rounded-full"
                  />
                ) : (
                  <span
                    className={cn("inline-block h-2 w-2 rounded-full")}
                    style={{ backgroundColor: contact.color }}
                  />
                )}
                {contact.name}
              </span>
            ) : (
              "---"
            )}
          </DetailRow>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
