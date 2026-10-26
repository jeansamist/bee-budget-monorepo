"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import {
  createExpenseCategorySchema,
  type CreateExpenseCategorySchema,
  type CreateExpenseCategorySchemaInput,
} from "@/schemas/expense-categories.schemas"
import {
  createExpenseCategory,
  updateExpenseCategory,
} from "@/services/expense-categories.services"
import {
  createIncomeCategory,
  updateIncomeCategory,
} from "@/services/income-categories.services"
import type { ExpenseCategory, IncomeCategory } from "@/types"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { FieldGroup } from "@bee-budget/ui/field"
import { InputField, SelectField } from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormActions } from "./form-actions"

export type CategoryKind = "expense" | "income"

// Income and expense categories have the same fields
type CategoryFormValues = CreateExpenseCategorySchema

const NONE = "null"

export function CategoryForm({
  kind,
  category,
  onDone,
}: {
  kind: CategoryKind
  category?: ExpenseCategory | IncomeCategory
  onDone: () => void
}) {
  const t = useI18n()
  const { walletTypes, contacts, addExpenseCategory, addIncomeCategory } =
    useApp()
  const isEditing = Boolean(category)
  const form = useForm<
    CreateExpenseCategorySchemaInput,
    unknown,
    CategoryFormValues
  >({
    resolver: zodResolver(createExpenseCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
      color: category?.color ?? (kind === "expense" ? "#ef4444" : "#22c55e"),
      icon: category?.icon ?? null,
      defaultWalletTypeId: category?.defaultWalletTypeId ?? NONE,
      defaultContactId: category?.defaultContactId ?? NONE,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  const walletTypeItems = useMemo(
    () => [
      { value: NONE, label: t("app.manage.category.none") },
      ...walletTypes.map((walletType) => ({
        value: walletType.id.toString(),
        label: displayName(walletType.name),
      })),
    ],
    [walletTypes, t]
  )
  const contactItems = useMemo(
    () => [
      { value: NONE, label: t("app.manage.category.none") },
      ...contacts.map((contact) => ({
        value: contact.id.toString(),
        label: contact.name,
      })),
    ],
    [contacts, t]
  )

  async function save(data: CategoryFormValues) {
    if (kind === "expense") {
      const result = category
        ? await updateExpenseCategory(category.id, data)
        : await createExpenseCategory(data)
      if (result.success && result.data) addExpenseCategory(result.data)
      return result
    }
    const result = category
      ? await updateIncomeCategory(category.id, data)
      : await createIncomeCategory(data)
    if (result.success && result.data) addIncomeCategory(result.data)
    return result
  }

  async function onSubmit(data: CategoryFormValues) {
    const result = await save(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    toast.success(
      t(isEditing ? "app.manage.toast.updated" : "app.manage.toast.created", {
        name: displayName(result.data.name),
      })
    )
    onDone()
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
          label={t("app.manage.category.fields.name")}
          name="name"
          placeholder={t("app.manage.category.fields.namePlaceholder")}
        />
        <InputField
          formReturn={form}
          label={t("app.manage.category.fields.color")}
          name="color"
          type="color"
        />
        <SelectField
          formReturn={form}
          label={t("app.manage.category.fields.defaultWalletType")}
          description={t("app.manage.category.fields.defaultWalletTypeHelp")}
          name="defaultWalletTypeId"
          items={walletTypeItems}
        />
        <SelectField
          formReturn={form}
          label={
            kind === "expense"
              ? t("app.manage.category.fields.defaultPayee")
              : t("app.manage.category.fields.defaultPayer")
          }
          name="defaultContactId"
          items={contactItems}
        />
        <FormActions
          isEditing={isEditing}
          disabled={!form.formState.isValid}
          submitting={form.formState.isSubmitting}
          onCancel={onDone}
        />
      </FieldGroup>
    </form>
  )
}
