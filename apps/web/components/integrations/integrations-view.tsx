"use client"

import { useI18n } from "@/lib/i18n/client"
import { Badge } from "@bee-budget/ui/badge"
import {
  BellRing,
  Bot,
  Camera,
  FileUp,
  MessageCircle,
  MessageSquareText,
  Sheet,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react"

type IntegrationKey =
  | "momoSms"
  | "whatsapp"
  | "telegram"
  | "receipts"
  | "statementImport"
  | "budgetAlerts"
  | "aiInsights"
  | "sheets"
  | "api"

const GROUPS: {
  key: "capture" | "insights" | "connect"
  items: { key: IntegrationKey; icon: LucideIcon; color: string }[]
}[] = [
  {
    key: "capture",
    items: [
      { key: "momoSms", icon: MessageSquareText, color: "#ff7900" },
      { key: "whatsapp", icon: MessageCircle, color: "#22c55e" },
      { key: "telegram", icon: Bot, color: "#0ea5e9" },
      { key: "receipts", icon: Camera, color: "#a855f7" },
      { key: "statementImport", icon: FileUp, color: "#3b82f6" },
    ],
  },
  {
    key: "insights",
    items: [
      { key: "budgetAlerts", icon: BellRing, color: "#f59e0b" },
      { key: "aiInsights", icon: Sparkles, color: "#ec4899" },
    ],
  },
  {
    key: "connect",
    items: [
      { key: "sheets", icon: Sheet, color: "#16a34a" },
      { key: "api", icon: Webhook, color: "#64748b" },
    ],
  },
]

export function IntegrationsView() {
  const t = useI18n()

  return (
    <div className="space-y-8 px-4 pb-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        {t("app.integrations.intro")}
      </p>
      {GROUPS.map((group) => (
        <section key={group.key} className="space-y-3">
          <h3 className="font-semibold">
            {t(`app.integrations.groups.${group.key}`)}
          </h3>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map(({ key, icon: Icon, color }) => (
              <li
                key={key}
                className="flex min-w-0 flex-col gap-4 rounded-3xl bg-accent p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex size-11 items-center justify-center rounded-2xl text-white"
                    style={{ background: color }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <Badge variant="outline" className="bg-background">
                    {t("app.integrations.proposed")}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">
                    {t(`app.integrations.items.${key}.title`)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t(`app.integrations.items.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
