/* eslint-disable @next/next/no-img-element */
"use client"

import { useApp } from "@/contexts/app.context"
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
import { Column, ColumnDef } from "@tanstack/react-table"
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
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column} title="ID Income" />
    ),
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
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
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
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
    cell: IncomeCategoryCell,
  },
  {
    accessorKey: "fromContactId",
    header: ({ column }) => <SortableHeader column={column} title="From" />,
    cell: ContactCell,
  },
  {
    accessorKey: "walletId",
    header: ({ column }) => <SortableHeader column={column} title="Wallet" />,
    cell: WalletCell,
  },

  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
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
    header: ({ column }) => (
      <SortableHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const income = row.original
      return (
        <div>
          <span>{income.amount}</span>
          <span className="text-muted-foreground">XAF</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>, // no sorting here
    enableSorting: false,
    cell: ({ row }) => {
      const income = row.original

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(income.id.toString())
                }
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View income</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Delete income
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
