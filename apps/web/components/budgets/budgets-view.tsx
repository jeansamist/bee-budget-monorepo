"use client"

import { EntitySheet } from "@/components/manage/entity-sheet"
import { RowActions } from "@/components/manage/row-actions"
import { useApp } from "@/contexts/app.context"
import { displayName, formatAmount } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { deleteBudget } from "@/services/budgets.services"
import type { Budget, BudgetStatus } from "@/types"
import { cn } from "@bee-budget/functions"
import { Badge } from "@bee-budget/ui/badge"
import { Button } from "@bee-budget/ui/button"
import { PiggyBank, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { BudgetForm } from "./budget.form"

type SheetState = { open: false } | { open: true; budget?: Budget }

const statusStyles: Record<BudgetStatus, { bar: string; badge: string }> = {
  ok: {
    bar: "bg-green-500",
    badge: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  warning: {
    bar: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  exceeded: { bar: "bg-red-500", badge: "bg-red-500/10 text-red-600" },
}

const byName = (a: Budget, b: Budget) => a.name.localeCompare(b.name)

export function BudgetsView({ initialBudgets }: { initialBudgets: Budget[] }) {
  const t = useI18n()
  const { expenseCategories, wallets } = useApp()
  const [budgets, setBudgets] = useState(() => [...initialBudgets].sort(byName))
  const [sheet, setSheet] = useState<SheetState>({ open: false })

  const atRisk = budgets.filter((budget) => budget.status !== "ok").length
  const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  function target(budget: Budget) {
    if (budget.targetType === "wallet") {
      const wallet = wallets.find((item) => item.id === budget.walletId)
      return { name: displayName(wallet?.name), color: "#64748b" }
    }
    const category = expenseCategories.find(
      (item) => item.id === budget.expenseCategoryId
    )
    return {
      name: displayName(category?.name),
      color: category?.color ?? "#64748b",
    }
  }

  function onSaved(saved: Budget) {
    setBudgets((previous) =>
      [...previous.filter((budget) => budget.id !== saved.id), saved].sort(
        byName
      )
    )
    setSheet({ open: false })
  }

  async function onDelete(budget: Budget) {
    const result = await deleteBudget(budget.id)
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    setBudgets((previous) => previous.filter((item) => item.id !== budget.id))
    toast.success(t("app.manage.toast.deleted", { name: budget.name }))
  }

  return (
    <section className="space-y-4 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {budgets.length === 0
            ? t("app.budgets.intro")
            : t("app.budgets.summary", {
                count: budgets.length,
                spent: formatAmount(totalSpent),
                total: formatAmount(totalAmount),
                atRisk,
              })}
        </p>
        <Button onClick={() => setSheet({ open: true })}>
          <Plus />
          {t("app.budgets.new")}
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PiggyBank />
          </span>
          <p className="font-semibold">{t("app.budgets.empty.title")}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {t("app.budgets.empty.description")}
          </p>
          <Button variant="outline" onClick={() => setSheet({ open: true })}>
            <Plus />
            {t("app.budgets.new")}
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => {
            const { name: targetName, color } = target(budget)
            const styles = statusStyles[budget.status]
            return (
              <li
                key={budget.id}
                className="min-w-0 space-y-4 rounded-3xl bg-accent p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{budget.name}</h3>
                    <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: color }}
                      />
                      {t(`app.budgets.targets.${budget.targetType}`)}:{" "}
                      {targetName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge className={cn("border-0", styles.badge)}>
                      {t(`app.budgets.status.${budget.status}`)}
                    </Badge>
                    <RowActions
                      label={budget.name}
                      onEdit={() => setSheet({ open: true, budget })}
                      onDelete={() => onDelete(budget)}
                      deleteTitle={t("app.budgets.deleteTitle", {
                        name: budget.name,
                      })}
                      deleteContent={t("app.budgets.deleteContent")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-2xl font-bold tabular-nums">
                      {formatAmount(budget.spent)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / {formatAmount(budget.amount)} XAF
                      </span>
                    </p>
                    <span className="text-sm font-medium tabular-nums">
                      {budget.progress}%
                    </span>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-background"
                    role="progressbar"
                    aria-valuenow={budget.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={budget.name}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        styles.bar
                      )}
                      style={{ width: `${Math.min(budget.progress, 100)}%` }}
                    />
                  </div>
                  <p className="flex justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {budget.remaining >= 0
                        ? t("app.budgets.remaining", {
                            amount: formatAmount(budget.remaining),
                          })
                        : t("app.budgets.over", {
                            amount: formatAmount(-budget.remaining),
                          })}
                    </span>
                    <span>
                      {t(`app.budgets.periods.${budget.period}`)} ·{" "}
                      {budget.periodStart} → {budget.periodEnd}
                    </span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <EntitySheet
        open={sheet.open}
        onOpenChange={(open) => !open && setSheet({ open: false })}
        title={
          sheet.open && sheet.budget
            ? t("app.budgets.editTitle")
            : t("app.budgets.createTitle")
        }
        description={t("app.budgets.formDescription")}
      >
        {sheet.open && (
          <BudgetForm
            key={sheet.budget?.id ?? "new"}
            budget={sheet.budget}
            onSaved={onSaved}
            onCancel={() => setSheet({ open: false })}
          />
        )}
      </EntitySheet>
    </section>
  )
}
