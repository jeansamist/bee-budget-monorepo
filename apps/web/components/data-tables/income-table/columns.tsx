/* eslint-disable @next/next/no-img-element */
"use client"

import { useApp } from "@/contexts/app.context"
import { useI18n } from "@/lib/i18n/client"
import { Contact, Income, IncomeCategory, Wallet, WalletType } from "@/types"
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
import { useMemo } from "react"

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Income>
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

// Header components (must be React components to use hooks)
const SelectHeader = ({ table }: { table: Table<Income> }) => {
  const t = useI18n()
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label={t("app.dataTables.incomeTable.selectAll")}
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
      aria-label={t("app.dataTables.incomeTable.select")}
    />
  )
}

const IdHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.idIncome")}
    />
  )
}

const NameHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.name")}
    />
  )
}

const CategoryHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.category")}
    />
  )
}

const FromHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.from")}
    />
  )
}

const WalletHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.wallet")}
    />
  )
}

const DateHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.date")}
    />
  )
}

const AmountHeader = ({ column }: { column: Column<Income> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.incomeTable.columns.totalAmount")}
    />
  )
}

const ActionsHeader = () => {
  const t = useI18n()
  return (
    <div className="text-right">
      {t("app.dataTables.incomeTable.columns.actions")}
    </div>
  )
}

const ActionsCell = ({ row }: { row: { original: Income } }) => {
  const t = useI18n()
  const income = row.original

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">
              {t("app.dataTables.incomeTable.actions.openMenu")}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("app.dataTables.incomeTable.actions.label")}
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(income.id.toString())}
          >
            {t("app.dataTables.incomeTable.actions.copyId")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {t("app.dataTables.incomeTable.actions.view")}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            {t("app.dataTables.incomeTable.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const IncomeCategoryCell = ({ row }: { row: { original: Income } }) => {
  const income = row.original
  const { incomeCategories } = useApp()
  const category = useMemo<IncomeCategory | undefined>(() => {
    return findById(incomeCategories, income.incomeCategoryId)
  }, [incomeCategories, income.incomeCategoryId])

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

const ContactCell = ({ row }: { row: { original: Income } }) => {
  const income = row.original
  const { contacts } = useApp()
  const contact = useMemo<Contact | undefined>(() => {
    return findById(contacts, income.fromContactId || 0)
  }, [contacts, income.fromContactId])

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

const WalletCell = ({ row }: { row: { original: Income } }) => {
  const income = row.original
  const { wallets, walletTypes } = useApp()
  const wallet = useMemo<Wallet | undefined>(() => {
    return findById(wallets, income.walletId || 0)
  }, [wallets, income.walletId])

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

export const columns: ColumnDef<Income>[] = [
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
      const income = row.original
      return (
        <div className="flex items-center gap-2">
          <span>#{income.id.toString().padStart(5, "0")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: NameHeader,
    cell: ({ row }) => {
      const income = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="leading-none font-medium">{income.name}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {income.description}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "incomeCategoryId",
    header: CategoryHeader,
    cell: IncomeCategoryCell,
  },
  {
    accessorKey: "fromContactId",
    header: FromHeader,
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
      const income = row.original
      return (
        <span>
          {income.date
            ? new Date(income.date).toLocaleDateString("en-US", {
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
      const income = row.original
      return (
        <div>
          <span className="font-semibold">
            {income.amount.toLocaleString()}
          </span>
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
