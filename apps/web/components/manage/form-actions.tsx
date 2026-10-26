"use client"

import { useI18n } from "@/lib/i18n/client"
import { Button } from "@bee-budget/ui/button"
import { Field } from "@bee-budget/ui/field"
import { LoaderCircle } from "lucide-react"

export function FormActions({
  isEditing,
  disabled,
  submitting,
  onCancel,
}: {
  isEditing: boolean
  disabled: boolean
  submitting: boolean
  onCancel: () => void
}) {
  const t = useI18n()
  return (
    <Field orientation="horizontal">
      <Button type="submit" disabled={disabled || submitting}>
        {isEditing
          ? t("app.manage.actions.save")
          : t("app.manage.actions.create")}
        {submitting && <LoaderCircle className="animate-spin" />}
      </Button>
      <Button type="button" variant="link" onClick={onCancel}>
        {t("app.forms.common.cancel")}
      </Button>
    </Field>
  )
}
