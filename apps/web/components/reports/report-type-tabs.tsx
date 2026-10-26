"use client"

import { useI18n } from "@/lib/i18n/client"
import type { ReportType } from "@/types"
import { cn } from "@bee-budget/functions"

const GROUPS: {
  key: "activity" | "breakdown" | "accounts"
  types: ReportType[]
}[] = [
  { key: "activity", types: ["transactions", "cash_flow"] },
  {
    key: "breakdown",
    types: ["expenses_by_category", "incomes_by_category", "contacts"],
  },
  { key: "accounts", types: ["wallets", "budgets"] },
]

/** Report picker as underlined tabs, grouped; scrolls sideways on small screens. */
export function ReportTypeTabs({
  value,
  onChange,
}: {
  value: ReportType
  onChange: (type: ReportType) => void
}) {
  const t = useI18n()

  return (
    <nav
      aria-label={t("app.reports.chooseType")}
      className="-mx-4 overflow-x-auto border-b px-4 [scrollbar-width:none]"
    >
      <div className="flex w-max gap-8">
        {GROUPS.map((group) => (
          <div key={group.key} className="space-y-1 pt-1">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {t(`app.reports.groups.${group.key}`)}
            </p>
            <div className="flex gap-4">
              {group.types.map((type) => {
                const active = value === type
                return (
                  <button
                    key={type}
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onChange(type)}
                    className={cn(
                      "-mb-px border-b-2 border-transparent pb-2.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
                      active && "border-primary font-medium text-foreground"
                    )}
                  >
                    {t(`app.reports.types.${type}.title`)}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}
