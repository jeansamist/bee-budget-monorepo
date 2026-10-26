"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChartColumn,
  LayoutDashboard,
  Wallet,
} from "lucide-react"
import { motion } from "motion/react"
import { LogoMark } from "../logo"
import { CountUp, ease } from "../motion"
import { MOCK_TOTAL, MOCK_TRANSACTIONS, MOCK_WALLETS } from "./data"
import { BrowserFrame, TransactionRow, WalletCardMock } from "./parts"

const appear = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

/** The app's dashboard, rebuilt with sample data for the hero. */
export function DashboardMock() {
  const t = useScopedI18n("landing.mock")
  const nav = [
    { icon: LayoutDashboard, label: t("dashboard"), active: true },
    { icon: Wallet, label: t("wallets") },
    { icon: ArrowLeftRight, label: t("transactions") },
    { icon: ChartColumn, label: t("analytics") },
  ]

  return (
    <BrowserFrame>
      <div className="flex text-left">
        <aside className="hidden w-48 shrink-0 flex-col gap-1 border-r border-foreground/5 bg-sidebar p-3 md:flex">
          <div className="mb-3 flex items-center gap-2 px-2 py-1">
            <LogoMark className="size-6" />
            <span className="text-sm font-semibold">BeeBudget</span>
          </div>
          {nav.map(({ icon: Icon, label, active }) => (
            <span
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-6">
          <motion.div {...appear(0.5)} className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary p-4 text-primary-foreground sm:col-span-1">
              <p className="text-xs opacity-80">{t("totalBalance")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                <CountUp value={MOCK_TOTAL} />
                <span className="ml-1 text-xs font-normal opacity-80">XAF</span>
              </p>
            </div>
            <StatCard
              icon={ArrowDownLeft}
              label={t("incomes")}
              value={525000}
              positive
            />
            <StatCard icon={ArrowUpRight} label={t("expenses")} value={32900} />
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {MOCK_WALLETS.map((wallet, i) => (
              <motion.div
                key={wallet.key}
                {...appear(0.65 + i * 0.1)}
                className={cn(i > 0 && "hidden sm:block")}
              >
                <WalletCardMock wallet={wallet} />
              </motion.div>
            ))}
          </div>

          <motion.div
            {...appear(1)}
            className="hidden space-y-3 rounded-2xl border border-foreground/5 p-4 sm:block"
          >
            <p className="text-sm font-semibold">{t("recentActivity")}</p>
            {MOCK_TRANSACTIONS.slice(0, 3).map((transaction) => (
              <TransactionRow key={transaction.key} transaction={transaction} />
            ))}
          </motion.div>
        </div>
      </div>
    </BrowserFrame>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  positive = false,
}: {
  icon: typeof ArrowDownLeft
  label: string
  value: number
  positive?: boolean
}) {
  const t = useScopedI18n("landing.mock")
  return (
    <div className="hidden rounded-2xl bg-accent p-4 sm:block">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon
          className={cn(
            "size-3.5",
            positive ? "text-green-500" : "text-primary"
          )}
        />
        {label} · {t("thisMonth")}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums">
        <CountUp value={value} />
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          XAF
        </span>
      </p>
    </div>
  )
}
