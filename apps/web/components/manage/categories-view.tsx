"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { deleteExpenseCategory } from "@/services/expense-categories.services"
import { deleteIncomeCategory } from "@/services/income-categories.services"
import type { ExpenseCategory, IncomeCategory } from "@/types"
import { Badge } from "@bee-budget/ui/badge"
import { Button } from "@bee-budget/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bee-budget/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bee-budget/ui/tooltip"
import { Lock, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { CategoryForm, type CategoryKind } from "./category.form"
import { EntitySheet } from "./entity-sheet"
import { ManageItem } from "./manage-item"
import { RowActions } from "./row-actions"

type Category = ExpenseCategory | IncomeCategory
type SheetState =
  | { open: false }
  | { open: true; kind: CategoryKind; category?: Category }

export function CategoriesView() {
  const t = useI18n()
  const {
    expenseCategories,
    incomeCategories,
    walletTypes,
    removeExpenseCategory,
    removeIncomeCategory,
  } = useApp()
  const [tab, setTab] = useState<CategoryKind>("expense")
  const [sheet, setSheet] = useState<SheetState>({ open: false })

  async function onDelete(kind: CategoryKind, category: Category) {
    const result =
      kind === "expense"
        ? await deleteExpenseCategory(category.id)
        : await deleteIncomeCategory(category.id)
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    if (kind === "expense") removeExpenseCategory(category.id)
    else removeIncomeCategory(category.id)
    toast.success(
      t("app.manage.toast.deleted", { name: displayName(category.name) })
    )
  }

  function renderList(kind: CategoryKind, categories: Category[]) {
    if (categories.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {t("app.manage.category.empty")}
        </p>
      )
    }
    return (
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const name = displayName(category.name)
          const walletType = walletTypes.find(
            (item) => item.id === category.defaultWalletTypeId
          )
          return (
            <ManageItem
              key={category.id}
              color={category.color}
              name={name}
              details={
                walletType
                  ? t("app.manage.category.defaultsTo", {
                      name: displayName(walletType.name),
                    })
                  : undefined
              }
              badge={
                category.isSystem && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="gap-1">
                        <Lock className="size-3" />
                        {t("app.manage.system")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("app.manage.systemHelp")}
                    </TooltipContent>
                  </Tooltip>
                )
              }
              actions={
                !category.isSystem && (
                  <RowActions
                    label={name}
                    onEdit={() => setSheet({ open: true, kind, category })}
                    onDelete={() => onDelete(kind, category)}
                    deleteTitle={t("app.manage.category.deleteTitle", { name })}
                    deleteContent={
                      kind === "expense"
                        ? t("app.manage.category.deleteExpenseContent")
                        : t("app.manage.category.deleteIncomeContent")
                    }
                  />
                )
              }
            />
          )
        })}
      </ul>
    )
  }

  return (
    <TooltipProvider>
      <section className="space-y-4 px-4">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as CategoryKind)}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="expense">
                {t("app.manage.category.expenses")} ({expenseCategories.length})
              </TabsTrigger>
              <TabsTrigger value="income">
                {t("app.manage.category.incomes")} ({incomeCategories.length})
              </TabsTrigger>
            </TabsList>
            <Button onClick={() => setSheet({ open: true, kind: tab })}>
              <Plus />
              {tab === "expense"
                ? t("app.manage.category.newExpense")
                : t("app.manage.category.newIncome")}
            </Button>
          </div>
          <TabsContent value="expense">
            {renderList("expense", expenseCategories)}
          </TabsContent>
          <TabsContent value="income">
            {renderList("income", incomeCategories)}
          </TabsContent>
        </Tabs>

        <EntitySheet
          open={sheet.open}
          onOpenChange={(open) => !open && setSheet({ open: false })}
          title={
            !sheet.open
              ? ""
              : sheet.category
                ? t("app.manage.category.editTitle")
                : sheet.kind === "expense"
                  ? t("app.manage.category.newExpense")
                  : t("app.manage.category.newIncome")
          }
          description={t("app.manage.category.formDescription")}
        >
          {sheet.open && (
            <CategoryForm
              key={`${sheet.kind}-${sheet.category?.id ?? "new"}`}
              kind={sheet.kind}
              category={sheet.category}
              onDone={() => setSheet({ open: false })}
            />
          )}
        </EntitySheet>
      </section>
    </TooltipProvider>
  )
}
