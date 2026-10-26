"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import {
  Briefcase,
  Bus,
  Laptop,
  ShoppingBasket,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useId } from "react"
import { ease, formatXaf } from "../motion"
import type { MockTransaction, MockWallet } from "./data"

/** Area sparkline that draws itself in when it scrolls into view. */
export function Sparkline({
  points,
  positive,
  className,
}: {
  points: number[]
  positive: boolean
  className?: string
}) {
  const gradientId = useId()
  const max = Math.max(...points)
  const min = Math.min(...points)
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * 100,
    28 - ((p - min) / (max - min || 1)) * 24,
  ])
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ")
  const color = positive ? "#22c55e" : "#ef4444"

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={cn("h-12 w-full overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={`${line} L100,30 L0,30 Z`}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
      />
    </svg>
  )
}

/** Same look as the app's WalletCard (components/wallets/wallet-card.tsx). */
export function WalletCardMock({
  wallet,
  className,
}: {
  wallet: MockWallet
  className?: string
}) {
  const t = useScopedI18n("landing.mock")
  const positive = wallet.evolution >= 0

  return (
    <div
      className={cn(
        "rounded-3xl bg-accent p-5 text-accent-foreground",
        className
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2 shrink-0 rounded-full"
              style={{ background: wallet.color }}
            />
            <h3 className="truncate text-sm font-semibold">{wallet.name}</h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(wallet.type)}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs font-medium",
            positive ? "text-green-500" : "text-red-500"
          )}
        >
          {positive ? "+" : "−"}
          {Math.abs(wallet.evolution)}%
        </span>
      </div>
      <Sparkline points={wallet.trend} positive={positive} className="h-10" />
      <p className="mt-2 text-xl font-bold tabular-nums">
        {formatXaf(wallet.balance)}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          XAF
        </span>
      </p>
    </div>
  )
}

const transactionIcons: Record<MockTransaction["icon"], LucideIcon> = {
  briefcase: Briefcase,
  laptop: Laptop,
  basket: ShoppingBasket,
  zap: Zap,
  bus: Bus,
}

export function TransactionRow({
  transaction,
  compact = false,
}: {
  transaction: MockTransaction
  compact?: boolean
}) {
  const t = useScopedI18n("landing.mock")
  const Icon = transactionIcons[transaction.icon]
  const income = transaction.amount > 0

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          income
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{t(transaction.key)}</p>
        <p className="truncate text-xs text-muted-foreground">
          {transaction.wallet}
          {!compact && ` · ${transaction.date}`}
        </p>
      </div>
      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          income ? "text-green-600 dark:text-green-400" : "text-foreground"
        )}
      >
        {income ? "+" : "−"}
        {formatXaf(transaction.amount)}
      </p>
    </div>
  )
}

/** Rounded window chrome around a mockup. */
export function BrowserFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl shadow-primary/10 sm:rounded-3xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-foreground/5 bg-muted/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="mx-auto hidden rounded-full bg-background px-4 py-1 text-xs text-muted-foreground sm:block">
          BeeBudget
        </span>
      </div>
      {children}
    </div>
  )
}
