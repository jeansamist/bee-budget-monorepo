"use client"

import { useApp } from "@/contexts/app.context"
import { displayName, formatAmount } from "@/lib/format"
import { useI18n, useScopedI18n } from "@/lib/i18n/client"
import {
  exportCsv,
  exportExcel,
  exportPdf,
  reportFileName,
  type ExportableReport,
} from "@/lib/report-export"
import { getReport } from "@/services/reports.services"
import {
  REPORT_TYPES,
  type Report,
  type ReportColumnKind,
  type ReportType,
} from "@/types"
import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import { Input } from "@bee-budget/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bee-budget/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@bee-budget/ui/toggle-group"
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns"
import {
  ArrowLeftRight,
  ChartPie,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  PiggyBank,
  Receipt,
  Sheet,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

const REPORT_ICONS: Record<ReportType, LucideIcon> = {
  transactions: Receipt,
  cash_flow: TrendingUp,
  expenses_by_category: ChartPie,
  incomes_by_category: ChartPie,
  wallets: Wallet,
  contacts: Users,
  budgets: PiggyBank,
}

// Selected chips stand out from the builder's accent background
const SELECTED_CHIP =
  "bg-background data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"

const PRESETS = [
  "thisMonth",
  "lastMonth",
  "last3Months",
  "thisYear",
  "lastYear",
  "custom",
] as const
type Preset = (typeof PRESETS)[number]

const isoDate = (date: Date) => format(date, "yyyy-MM-dd")

function presetRange(preset: Exclude<Preset, "custom">) {
  const now = new Date()
  switch (preset) {
    case "thisMonth":
      return { from: isoDate(startOfMonth(now)), to: isoDate(endOfMonth(now)) }
    case "lastMonth": {
      const last = subMonths(now, 1)
      return {
        from: isoDate(startOfMonth(last)),
        to: isoDate(endOfMonth(last)),
      }
    }
    case "last3Months":
      return {
        from: isoDate(startOfMonth(subMonths(now, 2))),
        to: isoDate(endOfMonth(now)),
      }
    case "thisYear":
      return { from: isoDate(startOfYear(now)), to: isoDate(endOfYear(now)) }
    case "lastYear": {
      const last = subYears(now, 1)
      return { from: isoDate(startOfYear(last)), to: isoDate(endOfYear(last)) }
    }
  }
}

type Options = {
  type: ReportType
  preset: Preset
  from: string
  to: string
  walletIds: number[]
}

export function ReportsView({
  initialReport,
}: {
  initialReport: Report | null
}) {
  const t = useI18n()
  const tColumn = useScopedI18n("app.reports.columns")
  const { wallets } = useApp()
  const [options, setOptions] = useState<Options>(() => ({
    type: initialReport?.type ?? "transactions",
    preset: "thisMonth",
    ...presetRange("thisMonth"),
    walletIds: [],
  }))
  const [report, setReport] = useState(initialReport)
  const [isPending, startTransition] = useTransition()
  const [exporting, setExporting] = useState<"pdf" | "csv" | "xlsx" | null>(
    null
  )

  function run(next: Options) {
    setOptions(next)
    startTransition(async () => {
      const result = await getReport({
        type: next.type,
        from: next.from,
        to: next.to,
        walletIds: next.walletIds,
      })
      if (!result.success || !result.data) {
        toast.error(result.message ?? t("unknownError"))
        return
      }
      setReport(result.data)
    })
  }

  function setPreset(preset: Preset) {
    if (preset === "custom") {
      setOptions((previous) => ({ ...previous, preset }))
      return
    }
    run({ ...options, preset, ...presetRange(preset) })
  }

  const columnLabel = (key: string) =>
    tColumn(key as Parameters<typeof tColumn>[0])

  /** Human text for a text cell: translated kinds and statuses, readable default names. */
  function formatText(value: string, key: string) {
    if (key === "kind") {
      return t(`app.reports.kinds.${value}` as Parameters<typeof t>[0])
    }
    if (key === "status") {
      return t(`app.budgets.status.${value}` as Parameters<typeof t>[0])
    }
    if (key === "period" && report?.type === "budgets") {
      return t(`app.budgets.periods.${value}` as Parameters<typeof t>[0])
    }
    return displayName(value)
  }

  function formatCell(
    value: string | number | null,
    kind: ReportColumnKind,
    key: string
  ) {
    if (value === null || value === "") return "—"
    if (kind === "amount") return formatAmount(Number(value))
    if (kind === "percent") return `${value}%`
    if (kind === "number" || kind === "date") return String(value)
    return formatText(String(value), key)
  }

  const exportable = useMemo<ExportableReport | null>(() => {
    if (!report) return null
    return {
      title: `BeeBudget · ${t(`app.reports.types.${report.type}.title`)}`,
      subtitle: t("app.reports.period", {
        from: report.from,
        to: report.to,
        generatedAt: format(new Date(report.generatedAt), "yyyy-MM-dd HH:mm"),
      }),
      columns: report.columns.map((column) => ({
        ...column,
        label: columnLabel(column.key),
      })),
      // Numbers stay raw so spreadsheets can sum them
      rows: report.rows.map((row) =>
        Object.fromEntries(
          report.columns.map((column) => {
            const value = row[column.key]
            return [
              column.key,
              column.kind === "text" && typeof value === "string"
                ? formatText(value, column.key)
                : value,
            ]
          })
        )
      ),
      totals: Object.entries(report.totals).map(([key, value]) => ({
        label: columnLabel(key),
        value: key === "count" ? String(value) : `${formatAmount(value)} XAF`,
        raw: value,
      })),
      fileName: reportFileName(report),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, t])

  async function onExport(kind: "pdf" | "csv" | "xlsx") {
    if (!exportable) return
    setExporting(kind)
    try {
      if (kind === "csv") exportCsv(exportable)
      if (kind === "xlsx") await exportExcel(exportable)
      if (kind === "pdf") await exportPdf(exportable)
      toast.success(t("app.reports.downloaded"))
    } catch {
      toast.error(t("unknownError"))
    } finally {
      setExporting(null)
    }
  }

  const supportsWalletFilter = options.type !== "budgets"

  return (
    <section className="grid gap-4 px-4 pb-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
      {/* Builder */}
      <div className="space-y-6 rounded-3xl bg-accent p-5">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            {t("app.reports.chooseType")}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {REPORT_TYPES.map((type) => {
              const Icon = REPORT_ICONS[type]
              const active = options.type === type
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => run({ ...options, type })}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border bg-background p-3 text-left transition-colors hover:border-primary/50",
                    active && "border-primary ring-1 ring-primary"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted",
                      active && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {t(`app.reports.types.${type}.title`)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t(`app.reports.types.${type}.description`)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {options.type !== "budgets" && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {t("app.reports.dateRange")}
            </h3>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={options.preset}
              onValueChange={(value) => value && setPreset(value as Preset)}
              className="flex flex-wrap justify-start"
            >
              {PRESETS.map((preset) => (
                <ToggleGroupItem
                  key={preset}
                  value={preset}
                  className={SELECTED_CHIP}
                >
                  {t(`app.reports.presets.${preset}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {options.preset === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-xs text-muted-foreground">
                  {t("app.reports.from")}
                  <Input
                    type="date"
                    value={options.from}
                    max={options.to}
                    onChange={(event) =>
                      event.target.value &&
                      run({ ...options, from: event.target.value })
                    }
                  />
                </label>
                <label className="space-y-1 text-xs text-muted-foreground">
                  {t("app.reports.to")}
                  <Input
                    type="date"
                    value={options.to}
                    min={options.from}
                    onChange={(event) =>
                      event.target.value &&
                      run({ ...options, to: event.target.value })
                    }
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {supportsWalletFilter && wallets.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {t("app.reports.wallets")}
            </h3>
            <ToggleGroup
              type="multiple"
              variant="outline"
              size="sm"
              value={options.walletIds.map(String)}
              onValueChange={(value) =>
                run({ ...options, walletIds: value.map(Number) })
              }
              className="flex flex-wrap justify-start"
            >
              {wallets.map((wallet) => (
                <ToggleGroupItem
                  key={wallet.id}
                  value={wallet.id.toString()}
                  className={SELECTED_CHIP}
                >
                  {displayName(wallet.name)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              {options.walletIds.length === 0
                ? t("app.reports.allWallets")
                : t("app.reports.selectedWallets", {
                    count: options.walletIds.length,
                  })}
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="min-w-0 space-y-4 rounded-3xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              {t(`app.reports.types.${options.type}.title`)}
              {isPending && (
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
              )}
            </h3>
            {report && (
              <p className="text-sm text-muted-foreground">
                {exportable?.subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["pdf", FileText, "PDF"],
                ["csv", Sheet, "CSV"],
                ["xlsx", FileSpreadsheet, "Excel"],
              ] as const
            ).map(([kind, Icon, label]) => (
              <Button
                key={kind}
                variant="outline"
                size="sm"
                disabled={
                  !report ||
                  report.rows.length === 0 ||
                  isPending ||
                  exporting !== null
                }
                onClick={() => onExport(kind)}
              >
                {exporting === kind ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Icon />
                )}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {report && Object.keys(report.totals).length > 0 && (
          <dl className="flex flex-wrap gap-2">
            {exportable?.totals.map((total) => (
              <div
                key={total.label}
                className="rounded-2xl bg-accent px-3 py-2"
              >
                <dt className="text-xs text-muted-foreground">{total.label}</dt>
                <dd className="font-semibold tabular-nums">{total.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className={cn("transition-opacity", isPending && "opacity-50")}>
          {!report || report.rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed p-10 text-center">
              <ArrowLeftRight className="text-muted-foreground" />
              <p className="font-medium">{t("app.reports.empty.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("app.reports.empty.description")}
              </p>
            </div>
          ) : (
            <div className="max-h-[32rem] overflow-auto rounded-2xl border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    {report.columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={cn(
                          column.kind !== "text" &&
                            column.kind !== "date" &&
                            "text-right"
                        )}
                      >
                        {columnLabel(column.key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.rows.map((row, index) => (
                    <TableRow key={index}>
                      {report.columns.map((column) => {
                        const value = row[column.key]
                        const negative =
                          column.kind === "amount" && Number(value) < 0
                        return (
                          <TableCell
                            key={column.key}
                            className={cn(
                              "whitespace-nowrap",
                              column.kind !== "text" &&
                                column.kind !== "date" &&
                                "text-right tabular-nums",
                              negative && "text-red-600 dark:text-red-400"
                            )}
                          >
                            {formatCell(value, column.kind, column.key)}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
