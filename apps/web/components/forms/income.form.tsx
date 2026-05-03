"use client"

import { useApp } from "@/contexts/app.context"
import {
  CreateContactSheet,
  CreateIncomeCategorySheet,
  CreateWalletSheet,
} from "@/components/forms/inline-entity-create"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import {
  createIncomeSchema,
  type CreateIncomeSchema,
  type CreateIncomeSchemaInput,
} from "@/schemas/incomes.schemas"
import { createIncome, updateIncome } from "@/services/incomes.services"
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

export type IncomeFormProps = {
  defaultValues?: Partial<CreateIncomeSchemaInput>
  resourceId?: number
}

const getTodayDate = () => new Date()

export const IncomeForm: FunctionComponent<IncomeFormProps> = ({
  defaultValues,
  resourceId,
}) => {
  const form = useForm<CreateIncomeSchemaInput, unknown, CreateIncomeSchema>({
    resolver: zodResolver(createIncomeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      amount: undefined,
      incomeCategoryId: undefined,
      walletId: undefined,
      date: getTodayDate(),
      fromContactId: null,
      ...defaultValues,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const router = useRouter()
  const { incomeCategories, wallets, contacts } = useApp()
  const incomeCategoryItems = useMemo(
    () =>
      incomeCategories
        .filter((category) => !category.isSystem)
        .map((category) => ({
          value: category.id.toString(),
          label: category.name,
        })),
    [incomeCategories]
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

  async function onSubmit(data: CreateIncomeSchema) {
    const result =
      typeof resourceId === "number"
        ? await updateIncome(resourceId, data)
        : await createIncome(data)

    if (!result.success) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    setErrorMessage(undefined)
    router.push(currentLocaleUrl("/app/transactions?tab=incomes"))
  }

  return (
    <form id="income-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.forms.incomes.fields.name.label")}
            name="name"
            placeholder={t("app.forms.incomes.fields.name.placeholder")}
          />
          <InputField
            formReturn={form}
            label={t("app.forms.incomes.fields.amount.label")}
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder={t("app.forms.incomes.fields.amount.placeholder")}
          />
        </div>
        <TextareaField
          formReturn={form}
          label={t("app.forms.incomes.fields.description.label")}
          name="description"
          placeholder={t("app.forms.incomes.fields.description.placeholder")}
          rows={4}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                formReturn={form}
                label={t("app.forms.incomes.fields.category.label")}
                name="incomeCategoryId"
                placeholder={t("app.forms.incomes.fields.category.placeholder")}
                items={incomeCategoryItems}
              />
            </div>
            <CreateIncomeCategorySheet
              onCreated={(category) => {
                form.setValue("incomeCategoryId", category.id, {
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
                label={t("app.forms.incomes.fields.wallet.label")}
                name="walletId"
                placeholder={t("app.forms.incomes.fields.wallet.placeholder")}
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
          <DateField
            formReturn={form}
            label={t("app.forms.incomes.fields.date.label")}
            name="date"
            placeholder={t("app.forms.incomes.fields.date.placeholder")}
            maxDate={getTodayDate()}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                formReturn={form}
                label={t("app.forms.incomes.fields.contact.label")}
                name="fromContactId"
                placeholder={t("app.forms.incomes.fields.contact.placeholder")}
                items={contactItems}
              />
            </div>
            <CreateContactSheet
              onCreated={(contact) => {
                form.setValue("fromContactId", contact.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
            />
          </div>
        </div>
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            form="income-form"
          >
            {isUpdate
              ? t("app.forms.incomes.actions.update")
              : t("app.forms.incomes.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" asChild variant="link">
            <Link href={currentLocaleUrl("/app/transactions?tab=incomes")}>
              {t("app.forms.common.cancel")}
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
