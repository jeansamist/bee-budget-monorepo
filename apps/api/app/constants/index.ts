export const ACCOUNT_SETUP_WALLET_TYPES = [
  {
    name: 'ELECTRONIC',
    color: '#2563EB',
    icon: 'smartphone',
  },
  {
    name: 'MOBILE_MONEY',
    color: '#F97316',
    icon: 'wallet',
  },
  {
    name: 'CASH',
    color: '#16A34A',
    icon: 'banknote',
  },
  {
    name: 'BANK_ACCOOUNT',
    color: '#7C3AED',
    icon: 'landmark',
  },
  {
    name: 'OTHER',
    color: '#64748B',
    icon: 'shapes',
  },
] as const

export const ACCOUNT_SETUP_INCOME_CATEGORIES = [
  {
    name: 'SALARY',
    color: '#10B981',
    icon: 'briefcase',
    defaultWalletTypeName: null,
    isSystem: false,
  },
  {
    name: 'GIFT',
    color: '#EC4899',
    icon: 'gift',
    defaultWalletTypeName: null,
    isSystem: false,
  },
  {
    name: 'FREELANCE_PAYMENT',
    color: '#3B82F6',
    icon: 'laptop',
    defaultWalletTypeName: 'MOBILE_MONEY',
    isSystem: false,
  },
  {
    name: 'OTHER',
    color: '#6B7280',
    icon: 'circle-help',
    defaultWalletTypeName: 'MOBILE_MONEY',
    isSystem: false,
  },
  {
    name: 'INTERNAL_TRANSFER_IN',
    color: '#0EA5E9',
    icon: 'arrow-down-left',
    defaultWalletTypeName: null,
    isSystem: true,
  },
] as const

export const ACCOUNT_SETUP_EXPENSE_CATEGORIES = [
  {
    name: 'GROCERIES',
    color: '#22C55E',
    icon: 'shopping-cart',
    defaultWalletTypeName: 'CASH',
    isSystem: false,
  },
  {
    name: 'TRANSPORT',
    color: '#F59E0B',
    icon: 'bus',
    defaultWalletTypeName: 'MOBILE_MONEY',
    isSystem: false,
  },
  {
    name: 'UTILITIES',
    color: '#06B6D4',
    icon: 'zap',
    defaultWalletTypeName: 'MOBILE_MONEY',
    isSystem: false,
  },
  {
    name: 'OTHER',
    color: '#6B7280',
    icon: 'circle-help',
    defaultWalletTypeName: null,
    isSystem: false,
  },
  {
    name: 'INTERNAL_TRANSFER_OUT',
    color: '#F97316',
    icon: 'arrow-up-right',
    defaultWalletTypeName: null,
    isSystem: true,
  },
] as const

export const ACCOUNT_SETUP_WALLETS = [
  {
    name: 'ORANGE_MONEY',
    description:
      'Default mobile money wallet for Orange Money transfers, subscriptions, and day-to-day digital cash-ins.',
    walletTypeName: 'MOBILE_MONEY',
    image: null,
    amount: 0,
  },
  {
    name: 'MTN_MOMO',
    description:
      'Default mobile money wallet for MTN MoMo collections and quick person-to-person payments.',
    walletTypeName: 'MOBILE_MONEY',
    image: null,
    amount: 0,
  },
  {
    name: 'PHYSICAL',
    description:
      'Cash wallet for physical notes and coins you keep on hand for everyday spending and deposits.',
    walletTypeName: 'CASH',
    image: null,
    amount: 0,
  },
] as const
