/* eslint-disable @next/next/no-img-element */
"use client"

import { useApp } from "@/contexts/app.context"
import { useI18n } from "@/lib/i18n/client"
import { deleteExpense } from "@/services/expenses.services"
import { Contact, Expense, ExpenseCategory, Wallet, WalletType } from "@/types"
import { cn, findById } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import { Checkbox } from "@bee-budget/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bee-budget/ui/dropdown-menu"
import { Column, ColumnDef, Table } from "@tanstack/react-table"
import { ChevronsUpDown, Eye, MoreHorizontal } from "lucide-react"
import { useMemo, useState } from "react"
import { Confirm } from "../../confirm"
import { ExpenseDetailDialog } from "./expense-detail-dialog"

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Expense>
  title: string
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2 p-0 hover:bg-transparent"
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ChevronsUpDown className="h-4 w-4" />
    </Button>
  )
}

const SelectHeader = ({ table }: { table: Table<Expense> }) => {
  const t = useI18n()
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label={t("app.dataTables.expenseTable.selectAll")}
    />
  )
}

const SelectCell = ({
  row,
}: {
  row: { getIsSelected: () => boolean; toggleSelected: (v: boolean) => void }
}) => {
  const t = useI18n()
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label={t("app.dataTables.expenseTable.select")}
    />
  )
}

const IdHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.expenseTable.columns.idExpense")}
    />
  )
}

const NameHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.expenseTable.columns.name")}
    />
  )
}

const CategoryHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.expenseTable.columns.category")}
    />
  )
}

const ToHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader column={column} title={t("app.dataTables.expenseTable.columns.to")} />
  )
}

const WalletHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.expenseTable.columns.wallet")}
    />
  )
}

const DateHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader column={column} title={t("app.dataTables.expenseTable.columns.date")} />
  )
}

const AmountHeader = ({ column }: { column: Column<Expense> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.expenseTable.columns.totalAmount")}
    />
  )
}

const ActionsHeader = () => {
  const t = useI18n()
  return <div className="text-right">{t("app.dataTables.expenseTable.columns.actions")}</div>
}

const ActionsCell = ({
  row,
  table,
}: {
  row: { original: Expense }
  table: Table<Expense>
}) => {
  const t = useI18n()
  const expense = row.original
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = async () => {
    await deleteExpense(expense.id)
    table.options.meta?.onDeleted?.()
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="icon" onClick={() => setDetailOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">
              {t("app.dataTables.expenseTable.actions.openMenu")}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("app.dataTables.expenseTable.actions.label")}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(expense.id.toString())}
          >
            {t("app.dataTables.expenseTable.actions.copyId")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            {t("app.dataTables.expenseTable.actions.view")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            {t("app.dataTables.expenseTable.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExpenseDetailDialog
        expense={expense}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <Confirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("app.dataTables.expenseTable.actions.delete")}
        content={t("app.dashboard.lastExpenses.deleteConfirm.content")}
        confirmText={t("app.dashboard.lastExpenses.deleteConfirm.confirm")}
        onConfirm={handleDelete}
      />
    </div>
  )
}

const ExpenseCategoryCell = ({ row }: { row: { original: Expense } }) => {
  const expense = row.original
  const { expenseCategories } = useApp()
  const category = useMemo<ExpenseCategory | undefined>(() => {
    return findById(expenseCategories, expense.expenseCategoryId)
  }, [expenseCategories, expense.expenseCategoryId])

  return (
    <div className="flex items-center gap-2">
      {category ? (
        <>
          <span
            className={cn("h-2 w-2 rounded-full")}
            style={{ backgroundColor: category.color }}
            aria-label={category.name}
          />
          <span className="font-medium">{category.name}</span>
        </>
      ) : (
        <span className="font-medium">---</span>
      )}
    </div>
  )
}

const ContactCell = ({ row }: { row: { original: Expense } }) => {
  const expense = row.original
  const { contacts } = useApp()
  const contact = useMemo<Contact | undefined>(() => {
    return findById(contacts, expense.toContactId || 0)
  }, [contacts, expense.toContactId])

  return (
    <div className="flex items-center gap-2">
      {contact ? (
        <>
          {contact.image ? (
            <img
              src={contact.image}
              alt={contact.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <span
              className={cn("h-2 w-2 rounded-full")}
              style={{ backgroundColor: contact.color }}
              aria-label={contact.name}
            />
          )}
          <div className="flex flex-col space-y-1 leading-none">
            <p className="leading-none font-medium">{contact.name}</p>
          </div>
        </>
      ) : (
        <span className="font-medium">---</span>
      )}
    </div>
  )
}

const WalletCell = ({ row }: { row: { original: Expense } }) => {
  const expense = row.original
  const { wallets, walletTypes } = useApp()
  const wallet = useMemo<Wallet | undefined>(() => {
    return findById(wallets, expense.walletId || 0)
  }, [wallets, expense.walletId])

  const walletType = useMemo<WalletType | undefined>(() => {
    return findById(walletTypes, wallet?.walletTypeId || 0)
  }, [walletTypes, wallet?.walletTypeId])

  return (
    <div className="flex items-center gap-2">
      {wallet && walletType ? (
        <>
          <span
            className={cn("h-2 w-2 rounded-full")}
            style={{ backgroundColor: walletType.color }}
            aria-label={walletType.name}
          />
          <div className="flex flex-col space-y-1 leading-none">
            <p className="leading-none font-medium">{wallet.name}</p>
          </div>
        </>
      ) : (
        <span className="font-medium">---</span>
      )}
    </div>
  )
}

export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: IdHeader,
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex items-center gap-2">
          <span>#{expense.id.toString().padStart(5, "0")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: NameHeader,
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="leading-none font-medium">{expense.name}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {expense.description}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "expenseCategoryId",
    header: CategoryHeader,
    cell: ExpenseCategoryCell,
  },
  {
    accessorKey: "toContactId",
    header: ToHeader,
    cell: ContactCell,
  },
  {
    accessorKey: "walletId",
    header: WalletHeader,
    cell: WalletCell,
  },
  {
    accessorKey: "date",
    header: DateHeader,
    cell: ({ row }) => {
      const expense = row.original
      return (
        <span>
          {expense.date
            ? new Date(expense.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "---"}
        </span>
      )
    },
  },
  {
    accessorKey: "amount",
    header: AmountHeader,
    cell: ({ row }) => {
      const expense = row.original
      const total = expense.amount + (expense.fees ?? 0)
      return (
        <div>
          <span className="font-semibold">{total.toLocaleString()}</span>
          <span className="text-muted-foreground">XAF</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: ActionsHeader,
    enableSorting: false,
    cell: ActionsCell,
  },
]
