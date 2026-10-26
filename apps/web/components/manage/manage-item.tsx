"use client"

import { cn } from "@bee-budget/functions"
import type { ReactNode } from "react"

/** One row of a management list: color dot, name, details and actions. */
export function ManageItem({
  color,
  name,
  details,
  badge,
  actions,
}: {
  color: string
  name: string
  details?: ReactNode
  badge?: ReactNode
  actions?: ReactNode
}) {
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-2xl bg-accent px-4 py-3">
      <span
        className={cn("size-3 shrink-0 rounded-full ring-2 ring-background")}
        style={{ background: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate font-medium">
          <span className="truncate">{name}</span>
          {badge}
        </p>
        {details && (
          <p className="truncate text-xs text-muted-foreground">{details}</p>
        )}
      </div>
      {actions}
    </li>
  )
}
