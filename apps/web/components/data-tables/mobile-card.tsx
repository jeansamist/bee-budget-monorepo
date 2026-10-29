"use client"

import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import { Checkbox } from "@bee-budget/ui/checkbox"
import { Row, Table } from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { ComponentProps, ReactNode } from "react"

// Compact row shown instead of the table on mobile; tapping it opens the
// row's detail dialog.
export function DataTableMobileCard<TData>({
  row,
  table,
  selectLabel,
  onOpen,
  children,
}: {
  row: Row<TData>
  table: Table<TData>
  selectLabel: string
  onOpen: () => void
  children: ReactNode
}) {
  return (
    <div
      data-state={row.getIsSelected() && "selected"}
      className="flex items-center gap-3 rounded-md border p-3 data-[state=selected]:bg-muted"
    >
      {table.options.meta?.selectable && (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={selectLabel}
        />
      )}
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 text-left"
      >
        {children}
      </button>
    </div>
  )
}

// Labelled dropdown trigger used for the actions menu inside detail dialogs.
export function DataTableActionsTrigger({
  label,
  className,
  ...props
}: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Button
      variant="default"
      className={cn("w-full sm:w-auto", className)}
      {...props}
    >
      {label}
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
}
