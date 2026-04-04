"use client"

import { useI18n, useScopedI18n } from "@/lib/i18n/client"
import { getTransactionAnalytics } from "@/services/transaction-analytics.services"
import {
  TransactionAnalytics,
  TransactionAnalyticsMetric,
  TransactionAnalyticsPeriod,
} from "@/types"
import { cn } from "@bee-budget/functions"
import {
  ChartContainer,
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
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Bar, BarChart, CartesianGrid } from "recharts"

type ChartProps = {
  className?: string
  fill?: string
  data: { label: string; amount: number }[]
}

const Chart: FunctionComponent<ChartProps> = ({ className, fill, data }) => {
  const t = useI18n()
  const chartData = useMemo<{ label: string; amount: number }[]>(() => {
    return data
  }, [data])
  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      amount: {
        label: t("app.transactions.dataCards.chart.total"),
      },
    }
  }, [t])
  return (
    <ChartContainer config={chartConfig} className={cn("w-full", className)}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                `${t("app.transactions.dataCards.chart.period")}: ${String(
                  payload?.[0]?.payload?.label ?? "-"
                )}`
              }
              formatter={(value) => (
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {typeof value === "number"
                    ? value.toLocaleString()
                    : String(value)}{" "}
                  XAF
                </span>
              )}
            />
          }
        />
        <Bar dataKey="amount" fill={fill || "#1E90FF"} radius={6} />
      </BarChart>
    </ChartContainer>
  )
}

type DataCardProps = {
  name: string
  description: string
  value: ReactNode
  chartData: { label: string; amount: number }[]
  [key: string]: unknown
}

const DataCard: FunctionComponent<DataCardProps> = ({
  chartData,
  description,
  name,
  value,
}) => {
  return (
    <div
      className={
        "flex min-h-32 flex-col-reverse gap-6 rounded-3xl bg-accent p-6 text-accent-foreground sm:flex-row sm:items-center"
      }
    >
      <div className="w-2/3">
        <h3 className={"font-semibold"}>{name}</h3>
        <p className={"line-clamp-2 text-sm text-muted-foreground"}>
          {description}
        </p>
        <p className={"text-2xl font-bold"}>{value}</p>
      </div>
      <Chart data={chartData} className="w-1/3" fill="#1E90FF" />
    </div>
  )
}

const DataCardSkeleton = () => (
  <div className="flex h-32 gap-6 rounded-3xl bg-accent p-6"></div>
)

export const DataCards: FunctionComponent = () => {
  const t = useScopedI18n("app.transactions.dataCards")
  const [period, setPeriod] = useState<TransactionAnalyticsPeriod>("monthly")
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      const response = await getTransactionAnalytics(period)
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
  }, [period])

  const cards: Array<{
    key: string
    name: string
    description: string
    metric: TransactionAnalyticsMetric
  }> = analytics
    ? [
        {
          key: "incomes",
          name: t("cards.incomes.title"),
          description: t("cards.incomes.description"),
          metric: analytics.incomes,
        },
        {
          key: "expenses",
          name: t("cards.expenses.title"),
          description: t("cards.expenses.description"),
          metric: analytics.expenses,
        },
        {
          key: "fees",
          name: t("cards.fees.title"),
          description: t("cards.fees.description"),
          metric: analytics.fees,
        },
      ]
    : []

  return (
    <section className="space-y-4 px-4">
      <div className="flex items-center justify-start">
        <Select
          value={period}
          onValueChange={(value) =>
            setPeriod(value as TransactionAnalyticsPeriod)
          }
        >
          <SelectTrigger className="w-45">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }, (_, index) => (
              <DataCardSkeleton key={index} />
            ))
          : cards.map((card) => (
              <DataCard
                key={card.key}
                name={card.name}
                description={card.description}
                value={
                  <span>
                    {`${card.metric.total.toLocaleString().padStart(3, "0")}`}
                    <span className="text-sm text-muted-foreground">XAF</span>
                  </span>
                }
                chartData={card.metric.data}
              />
            ))}
      </div>
    </section>
  )
}
