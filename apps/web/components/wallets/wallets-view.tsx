"use client"

import { EntitySheet } from "@/components/manage/entity-sheet"
import { WalletForm } from "@/components/manage/wallet.form"
import { useApp } from "@/contexts/app.context"
import { displayName, formatAmount } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { deleteWallet } from "@/services/wallets.services"
import { Wallet } from "@/types"
import { Button } from "@bee-budget/ui/button"
import { Plus } from "lucide-react"
import { FunctionComponent, useState } from "react"
import { toast } from "sonner"
import { WalletCard } from "./wallet-card"

type SheetState = { open: false } | { open: true; wallet?: Wallet }

export const WalletsView: FunctionComponent = () => {
  const t = useI18n()
  const { wallets, removeWallet } = useApp()
  const [sheet, setSheet] = useState<SheetState>({ open: false })
  const total = wallets.reduce((sum, wallet) => sum + wallet.amount, 0)

  async function onDelete(wallet: Wallet) {
    const result = await deleteWallet(wallet.id)
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    removeWallet(wallet.id)
    toast.success(
      t("app.manage.toast.deleted", { name: displayName(wallet.name) })
    )
  }

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {wallets.length === 0
            ? t("app.wallets.empty")
            : t("app.manage.wallet.summary", {
                count: wallets.length,
                total: formatAmount(total),
              })}
        </p>
        <Button onClick={() => setSheet({ open: true })}>
          <Plus />
          {t("app.manage.wallet.new")}
        </Button>
      </div>

      {wallets.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setSheet({ open: true, wallet })}
              onDelete={() => onDelete(wallet)}
            />
          ))}
        </div>
      )}

      <EntitySheet
        open={sheet.open}
        onOpenChange={(open) => !open && setSheet({ open: false })}
        title={
          sheet.open && sheet.wallet
            ? t("app.manage.wallet.editTitle")
            : t("app.manage.wallet.createTitle")
        }
        description={
          sheet.open && sheet.wallet
            ? t("app.manage.wallet.editDescription")
            : t("app.manage.wallet.createDescription")
        }
      >
        {sheet.open && (
          <WalletForm
            key={sheet.wallet?.id ?? "new"}
            wallet={sheet.wallet}
            onDone={() => setSheet({ open: false })}
          />
        )}
      </EntitySheet>
    </div>
  )
}
