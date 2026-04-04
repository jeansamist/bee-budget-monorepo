import Contact from '#models/contact'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ContactSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await Contact.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    await Contact.createMany([
      // Persons
      {
        name: 'Marie Dubois',
        color: '#E91E63',
        type: 'person',
        email: 'marie.dubois@example.com',
        phoneNumber: '0612345678',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'Thomas Martin',
        color: '#2196F3',
        type: 'person',
        email: 'thomas.martin@example.com',
        phoneNumber: '0623456789',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'Sophie Bernard',
        color: '#4CAF50',
        type: 'person',
        email: 'sophie.bernard@example.com',
        phoneNumber: null,
        comments: 'Associée',
        image: null,
        userId: user.id,
      },
      {
        name: 'Lucas Petit',
        color: '#FF9800',
        type: 'person',
        email: null,
        phoneNumber: '0634567890',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'Emma Leroy',
        color: '#9C27B0',
        type: 'person',
        email: 'emma.leroy@example.com',
        phoneNumber: '0645678901',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'Alexandre Morel',
        color: '#00BCD4',
        type: 'person',
        email: 'a.morel@example.com',
        phoneNumber: null,
        comments: 'Client régulier',
        image: null,
        userId: user.id,
      },
      {
        name: 'Julie Simon',
        color: '#F44336',
        type: 'person',
        email: 'julie.simon@example.com',
        phoneNumber: '0656789012',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'Nicolas Robert',
        color: '#795548',
        type: 'person',
        email: null,
        phoneNumber: '0667890123',
        comments: 'Locataire',
        image: null,
        userId: user.id,
      },
      // Entreprises
      {
        name: 'TechCorp SARL',
        color: '#607D8B',
        type: 'entreprise',
        email: 'contact@techcorp.fr',
        phoneNumber: '0142345678',
        comments: 'Client principal',
        image: null,
        userId: user.id,
      },
      {
        name: 'ConsultPro',
        color: '#3F51B5',
        type: 'entreprise',
        email: 'info@consultpro.fr',
        phoneNumber: '0153456789',
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'MediaGroup SA',
        color: '#009688',
        type: 'entreprise',
        email: 'hello@mediagroup.fr',
        phoneNumber: null,
        comments: null,
        image: null,
        userId: user.id,
      },
      {
        name: 'StartupHub',
        color: '#FF5722',
        type: 'entreprise',
        email: 'team@startuphub.io',
        phoneNumber: '0164567890',
        comments: 'Partenaire',
        image: null,
        userId: user.id,
      },
      {
        name: 'InnovateTech',
        color: '#8BC34A',
        type: 'entreprise',
        email: 'contact@innovatetech.fr',
        phoneNumber: '0175678901',
        comments: null,
        image: null,
        userId: user.id,
      },
      // Others
      {
        name: 'Association Sportive',
        color: '#FFC107',
        type: 'other',
        email: 'asso@sport.fr',
        phoneNumber: null,
        comments: 'Remboursement adhésion',
        image: null,
        userId: user.id,
      },
      {
        name: 'Club Investisseurs',
        color: '#673AB7',
        type: 'other',
        email: null,
        phoneNumber: '0186789012',
        comments: 'Dividendes trimestriels',
        image: null,
        userId: user.id,
      },
    ])
  }
}
