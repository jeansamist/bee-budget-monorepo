"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateContactSchema,
  UpdateContactSchema,
  UpdateMassContactSchema,
} from "@/schemas/contacts.schemas"
import type {
  ApiResponse,
  Contact,
  MassDeleteResult,
} from "@/types"

export const getContacts = async (page = 1, perPage = 15): Promise<ApiResponse<Contact[]>> => {
  const [data, error] = await tuyau.api.contacts.index({ query: { page, perPage } }).safe()
  return (error ? error.response : data) as ApiResponse<Contact[]>
}

export const getContact = async (id: number): Promise<ApiResponse<Contact>> => {
  const [data, error] = await tuyau.api.contacts.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<Contact>
}

export const createContact = async (
  payload: CreateContactSchema
): Promise<ApiResponse<Contact>> => {
  const [data, error] = await tuyau.api.contacts.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<Contact>
}

export const createMassContacts = async (
  items: CreateContactSchema[]
): Promise<ApiResponse<Contact[]>> => {
  const [data, error] = await tuyau.api.contacts.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Contact[]>
}

export const updateContact = async (
  id: number,
  payload: UpdateContactSchema
): Promise<ApiResponse<Contact>> => {
  const [data, error] = await tuyau.api.contacts.update({
    params: { id },
    body: payload,
  }).safe()
  return (error ? error.response : data) as ApiResponse<Contact>
}

export const updateMassContacts = async (
  items: UpdateMassContactSchema[]
): Promise<ApiResponse<Contact[]>> => {
  const [data, error] = await tuyau.api.contacts.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<Contact[]>
}

export const deleteContact = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.contacts.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassContacts = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.contacts.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
