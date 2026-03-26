"use client"

import { signUpSchema, SignUpSchema } from "@/schemas/auth.schemas"
import { FieldGroup } from "@bee-budget/ui/field"
import { InputField } from "@bee-budget/ui/fields"
import { zodResolver } from "@hookform/resolvers/zod"
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
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <InputField
          formReturn={form}
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
        />
      </FieldGroup>
    </form>
  )
}
