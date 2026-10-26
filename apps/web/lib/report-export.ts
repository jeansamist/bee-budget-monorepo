import type { Report, ReportColumnKind } from "@/types"

/** A report with every label already translated, ready to be written to a file. */
export type ExportableReport = {
  title: string
  subtitle: string
  columns: { key: string; label: string; kind: ReportColumnKind }[]
  rows: Record<string, string | number | null>[]
  /** `value` is for display (PDF, screen), `raw` for spreadsheets. */
  totals: { label: string; value: string; raw: number }[]
  fileName: string
}

// Brand orange (primary) as RGB for PDF and Excel headers
const BRAND = { hex: "C2410C", rgb: [194, 65, 12] as [number, number, number] }

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

  sheet.addRow([report.title]).font = { bold: true, size: 14 }
  sheet.addRow([report.subtitle]).font = { color: { argb: "FF6B7280" } }
  sheet.addRow([])

  const header = sheet.addRow(report.columns.map((column) => column.label))
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${BRAND.hex}` },
    }
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
  sheet.views = [{ state: "frozen", ySplit: 4 }]

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
  value.replace(/→/g, "->").replace(/[  ]/g, " ").replace(/[–—]/g, "-")

function pdfCell(value: string | number | null, kind: ReportColumnKind) {
  if (value === null || value === "") return "-"
  if (kind === "amount") return Number(value).toLocaleString("en-US")
  if (kind === "percent") return `${value}%`
  return String(value)
}

const isNumeric = (kind: ReportColumnKind) =>
  kind === "amount" || kind === "number" || kind === "percent"

export async function exportPdf(report: ExportableReport) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ])
  const doc = new jsPDF({
    orientation: report.columns.length > 6 ? "landscape" : "portrait",
    unit: "pt",
    format: "a4",
  })
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(...BRAND.rgb)
  doc.rect(0, 0, pageWidth, 6, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text(pdfText(report.title), 40, 48)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(pdfText(report.subtitle), 40, 66)

  // Totals as a single line of "label: value"
  const summary = report.totals
    .map((total) => `${total.label}: ${total.value}`)
    .join("   ·   ")
  doc.setTextColor(17, 24, 39)
  doc.text(pdfText(summary), 40, 86, { maxWidth: pageWidth - 80 })

  autoTable(doc, {
    startY: 104,
    head: [report.columns.map((column) => pdfText(column.label))],
    body: report.rows.map((row) =>
      report.columns.map((column) =>
        pdfText(pdfCell(row[column.key], column.kind))
      )
    ),
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: { fillColor: BRAND.rgb, textColor: 255 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: Object.fromEntries(
      report.columns.map((column, index) => [
        index,
        { halign: isNumeric(column.kind) ? "right" : "left" },
      ])
    ),
    margin: { left: 40, right: 40 },
    // Align numeric headers with their values
    didParseCell: (data) => {
      if (
        data.section === "head" &&
        isNumeric(report.columns[data.column.index].kind)
      ) {
        data.cell.styles.halign = "right"
      }
    },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight()
      doc.setFontSize(8)
      doc.setTextColor(156, 163, 175)
      doc.text("BeeBudget", 40, pageHeight - 20)
      doc.text(`${doc.getNumberOfPages()}`, pageWidth - 40, pageHeight - 20, {
        align: "right",
      })
    },
  })

  doc.save(`${report.fileName}.pdf`)
}

/** Default file name: beebudget-cash-flow-2026-10-01-2026-10-31 */
export function reportFileName(report: Report) {
  return `beebudget-${report.type.replace(/_/g, "-")}-${report.from}-${report.to}`
}
