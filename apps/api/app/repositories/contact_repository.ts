import { ContactSchema } from '#database/schema'
import Contact from '#models/contact'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class ContactRepository {
  private model = Contact

  get getModel(): typeof Contact {
    return this.model
  }

  async create(data: ModelProps<ContactSchema>, trx?: TransactionClientContract): Promise<Contact> {
    const contact = new this.model()
    if (trx) {
      contact.useTransaction(trx)
    }
    contact.fill(data)
    await contact.save()
    return contact
  }

  async createMany(
    data: ModelProps<ContactSchema>[],
    trx?: TransactionClientContract
  ): Promise<Contact[]> {
    const contacts: Contact[] = []
    for (const item of data) {
      contacts.push(await this.create(item, trx))
    }
    return contacts
  }

  async update(
    contact: Contact,
    data: Partial<ModelProps<ContactSchema>>,
    trx?: TransactionClientContract
  ): Promise<Contact> {
    if (trx) {
      contact.useTransaction(trx)
    }
    return contact.merge(data).save()
  }

  async delete(contact: Contact, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      contact.useTransaction(trx)
    }
    await contact.delete()
  }

  async findById(id: number): Promise<Contact> {
    return this.model.findOrFail(id)
  }

  async findAllByUserId(userId: number): Promise<Contact[]> {
    return this.model.query().where('user_id', userId)
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model.query().where('user_id', userId).paginate(page, perPage)
  }
}
