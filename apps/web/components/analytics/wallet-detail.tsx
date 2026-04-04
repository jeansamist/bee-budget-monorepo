"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { getWalletAnalytics } from "@/services/wallet-analytics.services"
import {
  Wallet,
  WalletAnalytics,
  WalletAnalyticsCategoryStat,
  WalletAnalyticsPeriod,
} from "@/types"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@bee-budget/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bee-budget/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bee-budget/ui/tabs"
import { FunctionComponent, useEffect, useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { WalletExpenses } from "./wallet-expenses"
import { WalletIncomes } from "./wallet-incomes"
import { WalletTransfers } from "./wallet-transfers"

const CategoryBreakdown: FunctionComponent<{
  title: string
  items: WalletAnalyticsCategoryStat[]
  empty: string
}> = ({ title, items, empty }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {item.name}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                    {item.total.toLocaleString()}
                    <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                      XAF
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: item.color,
                        width: `${Math.min(100, (item.total / (items[0]?.total || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.count}×
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const WalletDetail: FunctionComponent<{ wallet: Wallet }> = ({
  wallet,
}) => {
  const t = useScopedI18n("app.wallets.detail")
  const [period, setPeriod] = useState<WalletAnalyticsPeriod>("monthly")
  const [analytics, setAnalytics] = useState<WalletAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const response = await getWalletAnalytics(wallet.id, period)
      if (cancelled) return
      if (response.success) {
        setAnalytics(response.data ?? null)
      } else {
        setAnalytics(null)
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [wallet.id, period])

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      incomes: { label: t("chart.incomes"), color: "#22c55e" },
      expenses: { label: t("chart.expenses"), color: "#ef4444" },
    }),
    [t]
  )

  return (
    <div className="space-y-6 rounded-3xl border bg-card p-6">
      {/* Period selector */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{wallet.name}</h3>
          <p className="text-sm text-muted-foreground">
            {wallet.amount.toLocaleString()}{" "}
            <span className="text-xs">XAF</span>
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as WalletAnalyticsPeriod)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("period.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{t("period.daily")}</SelectItem>
            <SelectItem value="weekly">{t("period.weekly")}</SelectItem>
            <SelectItem value="monthly">{t("period.monthly")}</SelectItem>
            <SelectItem value="yearly">{t("period.yearly")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {t("chart.title")}
        </h4>
        {loading ? (
          <div className="h-52 animate-pulse rounded-2xl bg-muted" />
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <AreaChart
              data={analytics?.chartData ?? []}
              accessibilityLayer
              margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={50}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : String(value)}{" "}
                        XAF
                        <span className="ml-1 text-xs text-muted-foreground">
                          {name === "incomes"
                            ? t("chart.incomes")
                            : t("chart.expenses")}
                        </span>
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="incomes"
                type="natural"
                fillOpacity={0.15}
                fill="#22c55e"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Area
                dataKey="expenses"
                type="natural"
                fillOpacity={0.15}
                fill="#ef4444"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>

      {/* Category breakdown */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CategoryBreakdown
            title={t("topIncomeCategories.title")}
            items={analytics?.incomeCategoryBreakdown ?? []}
            empty={t("topIncomeCategories.empty")}
          />
          <CategoryBreakdown
            title={t("topExpenseCategories.title")}
            items={analytics?.expenseCategoryBreakdown ?? []}
            empty={t("topExpenseCategories.empty")}
          />
        </div>
      )}

      {/* Transaction tabs */}
      <Tabs defaultValue="incomes" className="w-full gap-4">
        <TabsList>
          <TabsTrigger value="incomes">{t("transactions.incomes")}</TabsTrigger>
          <TabsTrigger value="expenses">
            {t("transactions.expenses")}
          </TabsTrigger>
          <TabsTrigger value="transfers">
            {t("transactions.transfers")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="incomes">
          <WalletIncomes key={wallet.id} walletId={wallet.id} />
        </TabsContent>
        <TabsContent value="expenses">
          <WalletExpenses key={wallet.id} walletId={wallet.id} />
        </TabsContent>
        <TabsContent value="transfers">
          <WalletTransfers key={wallet.id} walletId={wallet.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
