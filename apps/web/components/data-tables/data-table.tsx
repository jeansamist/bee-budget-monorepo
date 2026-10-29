"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowData,
  SortingState,
  Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    // NOSONAR
    onDeleted?: () => void
    selectable?: boolean
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bee-budget/ui/table"
import { cn } from "@bee-budget/functions"
import { Fragment, ReactNode, useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleRowSelection?: (rowOriginals: TData[]) => void
  resetSelectionTrigger?: unknown
  onDeleted?: () => void
  canSelectRow?: (rowOriginal: TData) => boolean
  renderMobileCard?: (row: Row<TData>, table: TanstackTable<TData>) => ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleRowSelection,
  resetSelectionTrigger,
  onDeleted,
  canSelectRow,
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) =>
      canSelectRow ? canSelectRow(row.original) : true,
    state: {
      sorting,
      rowSelection,
    },
    meta: { onDeleted, selectable: Boolean(handleRowSelection) },
  })

  useEffect(() => {
    if (handleRowSelection) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
      handleRowSelection(selectedRows)
    }
  }, [handleRowSelection, rowSelection, table])

  useEffect(() => {
    table.resetRowSelection()
  }, [resetSelectionTrigger, table])
  const rows = table.getRowModel().rows
  return (
    <>
      {renderMobileCard && (
        <div className="space-y-2 md:hidden">
          {rows.length ? (
            rows.map((row) => (
              <Fragment key={row.id}>{renderMobileCard(row, table)}</Fragment>
            ))
          ) : (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-md border",
          renderMobileCard && "hidden md:block"
        )}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
