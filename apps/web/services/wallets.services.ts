"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateWalletSchema,
  UpdateWalletSchema,
  UpdateMassWalletSchema,
} from "@/schemas/wallets.schemas"
import type {
  ApiResponse,
  Wallet,
  MassDeleteResult,
} from "@/types"

export const getWallets = async (): Promise<ApiResponse<Wallet[]>> => {
  const [data, error] = await tuyau.api.wallets.index({}).safe()
  return (error ? error.response : data) as ApiResponse<Wallet[]>
}

export const getWallet = async (id: number): Promise<ApiResponse<Wallet>> => {
  const [data, error] = await tuyau.api.wallets.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<Wallet>
}

export const createWallet = async (
  payload: CreateWalletSchema
): Promise<ApiResponse<Wallet>> => {
  const [data, error] = await tuyau.api.wallets.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<Wallet>
}

export const createMassWallets = async (
  items: CreateWalletSchema[]
): Promise<ApiResponse<Wallet[]>> => {
  const [data, error] = await tuyau.api.wallets.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Wallet[]>
}

export const updateWallet = async (
  id: number,
  payload: UpdateWalletSchema
): Promise<ApiResponse<Wallet>> => {
  const [data, error] = await tuyau.api.wallets.update({
    params: { id },
    body: payload,
  }).safe()
  return (error ? error.response : data) as ApiResponse<Wallet>
}

export const updateMassWallets = async (
  items: UpdateMassWalletSchema[]
): Promise<ApiResponse<Wallet[]>> => {
  const [data, error] = await tuyau.api.wallets.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Wallet[]>
}

export const deleteWallet = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.wallets.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassWallets = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.wallets.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
