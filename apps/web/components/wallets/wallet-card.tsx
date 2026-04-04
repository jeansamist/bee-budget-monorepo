"use client"

import { useApp } from "@/contexts/app.context"
import { useScopedI18n } from "@/lib/i18n/client"
import { Wallet } from "@/types"
import { cn } from "@bee-budget/functions"
import { ChartContainer, type ChartConfig } from "@bee-budget/ui/chart"
import { FunctionComponent, useMemo } from "react"
import { Area, AreaChart } from "recharts"

export const WalletCard: FunctionComponent<{
  wallet: Wallet
}> = ({ wallet }) => {
  const t = useScopedI18n("app.wallets")
  const { walletTypes } = useApp()
  const walletType = walletTypes.find((wt) => wt.id === wallet.walletTypeId)
  const isPositive = wallet.evolution >= 0

  const chartConfig = useMemo<ChartConfig>(
    () => ({ amount: { label: t("balance") } }),
    [t]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn("rounded-3xl bg-accent p-6 text-accent-foreground")}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {walletType && (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: walletType.color }}
              />
            )}
            <h3 className="truncate font-semibold">{wallet.name}</h3>
          </div>
          {walletType && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {walletType.name}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 text-sm font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}
        >
          {isPositive ? "+" : "-"}
          {Math.abs(wallet.evolution)}%
        </span>
      </div>

      {wallet.lastMonthsData.length > 0 && (
        <ChartContainer config={chartConfig} className="h-14 w-full">
          <AreaChart data={wallet.lastMonthsData} accessibilityLayer>
            <Area
              dataKey="amount"
              type="natural"
              fillOpacity={0.15}
              fill={isPositive ? "#22c55e" : "#ef4444"}
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      )}

      <div className="mt-3">
        <p className="text-xs text-muted-foreground">{t("balance")}</p>
        <p className="text-2xl font-bold">
          {wallet.amount.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            XAF
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {isPositive ? "+" : "-"}
          {Math.abs(wallet.evolution)}% {t("evolution")}
        </p>
      </div>
    </div>
  )
}
