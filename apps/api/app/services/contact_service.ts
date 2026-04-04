import { ContactSchema } from '#database/schema'
import ContactRepository from '#repositories/contact_repository'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type CreateContactPayload = {
  name: string
  image?: string | null
  color: string
  type: 'person' | 'entreprise' | 'other'
  phoneNumber?: string | null
  email?: string | null
  comments?: string | null
}

type UpdateContactPayload = Partial<CreateContactPayload>
type MassUpdateContactPayload = UpdateContactPayload & { id: number }

@inject()
export class ContactService {
  constructor(
    private readonly repository: ContactRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(contact: ContactSchema) {
    if (contact.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this contact')
    }
  }

  async createContact(data: CreateContactPayload) {
    return this.repository.create({
      ...data,
      image: data.image ?? null,
      phoneNumber: data.phoneNumber ?? null,
      email: data.email ?? null,
      comments: data.comments ?? null,
      userId: this.userId,
    })
  }

  async updateContact(id: number, data: UpdateContactPayload) {
    const contact = await this.repository.findById(id)
    this.checkOwnership(contact)
    return this.repository.update(contact, data)
  }

  async deleteContact(id: number) {
    const contact = await this.repository.findById(id)
    this.checkOwnership(contact)
    return this.repository.delete(contact)
  }

  async getContactById(id: number) {
    const contact = await this.repository.findById(id)
    this.checkOwnership(contact)
    return contact
  }

  async getAllUserContacts() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserContacts(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassContacts(items: CreateContactPayload[]) {
    const contacts = []
    for (const item of items) {
      contacts.push(await this.createContact(item))
    }
    return contacts
  }

  async updateMassContacts(items: MassUpdateContactPayload[]) {
    const contacts = []
    for (const item of items) {
      const { id, ...data } = item
      contacts.push(await this.updateContact(id, data))
    }
    return contacts
  }

  async deleteMassContacts(ids: number[]) {
    for (const id of ids) {
      await this.deleteContact(id)
    }
  }
}
