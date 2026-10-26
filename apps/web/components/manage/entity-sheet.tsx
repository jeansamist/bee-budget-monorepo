"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@bee-budget/ui/sheet"
import type { ReactNode } from "react"

export type EntitySheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}

/** Controlled side sheet that hosts a create or edit form. */
export function EntitySheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: EntitySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
