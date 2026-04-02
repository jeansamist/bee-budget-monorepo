import { type IncomeCategorySchema } from '#database/schema'
import IncomeCategory from '#models/income_category'
import { type ModelProps } from '#utils/generics'
export default class IncomeCategoryRepository {
  private model = IncomeCategory
  get getModel(): typeof IncomeCategory {
    return this.model
  }
  async create(data: ModelProps<IncomeCategorySchema>): Promise<IncomeCategory> {
    return this.model.create(data)
  }
  async update(
    incomeCategory: IncomeCategory,
    data: Partial<ModelProps<IncomeCategorySchema>>
  ): Promise<IncomeCategory> {
    return incomeCategory.merge(data).save()
  }
  async delete(incomeCategory: IncomeCategory): Promise<void> {
    await incomeCategory.delete()
  }
  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }
  async findById(id: number): Promise<IncomeCategory> {
    return this.model.findOrFail(id)
  }
  async createMany(data: ModelProps<IncomeCategorySchema>[]): Promise<IncomeCategory[]> {
    return this.model.createMany(data)
  }
  async findAllByUserId(userId: number): Promise<IncomeCategory[]> {
    return this.model.query().where('user_id', userId)
  }
}
