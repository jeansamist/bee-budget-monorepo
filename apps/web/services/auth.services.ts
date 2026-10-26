"use server"
import { tuyau } from "@/lib/api"
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyEmailSchema,
} from "@/schemas/auth.schemas"
import type { ApiResponse, AuthAccessTokenPayload, User } from "@/types"
import { cookies } from "next/headers"

// The API returns an access token when email verification is disabled
export const signUp = async (
  payload: SignUpSchema
): Promise<ApiResponse<AuthAccessTokenPayload | null>> => {
  const [data, error] = await tuyau.api.auth.signUp({ body: payload }).safe()

  const accessToken = (data?.data as AuthAccessTokenPayload | null)
    ?.accessToken as { token?: string; expiresAt?: string } | undefined
  if (data?.success && accessToken?.token) {
    const cookiesStore = await cookies()
    cookiesStore.set("AUTH_TOKEN", accessToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(accessToken.expiresAt!),
    })
  }

  return (error ? error.response : data) as ApiResponse<AuthAccessTokenPayload | null>
}

export const signIn = async (
  payload: SignInSchema
): Promise<ApiResponse<AuthAccessTokenPayload>> => {
  const [data, error] = await tuyau.api.auth.signIn({ body: payload }).safe()

  if (data?.success && data.data) {
    const cookiesStore = await cookies()
    cookiesStore.set("AUTH_TOKEN", data.data.accessToken.token!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(data.data.accessToken.expiresAt!),
    })
  }

  return (error ? error.response : data) as ApiResponse<AuthAccessTokenPayload>
}

export const verifyEmail = async (
  payload: VerifyEmailSchema
): Promise<ApiResponse<AuthAccessTokenPayload>> => {
  const [data, error] = await tuyau.api.auth
    .verifyEmail({ body: payload })
    .safe()

  if (data?.success && data.data) {
    const cookiesStore = await cookies()
    cookiesStore.set("AUTH_TOKEN", data.data.accessToken.token!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(data.data.accessToken.expiresAt!),
    })
  }

  return (error ? error.response : data) as ApiResponse<AuthAccessTokenPayload>
}

export const forgotPassword = async (
  payload: ForgotPasswordSchema
): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.auth
    .forgotPassword({ body: payload })
    .safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const resetPassword = async (
  payload: ResetPasswordSchema
): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.auth
    .resetPassword({ body: payload })
    .safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const getProfile = async (): Promise<User | null> => {
  const [data, error] = await tuyau.api.auth.profile({}).safe()
  if (error || !data?.success) return null
  return (data.data as User) ?? null
}
