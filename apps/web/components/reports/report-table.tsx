"use client"

import type { Report, ReportColumnKind } from "@/types"
import { cn } from "@bee-budget/functions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bee-budget/ui/table"

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
  return (
    <div className="max-h-[36rem] overflow-auto rounded-2xl border">
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
  )
}
