"use client"

import { useI18n } from "@/lib/i18n/client"
import type { Report, ReportColumnKind } from "@/types"
import { cn } from "@bee-budget/functions"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bee-budget/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bee-budget/ui/table"
import { useState } from "react"

const isNumeric = (kind: ReportColumnKind) =>
  kind === "amount" || kind === "number" || kind === "percent"

export function ReportTable({
  report,
  columnLabel,
  formatCell,
}: {
  report: Report
  columnLabel: (key: string) => string
  formatCell: (
    value: string | number | null,
    kind: ReportColumnKind,
    key: string
  ) => string
}) {
  const t = useI18n()
  const [openRow, setOpenRow] = useState<number | null>(null)
  const [titleColumn, ...otherColumns] = report.columns
  // The card shows the first column plus the first amount; the dialog shows all.
  const amountColumn =
    otherColumns.find((column) => column.kind === "amount") ??
    otherColumns.find((column) => isNumeric(column.kind))
  const selectedRow = openRow === null ? undefined : report.rows[openRow]

  return (
    <>
      <div className="space-y-2 md:hidden">
        {report.rows.map((row, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setOpenRow(index)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3 text-left"
          >
            <div className="min-w-0 space-y-1.5">
              <p className="truncate leading-none font-medium">
                {formatCell(
                  row[titleColumn.key],
                  titleColumn.kind,
                  titleColumn.key
                )}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {columnLabel(titleColumn.key)}
              </p>
            </div>
            {amountColumn && (
              <span
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  amountColumn.kind === "amount" &&
                    Number(row[amountColumn.key]) < 0 &&
                    "text-red-600 dark:text-red-400"
                )}
              >
                {formatCell(
                  row[amountColumn.key],
                  amountColumn.kind,
                  amountColumn.key
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={selectedRow !== undefined}
        onOpenChange={(open) => !open && setOpenRow(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("app.reports.rowDetails")}</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="max-h-[60vh] divide-y overflow-y-auto">
              {report.columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-4 py-2"
                >
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {columnLabel(column.key)}
                  </span>
                  <span
                    className={cn(
                      "text-right text-sm font-medium",
                      isNumeric(column.kind) && "tabular-nums",
                      column.kind === "amount" &&
                        Number(selectedRow[column.key]) < 0 &&
                        "text-red-600 dark:text-red-400"
                    )}
                  >
                    {formatCell(
                      selectedRow[column.key],
                      column.kind,
                      column.key
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <div className="hidden max-h-[36rem] overflow-auto rounded-2xl border md:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {report.columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(isNumeric(column.kind) && "text-right")}
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
                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "whitespace-nowrap",
                        isNumeric(column.kind) && "text-right tabular-nums",
                        column.kind === "amount" &&
                          Number(value) < 0 &&
                          "text-red-600 dark:text-red-400"
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
    </>
  )
}
