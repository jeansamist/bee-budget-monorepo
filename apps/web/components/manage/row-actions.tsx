"use client"

import { Confirm } from "@/components/confirm"
import { useI18n } from "@/lib/i18n/client"
import { Button } from "@bee-budget/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bee-budget/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"

/** "…" menu with Edit and Delete; Delete asks for confirmation first. */
export function RowActions({
  label,
  onEdit,
  onDelete,
  deleteTitle,
  deleteContent,
  disabled = false,
}: {
  label: string
  onEdit: () => void
  onDelete: () => void
  deleteTitle: ReactNode
  deleteContent: ReactNode
  disabled?: boolean
}) {
  const t = useI18n()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label={t("app.manage.actions.menu", { name: label })}
            disabled={disabled}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil />
            {t("app.manage.actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 />
            {t("app.manage.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Confirm
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={deleteTitle}
        content={deleteContent}
        confirmText={t("app.manage.actions.delete")}
        onConfirm={onDelete}
      />
    </>
  )
}
