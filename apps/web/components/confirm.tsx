"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bee-budget/ui/alert-dialog"
import { ReactNode } from "react"

export type ConfirmProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: ReactNode
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function Confirm({
  children,
  open,
  onOpenChange,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmProps) {
  const t = useScopedI18n("app.confirm")
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        {(title || content) && (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {content && (
              <AlertDialogDescription>{content}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText ?? t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText ?? t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
