"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { deleteWalletType } from "@/services/wallet-types.services"
import type { WalletType } from "@/types"
import { Button } from "@bee-budget/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { EntitySheet } from "./entity-sheet"
import { ManageItem } from "./manage-item"
import { RowActions } from "./row-actions"
import { WalletTypeForm } from "./wallet-type.form"

type SheetState = { open: false } | { open: true; walletType?: WalletType }

export function WalletTypesView() {
  const t = useI18n()
  const { walletTypes, wallets, removeWalletType } = useApp()
  const [sheet, setSheet] = useState<SheetState>({ open: false })
  const walletCount = (id: number) =>
    wallets.filter((wallet) => wallet.walletTypeId === id).length

  async function onDelete(walletType: WalletType) {
    const result = await deleteWalletType(walletType.id)
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    removeWalletType(walletType.id)
    toast.success(
      t("app.manage.toast.deleted", { name: displayName(walletType.name) })
    )
  }

  return (
    <section className="space-y-4 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          {t("app.manage.walletType.intro")}
        </p>
        <Button onClick={() => setSheet({ open: true })}>
          <Plus />
          {t("app.manage.walletType.new")}
        </Button>
      </div>

      {walletTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("app.manage.walletType.empty")}
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {walletTypes.map((walletType) => {
            const count = walletCount(walletType.id)
            const name = displayName(walletType.name)
            return (
              <ManageItem
                key={walletType.id}
                color={walletType.color}
                name={name}
                details={t("app.manage.walletType.walletCount", { count })}
                actions={
                  <RowActions
                    label={name}
                    onEdit={() => setSheet({ open: true, walletType })}
                    onDelete={() => onDelete(walletType)}
                    deleteTitle={t("app.manage.walletType.deleteTitle", {
                      name,
                    })}
                    deleteContent={
                      count > 0
                        ? t("app.manage.walletType.deleteWithWallets", {
                            count,
                          })
                        : t("app.manage.walletType.deleteContent")
                    }
                  />
                }
              />
            )
          })}
        </ul>
      )}

      <EntitySheet
        open={sheet.open}
        onOpenChange={(open) => !open && setSheet({ open: false })}
        title={
          sheet.open && sheet.walletType
            ? t("app.manage.walletType.editTitle")
            : t("app.manage.walletType.createTitle")
        }
        description={t("app.manage.walletType.formDescription")}
      >
        {sheet.open && (
          <WalletTypeForm
            key={sheet.walletType?.id ?? "new"}
            walletType={sheet.walletType}
            onDone={() => setSheet({ open: false })}
          />
        )}
      </EntitySheet>
    </section>
  )
}
