"use client"

import { useApp } from "@/contexts/app.context"
import { useI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@bee-budget/ui/chart"
import { FunctionComponent, ReactNode, useMemo } from "react"
import { Area, AreaChart, CartesianGrid } from "recharts"

type ChartProps = {
  className?: string
  fill?: string
  data: { month: string; amount: number }[]
}

const Chart: FunctionComponent<ChartProps> = ({ className, fill, data }) => {
  const t = useI18n()
  const chartData = useMemo<{ month: string; amount: number }[]>(() => {
    return data
  }, [data])
  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      amount: {
        label: t("app.dashboard.dataCards.chart.total"),
      },
    }
  }, [t])
  return (
    <ChartContainer config={chartConfig} className={cn("w-full", className)}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                `Month: ${String(payload?.[0]?.payload?.month ?? "-")}`
              }
              formatter={(value) => (
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {typeof value === "number" ? value.toLocaleString() : String(value)} XAF
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="amount"
          type="natural"
          fillOpacity={0.15}
          fill={fill || "#1E90FF"}
          strokeWidth={2}
          stroke={fill || "#1E90FF"}
          dot={true}
        />
      </AreaChart>
    </ChartContainer>
  )
}
type DataCardProps = {
  name: string
  description: string
  value: ReactNode
  evolution: number
  lastMonthsData: { month: string; amount: number }[]
  [key: string]: unknown
}

const DataCard: FunctionComponent<DataCardProps> = ({
  description,
  evolution,
  lastMonthsData,
  name,
  value,
}) => {
  const t = useI18n()
  return (
    <div
      className={"flex gap-6 rounded-3xl bg-accent p-6 text-accent-foreground"}
    >
      <div className="w-2/3">
        <h3 className={"font-semibold"}>{name}</h3>
        <p className={"line-clamp-2 text-sm text-muted-foreground"}>
          {description}
        </p>
        <p className={"text-2xl font-bold"}>{value}</p>
        <p
          className={`text-sm ${evolution >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {evolution >= 0 ? "+" : "-"}
          {Math.abs(evolution)}%{" "}
          {t("app.dashboard.dataCards.evolution.fromLastMonth")}
        </p>
      </div>
      <Chart
        data={lastMonthsData}
        className="w-1/3"
        fill={evolution >= 0 ? "#1E90FF" : "#FF6347"}
      />
    </div>
  )
}

export const DataCards: FunctionComponent = () => {
  const { wallets } = useApp()

  return (
    <div
      className={"grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3"}
    >
      {wallets.map((wallet) => {
        return (
          <DataCard
            key={wallet.id}
            name={wallet.name}
            description={wallet.description}
            value={
              <span>
                {`${wallet.amount.toLocaleString().padStart(3, "0")}`}
                <span className="text-sm text-muted-foreground">XAF</span>
              </span>
            }
            evolution={wallet.evolution ?? 0}
            lastMonthsData={wallet.lastMonthsData ?? []}
          />
        )
      })}
    </div>
  )
}
