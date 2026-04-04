"use client"

import { useApp } from "@/contexts/app.context"
import { useScopedI18n } from "@/lib/i18n/client"
import { FunctionComponent } from "react"
import { WalletDetail } from "./wallet-detail"

export const AnalyticView: FunctionComponent = () => {
  const t = useScopedI18n("app.analytics")
  const { wallets } = useApp()
  if (wallets.length === 0) {
    return (
      <div className="px-4">
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4">
      {wallets.map((wallet) => (
        <WalletDetail key={wallet.id} wallet={wallet} />
      ))}
    </div>
  )
}
