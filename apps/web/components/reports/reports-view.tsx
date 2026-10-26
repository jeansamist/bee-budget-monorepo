"use client"

import { formatAmount, displayName } from "@/lib/format"
import { useI18n, useScopedI18n } from "@/lib/i18n/client"
import {
  exportCsv,
  exportExcel,
  exportPdf,
  reportFileName,
  type ExportableReport,
} from "@/lib/report-export"
import { getReport } from "@/services/reports.services"
import type { Report, ReportColumnKind, ReportType } from "@/types"
import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bee-budget/ui/dropdown-menu"
import { format } from "date-fns"
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  SearchX,
  Sheet,
} from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { ReportChart } from "./report-chart"
import { PeriodFilter, WalletFilter } from "./report-filters"
import { presetRange, type Preset } from "./report-presets"
import { ReportTable } from "./report-table"
import { ReportTypeTabs } from "./report-type-tabs"

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

  function setType(type: ReportType) {
    run({ ...options, type })
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

  const hasRows = Boolean(report && report.rows.length > 0)

  return (
    <section className="min-w-0 space-y-5 px-4 pb-6">
      <ReportTypeTabs value={options.type} onChange={setType} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            {t(`app.reports.types.${options.type}.title`)}
            {isPending && (
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(`app.reports.types.${options.type}.description`)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!hasRows || isPending || exporting !== null}>
              {exporting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Download />
              )}
              {t("app.reports.export")}
              <ChevronDown className="opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onExport("pdf")}>
              <FileText />
              {t("app.reports.formats.pdf")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport("xlsx")}>
              <FileSpreadsheet />
              {t("app.reports.formats.xlsx")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport("csv")}>
              <Sheet />
              {t("app.reports.formats.csv")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {options.type === "budgets" ? (
          <p className="text-sm text-muted-foreground">
            {t("app.reports.budgetsPeriodNote")}
          </p>
        ) : (
          <>
            <PeriodFilter
              preset={options.preset}
              from={options.from}
              to={options.to}
              onPreset={setPreset}
              onCustom={(range) => run({ ...options, ...range })}
            />
            <WalletFilter
              walletIds={options.walletIds}
              onChange={(walletIds) => run({ ...options, walletIds })}
            />
          </>
        )}
        {report && (
          <span className="ml-auto text-xs text-muted-foreground">
            {exportable?.subtitle}
          </span>
        )}
      </div>

      <div
        className={cn(
          "space-y-5 transition-opacity",
          isPending && "opacity-50"
        )}
      >
        {report && Object.keys(report.totals).length > 0 && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {exportable?.totals.map((total) => (
              <div key={total.label} className="rounded-2xl border px-4 py-3">
                <dt className="text-xs text-muted-foreground">{total.label}</dt>
                <dd className="mt-1 truncate text-lg font-semibold tabular-nums">
                  {total.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {report && hasRows ? (
          <>
            {report.type !== "transactions" && (
              <div className="rounded-2xl border p-4 sm:p-5">
                <ReportChart report={report} />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t("app.reports.rowCount", { count: report.rows.length })}
              </p>
              <ReportTable
                report={report}
                columnLabel={columnLabel}
                formatCell={formatCell}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center">
            <SearchX className="text-muted-foreground" />
            <p className="font-medium">{t("app.reports.empty.title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("app.reports.empty.description")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
