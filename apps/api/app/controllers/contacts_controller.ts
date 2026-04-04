import { ContactService } from '#services/contact_service'
import ContactTransformer from '#transformers/contact_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createContactValidator,
  createMassContactValidator,
  deleteMassContactValidator,
  updateContactValidator,
  updateMassContactValidator,
} from '#validators/contact'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ContactsController {
  constructor(protected readonly contactService: ContactService) {}

  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.contactService.getPaginatedUserContacts(page, perPage)
    const serialized = await serialize(ContactTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(serialized.data, 'Contacts retrieved successfully', paginator.getMeta())
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createContactValidator)
    const contact = await this.contactService.createContact(payload)
    const serialized = await serialize(ContactTransformer.transform(contact))
    return response.ok(ApiResponse.success(serialized.data, 'Contact created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassContactValidator)
    const contacts = await this.contactService.createMassContacts(payload.items)
    const serialized = await serialize(ContactTransformer.transform(contacts))
    return response.ok(ApiResponse.success(serialized.data, 'Contacts created successfully'))
  }

  async show({ params, serialize, response }: HttpContext) {
    const contact = await this.contactService.getContactById(params.id)
    const serialized = await serialize(ContactTransformer.transform(contact))
    return response.ok(ApiResponse.success(serialized.data, 'Contact retrieved successfully'))
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateContactValidator)
    const contact = await this.contactService.updateContact(params.id, payload)
    const serialized = await serialize(ContactTransformer.transform(contact))
    return response.ok(ApiResponse.success(serialized.data, 'Contact updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassContactValidator)
    const contacts = await this.contactService.updateMassContacts(payload.items)
    const serialized = await serialize(ContactTransformer.transform(contacts))
    return response.ok(ApiResponse.success(serialized.data, 'Contacts updated successfully'))
  }

  async destroy({ params, response }: HttpContext) {
    await this.contactService.deleteContact(params.id)
    return response.ok(ApiResponse.success(null, 'Contact deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassContactValidator)
    await this.contactService.deleteMassContacts(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Contacts deleted successfully')
    )
  }
}
