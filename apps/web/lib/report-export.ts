import type { Report, ReportColumnKind } from "@/types"

/** A report with every label already translated, ready to be written to a file. */
export type ExportableReport = {
  title: string
  subtitle: string
  /** Report name without the brand, e.g. "Cash flow". */
  name: string
  /** Human period, e.g. "1 Oct 2026 - 31 Oct 2026". */
  period: string
  /** Document details (account holder, period, wallets, currency, date). */
  details: { label: string; value: string }[]
  labels: { summary: string; page: (page: number, total: number) => string }
  columns: { key: string; label: string; kind: ReportColumnKind }[]
  rows: Record<string, string | number | null>[]
  /** `value` is for display (PDF, screen), `raw` for spreadsheets. */
  totals: { label: string; value: string; raw: number }[]
  fileName: string
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function csvCell(value: string | number | null) {
  if (value === null || value === undefined) return ""
  const text = String(value)
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Raw numbers (no thousands separators) so spreadsheets can compute on them. */
export function exportCsv(report: ExportableReport) {
  const lines = [
    report.columns.map((column) => csvCell(column.label)).join(","),
    ...report.rows.map((row) =>
      report.columns.map((column) => csvCell(row[column.key])).join(",")
    ),
    "",
    ...report.totals.map(
      (total) => `${csvCell(total.label)},${csvCell(total.raw)}`
    ),
  ]
  // BOM so Excel opens accents correctly
  download(
    new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" }),
    `${report.fileName}.csv`
  )
}

export async function exportExcel(report: ExportableReport) {
  const { default: ExcelJS } = await import("exceljs")
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "BeeBudget"
  const sheet = workbook.addWorksheet(report.title.slice(0, 31))

  sheet.addRow([`BeeBudget - ${report.name}`]).font = { bold: true, size: 14 }
  for (const detail of report.details) {
    const row = sheet.addRow([detail.label, detail.value])
    row.getCell(1).font = { color: { argb: "FF6B7280" } }
  }
  sheet.addRow([])
  const headerRowNumber = sheet.rowCount + 1

  const header = sheet.addRow(report.columns.map((column) => column.label))
  header.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    }
    cell.border = { bottom: { style: "thin", color: { argb: "FFD1D5DB" } } }
  })

  for (const row of report.rows) {
    sheet.addRow(report.columns.map((column) => row[column.key] ?? ""))
  }

  report.columns.forEach((column, index) => {
    const sheetColumn = sheet.getColumn(index + 1)
    if (column.kind === "amount") sheetColumn.numFmt = "#,##0"
    if (column.kind === "percent") sheetColumn.numFmt = '0.0"%"'
    const longest = Math.max(
      column.label.length,
      ...report.rows.map((row) => String(row[column.key] ?? "").length)
    )
    sheetColumn.width = Math.min(Math.max(longest + 2, 10), 48)
  })
  sheet.views = [{ state: "frozen", ySplit: headerRowNumber }]

  sheet.addRow([])
  for (const total of report.totals) {
    sheet.addRow([total.label, total.raw]).font = { bold: true }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  download(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${report.fileName}.xlsx`
  )
}

// The built-in PDF fonts only cover Latin-1
const pdfText = (value: string) =>
  value
    .replace(/→/g, "->")
    .replace(/[\u2009\u202f]/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/·/g, "-")

function pdfCell(value: string | number | null, kind: ReportColumnKind) {
  if (value === null || value === "") return "-"
  if (kind === "amount") return Number(value).toLocaleString("en-US")
  if (kind === "percent") return `${value}%`
  return String(value)
}

const isNumeric = (kind: ReportColumnKind) =>
  kind === "amount" || kind === "number" || kind === "percent"

// Greys only: the document should print well and look like a statement
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]
const RULE: [number, number, number] = [209, 213, 219]
const HEAD_FILL: [number, number, number] = [243, 244, 246]
const MARGIN = 48

/** Where the previous autoTable ended (set by jspdf-autotable at runtime). */
const lastTableBottom = (doc: object) =>
  (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0

/** A4 portrait statement: header, details, summary, data table, paged footer. */
export async function exportPdf(report: ExportableReport) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ])
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const right = pageWidth - MARGIN

  // Header
  doc.setTextColor(...INK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("BeeBudget", MARGIN, 60)
  doc.setFontSize(12)
  doc.text(pdfText(report.name), right, 58, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(pdfText(report.period), right, 72, { align: "right" })
  doc.setDrawColor(...RULE)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, 86, right, 86)

  // Details (left) and summary (right), side by side
  const columnGap = 32
  const summaryWidth = 200
  const detailsWidth = right - MARGIN - summaryWidth - columnGap
  const blockTop = 104
  const keyValueTable = {
    theme: "plain" as const,
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 3, bottom: 3, left: 0, right: 0 },
      textColor: INK,
    },
    columnStyles: { 0: { textColor: MUTED, cellWidth: 90 } },
  }

  autoTable(doc, {
    ...keyValueTable,
    startY: blockTop,
    margin: { left: MARGIN },
    tableWidth: detailsWidth,
    body: report.details.map((detail) => [
      pdfText(detail.label),
      pdfText(detail.value),
    ]),
  })
  const detailsBottom = lastTableBottom(doc)

  autoTable(doc, {
    ...keyValueTable,
    startY: blockTop,
    margin: { left: right - summaryWidth },
    tableWidth: summaryWidth,
    head: [[pdfText(report.labels.summary), ""]],
    headStyles: {
      fontStyle: "bold",
      fontSize: 8.5,
      textColor: INK,
      cellPadding: { top: 0, bottom: 5, left: 0, right: 0 },
    },
    body: report.totals.map((total) => [
      pdfText(total.label),
      pdfText(total.value),
    ]),
    columnStyles: {
      0: { textColor: MUTED },
      1: { halign: "right", fontStyle: "bold" },
    },
    didDrawCell: (data) => {
      if (data.section === "head") {
        doc.setDrawColor(...RULE)
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        )
      }
    },
  })
  const summaryBottom = lastTableBottom(doc)

  // Data table
  const wide = report.columns.length > 7
  autoTable(doc, {
    startY: Math.max(detailsBottom, summaryBottom) + 24,
    margin: { left: MARGIN, right: MARGIN, top: 56, bottom: 56 },
    theme: "plain",
    // Never split a row across two pages
    rowPageBreak: "avoid",
    head: [report.columns.map((column) => pdfText(column.label))],
    body: report.rows.map((row) =>
      report.columns.map((column) =>
        pdfText(pdfCell(row[column.key], column.kind))
      )
    ),
    styles: {
      font: "helvetica",
      fontSize: wide ? 7.5 : 8.5,
      textColor: INK,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      overflow: "linebreak",
      lineColor: [229, 231, 235],
      lineWidth: { bottom: 0.5 },
    },
    headStyles: {
      fillColor: HEAD_FILL,
      fontStyle: "bold",
      lineColor: RULE,
      lineWidth: { bottom: 0.75 },
    },
    columnStyles: Object.fromEntries(
      report.columns.map((column, index) => [
        index,
        {
          halign: isNumeric(column.kind) ? "right" : "left",
          // Numbers and dates keep one line; text columns take the rest
          cellWidth: column.kind === "text" ? "auto" : "wrap",
        },
      ])
    ),
    didParseCell: (data) => {
      if (
        data.section === "head" &&
        isNumeric(report.columns[data.column.index].kind)
      ) {
        data.cell.styles.halign = "right"
      }
    },
  })

  // Footer on every page, drawn last so the page count is known
  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    doc.setDrawColor(...RULE)
    doc.setLineWidth(0.5)
    doc.line(MARGIN, pageHeight - 40, right, pageHeight - 40)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(
      pdfText(`BeeBudget - ${report.name} - ${report.period}`),
      MARGIN,
      pageHeight - 26
    )
    doc.text(report.labels.page(page, pageCount), right, pageHeight - 26, {
      align: "right",
    })
  }

  doc.save(`${report.fileName}.pdf`)
}

/** Default file name: beebudget-cash-flow-2026-10-01-2026-10-31 */
export function reportFileName(report: Report) {
  return `beebudget-${report.type.replace(/_/g, "-")}-${report.from}-${report.to}`
}
