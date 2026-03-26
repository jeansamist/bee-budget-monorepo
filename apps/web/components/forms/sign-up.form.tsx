"use client"

import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import { signUpSchema, SignUpSchema } from "@/schemas/auth.schemas"
import { Button } from "@bee-budget/ui/button"
import { Field, FieldGroup } from "@bee-budget/ui/field"
import { InputField } from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { FunctionComponent } from "react"
import { useForm } from "react-hook-form"
export type SignUpFormProps = {
  [key: string]: unknown
}

export const SignUpForm: FunctionComponent<SignUpFormProps> = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  })
  function onSubmit(data: SignUpSchema) {
    console.log(data)
  }
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  return (
    <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <InputField
          formReturn={form}
          label={t("auth.signUp.firstName.label")}
          name="firstName"
          placeholder={t("auth.signUp.firstName.placeholder")}
        />
        <InputField
          formReturn={form}
          label={t("auth.signUp.lastName.label")}
          name="lastName"
          placeholder={t("auth.signUp.lastName.placeholder")}
        />
        <InputField
          formReturn={form}
          label={t("auth.signUp.email.label")}
          name="email"
          type="email"
          placeholder={t("auth.signUp.email.placeholder")}
        />
        <InputField
          formReturn={form}
          label={t("auth.signUp.password.label")}
          name="password"
          type="password"
          placeholder={t("auth.signUp.password.placeholder")}
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            form="sign-up-form"
          >
            {t("auth.signUp.submit")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" asChild variant="link">
            <Link href={currentLocaleUrl("/auth/sign-in")}>
              {t("auth.signUp.signIn.link")}
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
