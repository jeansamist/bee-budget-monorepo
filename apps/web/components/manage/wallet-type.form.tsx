"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import {
  createWalletTypeSchema,
  type CreateWalletTypeSchema,
  type CreateWalletTypeSchemaInput,
} from "@/schemas/wallet-types.schemas"
import {
  createWalletType,
  updateWalletType,
} from "@/services/wallet-types.services"
import type { WalletType } from "@/types"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { FieldGroup } from "@bee-budget/ui/field"
import { InputField } from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormActions } from "./form-actions"

export function WalletTypeForm({
  walletType,
  onDone,
}: {
  walletType?: WalletType
  onDone: () => void
}) {
  const t = useI18n()
  const { addWalletType } = useApp()
  const isEditing = Boolean(walletType)
  const form = useForm<
    CreateWalletTypeSchemaInput,
    unknown,
    CreateWalletTypeSchema
  >({
    resolver: zodResolver(createWalletTypeSchema),
    mode: "onChange",
    defaultValues: {
      name: walletType?.name ?? "",
      color: walletType?.color ?? "#f59e0b",
      icon: walletType?.icon ?? null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(data: CreateWalletTypeSchema) {
    const result = walletType
      ? await updateWalletType(walletType.id, data)
      : await createWalletType(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    addWalletType(result.data)
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
          label={t("app.inlineCreate.walletType.fields.name.label")}
          name="name"
          placeholder={t("app.inlineCreate.walletType.fields.name.placeholder")}
        />
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.walletType.fields.color.label")}
          name="color"
          type="color"
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
