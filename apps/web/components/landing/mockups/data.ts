// Sample data for the landing page mockups (docs/landing-copy.md). Not real users.

export type MockWallet = {
  key: "orange" | "mtn" | "cash"
  name: string
  type: "mobileMoney" | "cash"
  color: string
  balance: number
  evolution: number
  trend: number[]
}

export const MOCK_WALLETS: MockWallet[] = [
  {
    key: "orange",
    name: "Orange Money",
    type: "mobileMoney",
    color: "#ff7900",
    balance: 182500,
    evolution: 12,
    trend: [92, 110, 104, 128, 140, 136, 162, 182],
  },
  {
    key: "mtn",
    name: "MTN MoMo",
    type: "mobileMoney",
    color: "#ffcb05",
    balance: 96300,
    evolution: 4,
    trend: [70, 76, 72, 88, 84, 90, 93, 96],
  },
  {
    key: "cash",
    name: "Cash",
    type: "cash",
    color: "#22c55e",
    balance: 24000,
    evolution: -8,
    trend: [38, 34, 36, 31, 30, 28, 26, 24],
  },
]

export const MOCK_TOTAL = MOCK_WALLETS.reduce((sum, w) => sum + w.balance, 0)

export type MockTransaction = {
  key: "salary" | "freelance" | "groceries" | "electricity" | "transport"
  icon: "briefcase" | "laptop" | "basket" | "zap" | "bus"
  wallet: string
  amount: number
  date: string
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    key: "salary",
    icon: "briefcase",
    wallet: "Orange Money",
    amount: 450000,
    date: "Oct 25",
  },
  {
    key: "groceries",
    icon: "basket",
    wallet: "Cash",
    amount: -12500,
    date: "Oct 24",
  },
  {
    key: "freelance",
    icon: "laptop",
    wallet: "MTN MoMo",
    amount: 75000,
    date: "Oct 22",
  },
  {
    key: "electricity",
    icon: "zap",
    wallet: "Orange Money",
    amount: -18400,
    date: "Oct 21",
  },
  {
    key: "transport",
    icon: "bus",
    wallet: "Cash",
    amount: -2000,
    date: "Oct 21",
  },
]

export const MOCK_CONTACTS = [
  { name: "Marie Dubois", initials: "MD", color: "#e91e63", total: 85000 },
  { name: "Thomas Martin", initials: "TM", color: "#2196f3", total: 42500 },
  { name: "Sophie Bernard", initials: "SB", color: "#4caf50", total: 30000 },
  { name: "Boulangerie Akwa", initials: "BA", color: "#ff9800", total: 18700 },
]

export type AnalyticsPeriod = "week" | "month" | "year"

/** Incomes and expenses per bucket, in thousands of XAF. */
export const MOCK_ANALYTICS: Record<
  AnalyticsPeriod,
  { label: string; income: number; expense: number }[]
> = {
  week: [
    { label: "Mon", income: 0, expense: 6 },
    { label: "Tue", income: 25, expense: 9 },
    { label: "Wed", income: 0, expense: 4 },
    { label: "Thu", income: 0, expense: 18 },
    { label: "Fri", income: 75, expense: 12 },
    { label: "Sat", income: 0, expense: 22 },
    { label: "Sun", income: 10, expense: 7 },
  ],
  month: [
    { label: "W1", income: 450, expense: 96 },
    { label: "W2", income: 40, expense: 120 },
    { label: "W3", income: 75, expense: 88 },
    { label: "W4", income: 30, expense: 134 },
  ],
  year: [
    { label: "J", income: 480, expense: 390 },
    { label: "F", income: 455, expense: 410 },
    { label: "M", income: 520, expense: 380 },
    { label: "A", income: 470, expense: 430 },
    { label: "M", income: 610, expense: 450 },
    { label: "J", income: 500, expense: 470 },
    { label: "J", income: 530, expense: 400 },
    { label: "A", income: 495, expense: 520 },
    { label: "S", income: 560, expense: 440 },
    { label: "O", income: 595, expense: 438 },
    { label: "N", income: 0, expense: 0 },
    { label: "D", income: 0, expense: 0 },
  ],
}

export const MOCK_TRANSFER = {
  from: "MTN MoMo",
  to: "Cash",
  amount: 50000,
  fee: 500,
}
