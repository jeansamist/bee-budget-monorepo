"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import { Banknote, Moon, Smartphone, Sun } from "lucide-react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { ease, formatXaf } from "../motion"
import {
  MOCK_ANALYTICS,
  MOCK_CONTACTS,
  MOCK_TRANSACTIONS,
  MOCK_TRANSFER,
  MOCK_WALLETS,
  type AnalyticsPeriod,
} from "./data"
import { TransactionRow, WalletCardMock } from "./parts"

/** Three wallet cards fanned out. */
export function WalletsMock() {
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm">
      {MOCK_WALLETS.map((wallet, i) => (
        <motion.div
          key={wallet.key}
          className="absolute inset-x-0 shadow-lg shadow-foreground/5"
          style={{ top: i * 48, zIndex: i }}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: (i - 1) * -2 }}
          whileHover={{ y: -6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: i * 0.12 }}
        >
          <WalletCardMock
            wallet={wallet}
            className="border border-foreground/5 bg-card"
          />
        </motion.div>
      ))}
    </div>
  )
}

export function TransactionsMock() {
  return (
    <div className="space-y-3 rounded-3xl bg-card p-4 shadow-lg shadow-foreground/5">
      {MOCK_TRANSACTIONS.map((transaction, i) => (
        <motion.div
          key={transaction.key}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: i * 0.08 }}
        >
          <TransactionRow transaction={transaction} />
        </motion.div>
      ))}
    </div>
  )
}

export function TransferMock() {
  const t = useScopedI18n("landing.mock")
  const { from, to, amount, fee } = MOCK_TRANSFER

  return (
    <div className="space-y-4 rounded-3xl bg-card p-5 shadow-lg shadow-foreground/5">
      <p className="text-sm font-semibold">{t("transfer")}</p>
      <div className="flex items-center gap-2">
        <WalletPill
          icon={Smartphone}
          label={t("from")}
          name={from}
          color="#ffcb05"
        />
        <div className="relative h-px flex-1 bg-foreground/10">
          <motion.span
            className="absolute -top-1 left-0 size-2 rounded-full bg-primary"
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
        <WalletPill icon={Banknote} label={t("to")} name={to} color="#22c55e" />
      </div>
      <dl className="space-y-2 rounded-2xl bg-accent p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("amount")}</dt>
          <dd className="font-semibold tabular-nums">
            {formatXaf(amount)} XAF
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("fee")}</dt>
          <dd className="font-semibold text-primary tabular-nums">
            {formatXaf(fee)} XAF
          </dd>
        </div>
      </dl>
      <span className="flex h-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        {t("saveTransfer")}
      </span>
    </div>
  )
}

function WalletPill({
  icon: Icon,
  label,
  name,
  color,
}: {
  icon: typeof Smartphone
  label: string
  name: string
  color: string
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-accent px-3 py-2">
      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="flex items-center gap-1.5 truncate text-sm font-medium">
        <Icon className="size-3.5 shrink-0" style={{ color }} />
        {name}
      </p>
    </div>
  )
}

const periods: AnalyticsPeriod[] = ["week", "month", "year"]

/** Income vs expense bars, with working period tabs. */
export function AnalyticsMock() {
  const t = useScopedI18n("landing.mock")
  const [period, setPeriod] = useState<AnalyticsPeriod>("year")
  const data = MOCK_ANALYTICS[period]
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]))

  return (
    <div className="space-y-5 rounded-3xl bg-card p-5 shadow-lg shadow-foreground/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500" />
            {t("incomes")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {t("expenses")}
          </span>
        </div>
        <div className="flex rounded-full bg-accent p-1 text-xs">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "relative rounded-full px-3 py-1 transition-colors",
                period === p
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {period === p && (
                <motion.span
                  layoutId="analytics-period"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ duration: 0.4, ease }}
                />
              )}
              <span className="relative">{t(p)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-40 items-end gap-1.5 sm:gap-2">
        {data.map((bucket, i) => (
          <div
            key={`${period}-${i}`}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <div className="flex h-full w-full items-end justify-center gap-0.5">
              <motion.span
                className="w-full max-w-3 rounded-t-sm bg-green-500"
                initial={{ height: 0 }}
                whileInView={{ height: `${(bucket.income / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.04 }}
              />
              <motion.span
                className="w-full max-w-3 rounded-t-sm bg-primary"
                initial={{ height: 0 }}
                whileInView={{ height: `${(bucket.expense / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.04 + 0.05 }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {bucket.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContactsMock() {
  const max = Math.max(...MOCK_CONTACTS.map((c) => c.total))

  return (
    <div className="space-y-4 rounded-3xl bg-card p-5 shadow-lg shadow-foreground/5">
      {MOCK_CONTACTS.map((contact, i) => (
        <div key={contact.name} className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: contact.color }}
          >
            {contact.initials}
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex justify-between gap-2 text-sm">
              <span className="truncate font-medium">{contact.name}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {formatXaf(contact.total)} XAF
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-accent">
              <motion.div
                className="h-full rounded-full"
                style={{ background: contact.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(contact.total / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Working light/dark switch: it changes the page theme. */
export function ThemeMock() {
  const t = useScopedI18n("landing.mock")
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-center gap-4">
      {(["light", "dark"] as const).map((theme) => {
        const Icon = theme === "light" ? Sun : Moon
        const active = resolvedTheme === theme
        return (
          <motion.button
            key={theme}
            type="button"
            onClick={() => setTheme(theme)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "w-32 rounded-2xl border p-3 text-left transition-colors",
              theme === "dark"
                ? "border-white/10 bg-stone-900 text-stone-100"
                : "border-stone-200 bg-white text-stone-900",
              active && "ring-2 ring-primary ring-offset-2 ring-offset-card"
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <Icon className="size-3.5" />
              {t(theme)}
            </span>
            <span className="mt-3 block h-2 w-3/4 rounded-full bg-current opacity-20" />
            <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-current opacity-10" />
            <span className="mt-3 block h-5 w-full rounded-lg bg-[oklch(0.553_0.195_38.402)]" />
          </motion.button>
        )
      })}
    </div>
  )
}
