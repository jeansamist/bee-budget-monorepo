"use client"

import { useApp } from "@/contexts/app.context"
import {
  CreateContactSheet,
  CreateExpenseCategorySheet,
  CreateWalletSheet,
} from "@/components/forms/inline-entity-create"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import {
  createExpenseSchema,
  type CreateExpenseSchema,
  type CreateExpenseSchemaInput,
} from "@/schemas/expenses.schemas"
import { createExpense, updateExpense } from "@/services/expenses.services"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { Button } from "@bee-budget/ui/button"
import { Field, FieldGroup } from "@bee-budget/ui/field"
import {
  DateField,
  InputField,
  SelectField,
  TextareaField,
} from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FunctionComponent, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

export type ExpenseFormProps = {
  defaultValues?: Partial<CreateExpenseSchemaInput>
  resourceId?: number
}

const getTodayDate = () => new Date()

export const ExpenseForm: FunctionComponent<ExpenseFormProps> = ({
  defaultValues,
  resourceId,
}) => {
  const form = useForm<CreateExpenseSchemaInput, unknown, CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      amount: undefined,
      fees: null,
      expenseCategoryId: undefined,
      walletId: undefined,
      date: getTodayDate(),
      toContactId: null,
      ...defaultValues,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const router = useRouter()
  const { expenseCategories, wallets, contacts } = useApp()
  const expenseCategoryItems = useMemo(
    () =>
      expenseCategories
        .filter((category) => !category.isSystem)
        .map((category) => ({
          value: category.id.toString(),
          label: category.name,
        })),
    [expenseCategories]
  )
  const walletItems = useMemo(
    () =>
      wallets.map((wallet) => ({
        value: wallet.id.toString(),
        label: wallet.name,
      })),
    [wallets]
  )
  const contactItems = useMemo(
    () => [
      {
        value: "null",
        label: t("app.forms.common.noContact"),
      },
      ...contacts.map((contact) => ({
        value: contact.id.toString(),
        label: contact.name,
      })),
    ],
    [contacts, t]
  )
  const isUpdate = typeof resourceId === "number"

  async function onSubmit(data: CreateExpenseSchema) {
    const result =
      typeof resourceId === "number"
        ? await updateExpense(resourceId, data)
        : await createExpense(data)

    if (!result.success) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    setErrorMessage(undefined)
    router.push(currentLocaleUrl("/app/transactions?tab=expenses"))
  }

  return (
    <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.forms.expenses.fields.name.label")}
            name="name"
            placeholder={t("app.forms.expenses.fields.name.placeholder")}
          />
          <InputField
            formReturn={form}
            label={t("app.forms.expenses.fields.amount.label")}
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder={t("app.forms.expenses.fields.amount.placeholder")}
          />
        </div>
        <TextareaField
          formReturn={form}
          label={t("app.forms.expenses.fields.description.label")}
          name="description"
          placeholder={t("app.forms.expenses.fields.description.placeholder")}
          rows={4}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                formReturn={form}
                label={t("app.forms.expenses.fields.category.label")}
                name="expenseCategoryId"
                placeholder={t("app.forms.expenses.fields.category.placeholder")}
                items={expenseCategoryItems}
              />
            </div>
            <CreateExpenseCategorySheet
              onCreated={(category) => {
                form.setValue("expenseCategoryId", category.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                formReturn={form}
                label={t("app.forms.expenses.fields.wallet.label")}
                name="walletId"
                placeholder={t("app.forms.expenses.fields.wallet.placeholder")}
                items={walletItems}
              />
            </div>
            <CreateWalletSheet
              onCreated={(wallet) => {
                form.setValue("walletId", wallet.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.forms.expenses.fields.fees.label")}
            name="fees"
            type="number"
            min="0"
            step="0.01"
            placeholder={t("app.forms.expenses.fields.fees.placeholder")}
          />
          <DateField
            formReturn={form}
            label={t("app.forms.expenses.fields.date.label")}
            name="date"
            placeholder={t("app.forms.expenses.fields.date.placeholder")}
            maxDate={getTodayDate()}
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <SelectField
              formReturn={form}
              label={t("app.forms.expenses.fields.contact.label")}
              name="toContactId"
              placeholder={t("app.forms.expenses.fields.contact.placeholder")}
              items={contactItems}
            />
          </div>
          <CreateContactSheet
            onCreated={(contact) => {
              form.setValue("toContactId", contact.id, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
          />
        </div>
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            form="expense-form"
          >
            {isUpdate
              ? t("app.forms.expenses.actions.update")
              : t("app.forms.expenses.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" asChild variant="link">
            <Link href={currentLocaleUrl("/app/transactions?tab=expenses")}>
              {t("app.forms.common.cancel")}
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
