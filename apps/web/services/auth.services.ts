"use server"

import { tuyau } from "@/lib/api"
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyEmailSchema,
} from "@/schemas/auth.schemas"

export const signUp = async (payload: SignUpSchema) => {
  return tuyau.api.auth.signUp({
    body: payload,
  })
}

export const signIn = async (payload: SignInSchema) => {
  return tuyau.api.auth.signIn({
    body: payload,
  })
}

export const verifyEmail = async (payload: VerifyEmailSchema) => {
  return tuyau.api.auth.verifyEmail({
    body: payload,
  })
}

export const forgotPassword = async (payload: ForgotPasswordSchema) => {
  return tuyau.api.auth.forgotPassword({
    body: payload,
  })
}

export const resetPassword = async (payload: ResetPasswordSchema) => {
  return tuyau.api.auth.resetPassword({
    body: payload,
  })
}
