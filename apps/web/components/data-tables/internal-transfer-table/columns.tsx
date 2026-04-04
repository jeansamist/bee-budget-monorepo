"use client"

import { useApp } from "@/contexts/app.context"
import { useI18n } from "@/lib/i18n/client"
import { deleteInternalTransfer } from "@/services/internal-transfers.services"
import { InternalTransfer, Wallet, WalletType } from "@/types"
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
import { InternalTransferDetailDialog } from "./internal-transfer-detail-dialog"

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<InternalTransfer>
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

const SelectHeader = ({ table }: { table: Table<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label={t("app.dataTables.internalTransferTable.selectAll")}
    />
  )
}

const SelectCell = ({
  row,
}: {
  row: {
    getIsSelected: () => boolean
    toggleSelected: (v: boolean) => void
    getCanSelect: () => boolean
  }
}) => {
  const t = useI18n()
  return (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label={t("app.dataTables.internalTransferTable.select")}
    />
  )
}

const IdHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.idTransfer")}
    />
  )
}

const NameHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.name")}
    />
  )
}

const SourceWalletHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.sourceWallet")}
    />
  )
}

const TargetWalletHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.targetWallet")}
    />
  )
}

const DateHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.date")}
    />
  )
}

const AmountHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.amount")}
    />
  )
}

const FeeHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.fee")}
    />
  )
}

const TotalDebitHeader = ({ column }: { column: Column<InternalTransfer> }) => {
  const t = useI18n()
  return (
    <SortableHeader
      column={column}
      title={t("app.dataTables.internalTransferTable.columns.totalDebit")}
    />
  )
}

const ActionsHeader = () => {
  const t = useI18n()
  return <div className="text-right">{t("app.dataTables.internalTransferTable.columns.actions")}</div>
}

const WalletCell = ({
  walletId,
}: {
  walletId: number
}) => {
  const { wallets, walletTypes } = useApp()
  const wallet = useMemo<Wallet | undefined>(() => findById(wallets, walletId), [walletId, wallets])
  const walletType = useMemo<WalletType | undefined>(
    () => (wallet ? findById(walletTypes, wallet.walletTypeId) : undefined),
    [walletTypes, wallet]
  )

  return wallet && walletType ? (
    <div className="flex items-center gap-2">
      <span
        className={cn("h-2 w-2 rounded-full")}
        style={{ backgroundColor: walletType.color }}
        aria-label={walletType.name}
      />
      <span className="font-medium">{wallet.name}</span>
    </div>
  ) : (
    <span className="font-medium">---</span>
  )
}

const ActionsCell = ({
  row,
  table,
}: {
  row: { original: InternalTransfer }
  table: Table<InternalTransfer>
}) => {
  const t = useI18n()
  const transfer = row.original
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = async () => {
    await deleteInternalTransfer(transfer.id)
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
              {t("app.dataTables.internalTransferTable.actions.openMenu")}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("app.dataTables.internalTransferTable.actions.label")}
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(transfer.id.toString())}
          >
            {t("app.dataTables.internalTransferTable.actions.copyId")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            {t("app.dataTables.internalTransferTable.actions.view")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            {t("app.dataTables.internalTransferTable.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InternalTransferDetailDialog
        transfer={transfer}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <Confirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("app.dataTables.internalTransferTable.actions.delete")}
        content={t("app.dashboard.lastInternalTransfers.deleteConfirm.content")}
        confirmText={t("app.dashboard.lastInternalTransfers.deleteConfirm.confirm")}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export const columns: ColumnDef<InternalTransfer>[] = [
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
    cell: ({ row }) => (
      <span>#{row.original.id.toString().padStart(5, "0")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: NameHeader,
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col space-y-1 leading-none">
          <p className="leading-none font-medium">{transfer.name}</p>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {transfer.description || "---"}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "sourceWalletId",
    header: SourceWalletHeader,
    cell: ({ row }) => <WalletCell walletId={row.original.sourceWalletId} />,
  },
  {
    accessorKey: "targetWalletId",
    header: TargetWalletHeader,
    cell: ({ row }) => <WalletCell walletId={row.original.targetWalletId} />,
  },
  {
    accessorKey: "date",
    header: DateHeader,
    cell: ({ row }) =>
      row.original.date
        ? new Date(row.original.date).toLocaleDateString("en-US")
        : "---",
  },
  {
    accessorKey: "amount",
    header: AmountHeader,
    cell: ({ row }) => `${row.original.amount.toLocaleString()} XAF`,
  },
  {
    accessorKey: "fee",
    header: FeeHeader,
    cell: ({ row }) => `${(row.original.fee ?? 0).toLocaleString()} XAF`,
  },
  {
    id: "totalDebit",
    header: TotalDebitHeader,
    accessorFn: (row) => row.amount + (row.fee ?? 0),
    cell: ({ row }) =>
      `${(row.original.amount + (row.original.fee ?? 0)).toLocaleString()} XAF`,
  },
  {
    id: "actions",
    header: ActionsHeader,
    cell: ActionsCell,
    enableSorting: false,
  },
]
