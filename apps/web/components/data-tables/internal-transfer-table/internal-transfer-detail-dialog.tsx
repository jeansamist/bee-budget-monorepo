"use client"

import { useApp } from "@/contexts/app.context"
import { useScopedI18n } from "@/lib/i18n/client"
import { InternalTransfer, Wallet, WalletType } from "@/types"
import { findById } from "@bee-budget/functions"
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

type InternalTransferDetailDialogProps = {
  transfer: InternalTransfer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InternalTransferDetailDialog({
  transfer,
  open,
  onOpenChange,
}: InternalTransferDetailDialogProps) {
  const t = useScopedI18n("app.dataTables.internalTransferTable.detail")
  const { wallets, walletTypes } = useApp()
  const totalDebit = transfer.amount + (transfer.fee ?? 0)

  const sourceWallet = useMemo<Wallet | undefined>(
    () => findById(wallets, transfer.sourceWalletId),
    [wallets, transfer.sourceWalletId]
  )
  const targetWallet = useMemo<Wallet | undefined>(
    () => findById(wallets, transfer.targetWalletId),
    [wallets, transfer.targetWalletId]
  )

  const sourceWalletType = useMemo<WalletType | undefined>(
    () =>
      sourceWallet ? findById(walletTypes, sourceWallet.walletTypeId) : undefined,
    [walletTypes, sourceWallet]
  )

  const targetWalletType = useMemo<WalletType | undefined>(
    () =>
      targetWallet ? findById(walletTypes, targetWallet.walletTypeId) : undefined,
    [walletTypes, targetWallet]
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
              #{transfer.id.toString().padStart(5, "0")}
            </span>
          </DetailRow>

          <DetailRow label={t("name")}>{transfer.name}</DetailRow>

          <DetailRow label={t("description")}>
            {transfer.description || (
              <span className="text-muted-foreground">{t("noDescription")}</span>
            )}
          </DetailRow>

          <DetailRow label={t("amount")}>
            <span>
              <span className="font-semibold">{transfer.amount.toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground">XAF</span>
            </span>
          </DetailRow>

          <DetailRow label={t("fee")}>
            <span>
              <span className="font-semibold">
                {(transfer.fee ?? 0).toLocaleString()}
              </span>
              <span className="ml-1 text-muted-foreground">XAF</span>
            </span>
          </DetailRow>

          <DetailRow label={t("totalDebit")}>
            <span>
              <span className="font-semibold">{totalDebit.toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground">XAF</span>
            </span>
          </DetailRow>

          <DetailRow label={t("date")}>
            {transfer.date
              ? new Date(transfer.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "---"}
          </DetailRow>

          <Separator />

          <DetailRow label={t("sourceWallet")}>
            {sourceWallet && sourceWalletType ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: sourceWalletType.color }}
                />
                {sourceWallet.name}
              </span>
            ) : (
              "---"
            )}
          </DetailRow>

          <DetailRow label={t("targetWallet")}>
            {targetWallet && targetWalletType ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: targetWalletType.color }}
                />
                {targetWallet.name}
              </span>
            ) : (
              "---"
            )}
          </DetailRow>

          <DetailRow label={t("linkedExpense")}>
            {transfer.linkedExpenseId
              ? `#${transfer.linkedExpenseId.toString().padStart(5, "0")}`
              : "---"}
          </DetailRow>

          <DetailRow label={t("linkedIncome")}>
            {transfer.linkedIncomeId
              ? `#${transfer.linkedIncomeId.toString().padStart(5, "0")}`
              : "---"}
          </DetailRow>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
