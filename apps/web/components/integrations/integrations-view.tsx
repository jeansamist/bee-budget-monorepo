"use client"

import { AiProviders } from "@/components/integrations/ai-providers"
import { useI18n } from "@/lib/i18n/client"
import {
  ArrowDown,
  BellRing,
  Bot,
  Camera,
  FileUp,
  Sheet,
  Webhook,
  type LucideIcon,
} from "lucide-react"
import type { ReactNode } from "react"

type ListKey =
  | "receipts"
  | "statementImport"
  | "budgetAlerts"
  | "telegram"
  | "sheets"
  | "api"

const EXPLORING: { key: ListKey; icon: LucideIcon }[] = [
  { key: "budgetAlerts", icon: BellRing },
  { key: "statementImport", icon: FileUp },
  { key: "receipts", icon: Camera },
]

const LATER: { key: ListKey; icon: LucideIcon }[] = [
  { key: "telegram", icon: Bot },
  { key: "sheets", icon: Sheet },
  { key: "api", icon: Webhook },
]

function StageHeading({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-2">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

/** Text on the left, a concrete example of the integration on the right. */
function Featured({
  title,
  body,
  steps,
  example,
}: {
  title: string
  body: string
  steps: string[]
  example: ReactNode
}) {
  return (
    <article className="grid gap-6 rounded-3xl border p-5 sm:p-6 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{body}</p>
        <ol className="space-y-2 text-sm">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-xs leading-5 text-muted-foreground">
                0{index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col justify-center gap-3 rounded-2xl bg-muted/60 p-4 sm:p-6">
        {example}
      </div>
    </article>
  )
}

function SmsExample() {
  const t = useI18n()
  return (
    <>
      <div className="max-w-sm space-y-1">
        <p className="text-xs text-muted-foreground">OrangeMoney · 14:32</p>
        <p className="rounded-2xl rounded-tl-sm bg-background p-3 font-mono text-xs leading-relaxed shadow-sm">
          Transfert de 25000 FCFA vers 6XXXXX412 reussi. Frais: 250 FCFA.
          Nouveau solde: 157250 FCFA. ID: PP261026.1432.A81
        </p>
      </div>
      <ArrowDown className="mx-auto size-4 text-muted-foreground" />
      <div className="flex items-center gap-3 rounded-2xl bg-background p-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {t("app.integrations.sms.transaction")}
          </p>
          <p className="text-xs text-muted-foreground">
            Orange Money · {t("app.integrations.sms.fee")} 250
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums">−25,000</p>
      </div>
    </>
  )
}

function WhatsAppExample() {
  const t = useI18n()
  return (
    <div className="space-y-2 text-sm">
      <p className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[#111b21]">
        taxi 2000
      </p>
      <p className="w-fit max-w-xs rounded-2xl rounded-tl-sm bg-background px-3 py-2 shadow-sm">
        {t("app.integrations.whatsapp.reply")}
      </p>
      <p className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[#111b21]">
        {t("app.integrations.whatsapp.question")}
      </p>
      <p className="w-fit max-w-xs rounded-2xl rounded-tl-sm bg-background px-3 py-2 shadow-sm">
        {t("app.integrations.whatsapp.answer")}
      </p>
    </div>
  )
}

function IdeaList({ items }: { items: { key: ListKey; icon: LucideIcon }[] }) {
  const t = useI18n()
  return (
    <ul className="divide-y">
      {items.map(({ key, icon: Icon }) => (
        <li key={key} className="flex gap-4 py-4">
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">
              {t(`app.integrations.items.${key}.title`)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(`app.integrations.items.${key}.description`)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function IntegrationsView() {
  const t = useI18n()

  return (
    <div className="max-w-5xl space-y-10 px-4 pb-10">
      <p className="max-w-2xl text-sm text-muted-foreground">
        {t("app.integrations.intro")}
      </p>

      <section className="space-y-4">
        <StageHeading
          title={t("app.integrations.stages.available")}
          note={t("app.integrations.stages.availableNote")}
        />
        <AiProviders />
      </section>

      <section className="space-y-4">
        <StageHeading
          title={t("app.integrations.stages.next")}
          note={t("app.integrations.stages.nextNote")}
        />
        <Featured
          title={t("app.integrations.items.momoSms.title")}
          body={t("app.integrations.items.momoSms.description")}
          steps={[
            t("app.integrations.sms.step1"),
            t("app.integrations.sms.step2"),
            t("app.integrations.sms.step3"),
          ]}
          example={<SmsExample />}
        />
        <Featured
          title={t("app.integrations.items.whatsapp.title")}
          body={t("app.integrations.items.whatsapp.description")}
          steps={[
            t("app.integrations.whatsapp.step1"),
            t("app.integrations.whatsapp.step2"),
          ]}
          example={<WhatsAppExample />}
        />
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-1">
          <StageHeading
            title={t("app.integrations.stages.exploring")}
            note={t("app.integrations.stages.exploringNote")}
          />
          <IdeaList items={EXPLORING} />
        </section>
        <section className="space-y-1">
          <StageHeading
            title={t("app.integrations.stages.later")}
            note={t("app.integrations.stages.laterNote")}
          />
          <IdeaList items={LATER} />
        </section>
      </div>
    </div>
  )
}
