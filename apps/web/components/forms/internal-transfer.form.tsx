"use client"

import { useApp } from "@/contexts/app.context"
import { CreateWalletSheet } from "@/components/forms/inline-entity-create"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import {
  createInternalTransferSchema,
  type CreateInternalTransferSchema,
  type CreateInternalTransferSchemaInput,
} from "@/schemas/internal-transfers.schemas"
import {
  createInternalTransfer,
  updateInternalTransfer,
} from "@/services/internal-transfers.services"
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

export type InternalTransferFormProps = {
  defaultValues?: Partial<CreateInternalTransferSchemaInput>
  resourceId?: number
}

const getTodayDate = () => new Date()

export const InternalTransferForm: FunctionComponent<InternalTransferFormProps> = ({
  defaultValues,
  resourceId,
}) => {
  const form = useForm<
    CreateInternalTransferSchemaInput,
    unknown,
    CreateInternalTransferSchema
  >({
    resolver: zodResolver(createInternalTransferSchema),
    mode: "onChange",
    defaultValues: {
      amount: undefined,
      fee: null,
      sourceWalletId: undefined,
      targetWalletId: undefined,
      date: getTodayDate(),
      description: null,
      ...defaultValues,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const router = useRouter()
  const { wallets } = useApp()
  const walletItems = useMemo(
    () =>
      wallets.map((wallet) => ({
        value: wallet.id.toString(),
        label: wallet.name,
      })),
    [wallets]
  )
  const isUpdate = typeof resourceId === "number"

  async function onSubmit(data: CreateInternalTransferSchema) {
    const result =
      typeof resourceId === "number"
        ? await updateInternalTransfer(resourceId, data)
        : await createInternalTransfer(data)

    if (!result.success) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    setErrorMessage(undefined)
    router.push(currentLocaleUrl("/app/transactions?tab=internal-transfers"))
  }

  return (
    <form
      id="internal-transfer-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.forms.internalTransfers.fields.amount.label")}
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder={t("app.forms.internalTransfers.fields.amount.placeholder")}
          />
          <InputField
            formReturn={form}
            label={t("app.forms.internalTransfers.fields.fee.label")}
            name="fee"
            type="number"
            min="0"
            step="0.01"
            placeholder={t("app.forms.internalTransfers.fields.fee.placeholder")}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                formReturn={form}
                label={t("app.forms.internalTransfers.fields.sourceWallet.label")}
                name="sourceWalletId"
                placeholder={t("app.forms.internalTransfers.fields.sourceWallet.placeholder")}
                items={walletItems}
              />
            </div>
            <CreateWalletSheet
              onCreated={(wallet) => {
                form.setValue("sourceWalletId", wallet.id, {
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
                label={t("app.forms.internalTransfers.fields.targetWallet.label")}
                name="targetWalletId"
                placeholder={t("app.forms.internalTransfers.fields.targetWallet.placeholder")}
                items={walletItems}
              />
            </div>
            <CreateWalletSheet
              onCreated={(wallet) => {
                form.setValue("targetWalletId", wallet.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
            />
          </div>
        </div>
        <DateField
          formReturn={form}
          label={t("app.forms.internalTransfers.fields.date.label")}
          name="date"
          placeholder={t("app.forms.internalTransfers.fields.date.placeholder")}
          maxDate={getTodayDate()}
        />
        <TextareaField
          formReturn={form}
          label={t("app.forms.internalTransfers.fields.description.label")}
          name="description"
          placeholder={t("app.forms.internalTransfers.fields.description.placeholder")}
          rows={4}
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            form="internal-transfer-form"
          >
            {isUpdate
              ? t("app.forms.internalTransfers.actions.update")
              : t("app.forms.internalTransfers.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" asChild variant="link">
            <Link href={currentLocaleUrl("/app/transactions?tab=internal-transfers")}>
              {t("app.forms.common.cancel")}
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
