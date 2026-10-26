"use client"

import { FormActions } from "@/components/manage/form-actions"
import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import {
  createBudgetSchema,
  type CreateBudgetSchema,
  type CreateBudgetSchemaInput,
} from "@/schemas/budgets.schemas"
import { createBudget, updateBudget } from "@/services/budgets.services"
import type { Budget } from "@/types"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { Field, FieldGroup, FieldLabel } from "@bee-budget/ui/field"
import { InputField, SelectField } from "@bee-budget/ui/fields"
import { ToggleGroup, ToggleGroupItem } from "@bee-budget/ui/toggle-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function BudgetForm({
  budget,
  onSaved,
  onCancel,
}: {
  budget?: Budget
  onSaved: (budget: Budget) => void
  onCancel: () => void
}) {
  const t = useI18n()
  const { expenseCategories, wallets } = useApp()
  const isEditing = Boolean(budget)
  const form = useForm<CreateBudgetSchemaInput, unknown, CreateBudgetSchema>({
    resolver: zodResolver(createBudgetSchema),
    mode: "onChange",
    defaultValues: {
      name: budget?.name ?? "",
      targetType: budget?.targetType ?? "expense_category",
      expenseCategoryId: budget?.expenseCategoryId ?? undefined,
      walletId: budget?.walletId ?? undefined,
      amount: budget?.amount,
      period: budget?.period ?? "monthly",
      alertThreshold: budget?.alertThreshold ?? 80,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const targetType = form.watch("targetType")

  const categoryItems = useMemo(
    () =>
      expenseCategories
        .filter((category) => !category.isSystem)
        .map((category) => ({
          value: category.id.toString(),
          label: displayName(category.name),
        })),
    [expenseCategories]
  )
  const walletItems = useMemo(
    () =>
      wallets.map((wallet) => ({
        value: wallet.id.toString(),
        label: displayName(wallet.name),
      })),
    [wallets]
  )
  const periodItems = useMemo(
    () => [
      { value: "weekly", label: t("app.budgets.periods.weekly") },
      { value: "monthly", label: t("app.budgets.periods.monthly") },
      { value: "yearly", label: t("app.budgets.periods.yearly") },
    ],
    [t]
  )

  async function onSubmit(data: CreateBudgetSchema) {
    const result = budget
      ? await updateBudget(budget.id, data)
      : await createBudget(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    toast.success(
      t(isEditing ? "app.manage.toast.updated" : "app.manage.toast.created", {
        name: result.data.name,
      })
    )
    onSaved(result.data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.budgets.fields.name")}
          name="name"
          placeholder={t("app.budgets.fields.namePlaceholder")}
        />
        <Field>
          <FieldLabel>{t("app.budgets.fields.appliesTo")}</FieldLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={targetType}
            onValueChange={(value) => {
              if (!value) return
              form.setValue(
                "targetType",
                value as CreateBudgetSchema["targetType"],
                { shouldValidate: true }
              )
            }}
          >
            <ToggleGroupItem value="expense_category">
              {t("app.budgets.targets.expense_category")}
            </ToggleGroupItem>
            <ToggleGroupItem value="wallet">
              {t("app.budgets.targets.wallet")}
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
        {targetType === "expense_category" ? (
          <SelectField
            key="category"
            formReturn={form}
            label={t("app.budgets.fields.category")}
            name="expenseCategoryId"
            placeholder={t("app.budgets.fields.categoryPlaceholder")}
            items={categoryItems}
          />
        ) : (
          <SelectField
            key="wallet"
            formReturn={form}
            label={t("app.budgets.fields.wallet")}
            description={t("app.budgets.fields.walletHelp")}
            name="walletId"
            placeholder={t("app.budgets.fields.walletPlaceholder")}
            items={walletItems}
          />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.budgets.fields.amount")}
            name="amount"
            type="number"
            min={1}
            placeholder="50000"
          />
          <SelectField
            formReturn={form}
            label={t("app.budgets.fields.period")}
            name="period"
            items={periodItems}
          />
        </div>
        <InputField
          formReturn={form}
          label={t("app.budgets.fields.alertThreshold")}
          description={t("app.budgets.fields.alertThresholdHelp")}
          name="alertThreshold"
          type="number"
          min={1}
          max={100}
        />
        <FormActions
          isEditing={isEditing}
          disabled={!form.formState.isValid}
          submitting={form.formState.isSubmitting}
          onCancel={onCancel}
        />
      </FieldGroup>
    </form>
  )
}
