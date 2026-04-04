import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'demo@beebudget.app' },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@beebudget.app',
        password: 'demo1234',
        emailVerified: true,
      }
    )
  }
}
