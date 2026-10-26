"use client"

import { useApp } from "@/contexts/app.context"
import { displayName, formatAmount } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import type { Report } from "@/types"
import { cn } from "@bee-budget/functions"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@bee-budget/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type Row = Report["rows"][number]
const num = (value: Row[string]) => Number(value ?? 0)

/** One labelled horizontal bar; `share` is 0–100. */
function BarRow({
  label,
  value,
  share,
  color,
  hint,
}: {
  label: string
  value: string
  share: number
  color: string
  hint?: string
}) {
  return (
    <li className="grid grid-cols-[6.5rem_minmax(0,1fr)_6.5rem] items-center gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)_9rem]">
      <span className="truncate">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full"
          style={{
            width: `${Math.max(Math.min(share, 100), 1)}%`,
            background: color,
          }}
        />
      </span>
      <span className="text-right tabular-nums">
        {value}
        {hint && (
          <span className="ml-2 text-xs text-muted-foreground">{hint}</span>
        )}
      </span>
    </li>
  )
}

function CashFlowChart({ report }: { report: Report }) {
  const t = useI18n()
  const config = {
    incomes: { label: t("app.reports.columns.incomes"), color: "#22c55e" },
    expenses: {
      label: t("app.reports.columns.expenses"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig
  const data = report.rows.map((row) => ({
    period: String(row.period),
    incomes: num(row.incomes),
    expenses: num(row.expenses),
  }))

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="period"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={16}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="incomes" fill="var(--color-incomes)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

/** A small visual summary above the table; nothing for the transaction list. */
export function ReportChart({ report }: { report: Report }) {
  const t = useI18n()
  const { expenseCategories, incomeCategories } = useApp()

  if (report.rows.length === 0) return null

  switch (report.type) {
    case "cash_flow":
      return <CashFlowChart report={report} />

    case "expenses_by_category":
    case "incomes_by_category": {
      const categories =
        report.type === "expenses_by_category"
          ? expenseCategories
          : incomeCategories
      return (
        <ul className="space-y-3">
          {report.rows.slice(0, 8).map((row) => (
            <BarRow
              key={String(row.category)}
              label={displayName(String(row.category))}
              value={formatAmount(num(row.total))}
              hint={`${row.share}%`}
              share={num(row.share)}
              color={
                categories.find((category) => category.name === row.category)
                  ?.color ?? "var(--primary)"
              }
            />
          ))}
        </ul>
      )
    }

    case "wallets": {
      const max = Math.max(...report.rows.map((row) => num(row.balance)), 1)
      return (
        <ul className="space-y-3">
          {report.rows.map((row) => (
            <BarRow
              key={String(row.wallet)}
              label={displayName(String(row.wallet))}
              value={formatAmount(num(row.balance))}
              share={(num(row.balance) / max) * 100}
              color="var(--primary)"
            />
          ))}
        </ul>
      )
    }

    case "contacts": {
      const top = report.rows.slice(0, 8)
      const max = Math.max(
        ...top.map((row) => Math.max(num(row.received), num(row.paid))),
        1
      )
      return (
        <div className="space-y-4">
          <p className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" />
              {t("app.reports.columns.received")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              {t("app.reports.columns.paid")}
            </span>
          </p>
          <ul className="space-y-3">
            {top.map((row) => (
              <li
                key={String(row.contact)}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <span className="truncate">{String(row.contact)}</span>
                <span className="space-y-1">
                  {(["received", "paid"] as const).map((key) => (
                    <span key={key} className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            key === "received" ? "bg-green-500" : "bg-primary"
                          )}
                          style={{ width: `${(num(row[key]) / max) * 100}%` }}
                        />
                      </span>
                      <span className="w-20 text-right text-xs text-muted-foreground tabular-nums">
                        {formatAmount(num(row[key]))}
                      </span>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    case "budgets":
      return (
        <ul className="space-y-3">
          {report.rows.map((row) => (
            <BarRow
              key={String(row.budget)}
              label={String(row.budget)}
              value={`${formatAmount(num(row.spent))} / ${formatAmount(num(row.amount))}`}
              share={num(row.progress)}
              color={
                row.status === "exceeded"
                  ? "#ef4444"
                  : row.status === "warning"
                    ? "#f59e0b"
                    : "#22c55e"
              }
            />
          ))}
        </ul>
      )

    default:
      return null
  }
}
