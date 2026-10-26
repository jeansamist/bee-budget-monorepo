"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import {
  createWalletSchema,
  type CreateWalletSchema,
  type CreateWalletSchemaInput,
} from "@/schemas/wallets.schemas"
import { createWallet, updateWallet } from "@/services/wallets.services"
import type { Wallet } from "@/types"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { FieldGroup } from "@bee-budget/ui/field"
import { InputField, SelectField, TextareaField } from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormActions } from "./form-actions"

/** Creates a wallet, or edits `wallet` when given. */
export function WalletForm({
  wallet,
  onDone,
}: {
  wallet?: Wallet
  onDone: () => void
}) {
  const t = useI18n()
  const { walletTypes, addWallet } = useApp()
  const isEditing = Boolean(wallet)
  const form = useForm<CreateWalletSchemaInput, unknown, CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
    mode: "onChange",
    defaultValues: {
      name: wallet?.name ?? "",
      description: wallet?.description ?? "",
      walletTypeId: wallet?.walletTypeId,
      amount: wallet?.amount ?? 0,
      image: wallet?.image ?? null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const walletTypeItems = useMemo(
    () =>
      walletTypes.map((walletType) => ({
        value: walletType.id.toString(),
        label: displayName(walletType.name),
      })),
    [walletTypes]
  )

  async function onSubmit(data: CreateWalletSchema) {
    const result = wallet
      ? await updateWallet(wallet.id, data)
      : await createWallet(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    addWallet(result.data)
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
          label={t("app.inlineCreate.wallet.fields.name.label")}
          name="name"
          placeholder={t("app.inlineCreate.wallet.fields.name.placeholder")}
        />
        <TextareaField
          formReturn={form}
          label={t("app.inlineCreate.wallet.fields.description.label")}
          name="description"
          placeholder={t(
            "app.inlineCreate.wallet.fields.description.placeholder"
          )}
          rows={3}
        />
        <SelectField
          formReturn={form}
          label={t("app.inlineCreate.wallet.fields.walletType.label")}
          name="walletTypeId"
          placeholder={t(
            "app.inlineCreate.wallet.fields.walletType.placeholder"
          )}
          items={walletTypeItems}
        />
        <InputField
          formReturn={form}
          label={
            isEditing
              ? t("app.manage.wallet.balance.label")
              : t("app.inlineCreate.wallet.fields.amount.label")
          }
          description={
            isEditing ? t("app.manage.wallet.balance.help") : undefined
          }
          name="amount"
          type="number"
          placeholder={t("app.inlineCreate.wallet.fields.amount.placeholder")}
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
