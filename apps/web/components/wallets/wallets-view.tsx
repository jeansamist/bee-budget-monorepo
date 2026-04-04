"use client"

import { useApp } from "@/contexts/app.context"
import { useScopedI18n } from "@/lib/i18n/client"
import { Wallet } from "@/types"
import { FunctionComponent, useState } from "react"
import { WalletCard } from "./wallet-card"

export const WalletsView: FunctionComponent = () => {
  const t = useScopedI18n("app.wallets")
  const { wallets } = useApp()
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(
    wallets.length > 0 ? wallets[0] : null
  )

  if (wallets.length === 0) {
    return (
      <div className="px-4">
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} />
        ))}
      </div>
    </div>
  )
}
