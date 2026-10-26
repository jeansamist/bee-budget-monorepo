"use client"

import { useApp } from "@/contexts/app.context"
import { displayName } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { Button } from "@bee-budget/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bee-budget/ui/dropdown-menu"
import { Input } from "@bee-budget/ui/input"
import { CalendarDays, ChevronDown, Wallet } from "lucide-react"
import { PRESETS, type Preset } from "./report-presets"

export function PeriodFilter({
  preset,
  from,
  to,
  onPreset,
  onCustom,
}: {
  preset: Preset
  from: string
  to: string
  onPreset: (preset: Preset) => void
  onCustom: (range: { from: string; to: string }) => void
}) {
  const t = useI18n()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <CalendarDays />
            {t(`app.reports.presets.${preset}`)}
            <ChevronDown className="opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={preset}
            onValueChange={(value) => onPreset(value as Preset)}
          >
            {PRESETS.map((item) => (
              <DropdownMenuRadioItem key={item} value={item}>
                {t(`app.reports.presets.${item}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {preset === "custom" && (
        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            aria-label={t("app.reports.from")}
            className="h-8 w-[9.5rem]"
            value={from}
            max={to}
            onChange={(event) =>
              event.target.value && onCustom({ from: event.target.value, to })
            }
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="date"
            aria-label={t("app.reports.to")}
            className="h-8 w-[9.5rem]"
            value={to}
            min={from}
            onChange={(event) =>
              event.target.value && onCustom({ from, to: event.target.value })
            }
          />
        </div>
      )}
    </div>
  )
}

export function WalletFilter({
  walletIds,
  onChange,
}: {
  walletIds: number[]
  onChange: (walletIds: number[]) => void
}) {
  const t = useI18n()
  const { wallets } = useApp()
  const selected = wallets.filter((wallet) => walletIds.includes(wallet.id))
  const label =
    selected.length === 0
      ? t("app.reports.allWallets")
      : selected.length === 1
        ? displayName(selected[0].name)
        : t("app.reports.selectedWallets", { count: selected.length })

  function toggle(id: number, checked: boolean) {
    onChange(
      checked ? [...walletIds, id] : walletIds.filter((item) => item !== id)
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Wallet />
          {label}
          <ChevronDown className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {wallets.map((wallet) => (
          <DropdownMenuCheckboxItem
            key={wallet.id}
            checked={walletIds.includes(wallet.id)}
            onCheckedChange={(checked) => toggle(wallet.id, checked === true)}
            // Keep the menu open to pick several wallets
            onSelect={(event) => event.preventDefault()}
          >
            {displayName(wallet.name)}
          </DropdownMenuCheckboxItem>
        ))}
        {walletIds.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onChange([])}>
              {t("app.reports.clearWallets")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
