import { SignUpForm } from "@/components/forms/sign-up.form"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bee-budget/ui/card"
import React from "react"
export default function page() {
  return (
    <React.Fragment>
      <CardHeader>
        <CardTitle className="">Start manage your money</CardTitle>
        <CardDescription>
          Create an account to start using BeeBudget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </React.Fragment>
  )
}
