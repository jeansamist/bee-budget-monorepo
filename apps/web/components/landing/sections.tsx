"use client"

import { useCurrentLocaleUrl, useScopedI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import {
  Banknote,
  CreditCard,
  Landmark,
  Plus,
  Smartphone,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { LandingButton } from "./button"
import { Logo, LogoMark } from "./logo"
import {
  AnalyticsMock,
  ContactsMock,
  ThemeMock,
  TransactionsMock,
  TransferMock,
  WalletsMock,
} from "./mockups/feature-mocks"
import {
  Collapse,
  ease,
  MouseLayer,
  MouseParallaxArea,
  Reveal,
  stagger,
} from "./motion"

/** Section heading in the portfolio style: serif, with a semibold italic accent. */
function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      as="h2"
      y={40}
      className={cn(
        "max-w-3xl font-serif text-3xl leading-snug text-balance sm:text-4xl sm:leading-tight lg:text-6xl",
        className
      )}
    >
      {children}
    </Reveal>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-primary italic dark:text-chart-2">
      {children}
    </span>
  )
}

const stripItems: {
  key: "orangeMoney" | "mtnMomo" | "cash" | "bank" | "card"
  icon: LucideIcon
  color: string
}[] = [
  { key: "orangeMoney", icon: Smartphone, color: "#ff7900" },
  { key: "mtnMomo", icon: Smartphone, color: "#ffcb05" },
  { key: "cash", icon: Banknote, color: "#22c55e" },
  { key: "bank", icon: Landmark, color: "#3b82f6" },
  { key: "card", icon: CreditCard, color: "#a855f7" },
]

export function WalletStrip() {
  const t = useScopedI18n("landing.strip")
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 text-center sm:px-6">
        <Reveal as="p" className="text-sm text-muted-foreground sm:text-base">
          {t("title")}
        </Reveal>
        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {stripItems.map(({ key, icon: Icon, color }, i) => (
            <Reveal
              as="li"
              key={key}
              delay={stagger(i, 5, 0.07)}
              y={16}
              className="flex items-center gap-2 rounded-full border border-foreground/5 bg-accent px-4 py-2 text-sm font-medium sm:text-base"
            >
              <Icon className="size-4" style={{ color }} />
              {t(key)}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

type FeatureKey =
  | "wallets"
  | "transactions"
  | "transfers"
  | "analytics"
  | "contacts"
  | "theme"

const features: {
  key: FeatureKey
  mock: React.ComponentType
  className: string
}[] = [
  { key: "wallets", mock: WalletsMock, className: "lg:col-span-3" },
  { key: "transactions", mock: TransactionsMock, className: "lg:col-span-3" },
  { key: "analytics", mock: AnalyticsMock, className: "lg:col-span-4" },
  { key: "transfers", mock: TransferMock, className: "lg:col-span-2" },
  { key: "contacts", mock: ContactsMock, className: "lg:col-span-3" },
  { key: "theme", mock: ThemeMock, className: "lg:col-span-3" },
]

export function Features() {
  const t = useScopedI18n("landing.features")
  return (
    <section id="features" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 sm:px-6 lg:space-y-14">
        <SectionTitle>
          {t("title", { accent: <Accent>{t("titleAccent")}</Accent> })}
        </SectionTitle>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-6">
          {features.map(({ key, mock: Mock, className }, i) => (
            <Reveal
              as="article"
              key={key}
              delay={stagger(i, 2)}
              className={cn(
                "flex min-w-0 flex-col gap-8 overflow-hidden rounded-[2rem] bg-accent p-6 sm:p-8",
                className
              )}
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-pretty text-muted-foreground sm:text-lg">
                  {t(`${key}.body`)}
                </p>
              </div>
              <div className="mt-auto">
                <Mock />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = ["one", "two", "three"] as const

export function Steps() {
  const t = useScopedI18n("landing.steps")
  const ref = useRef<HTMLDivElement>(null)
  // The line between the steps fills in as the section scrolls by.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-linear-to-b from-background via-accent to-background py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 sm:px-6 lg:space-y-14">
        <SectionTitle>
          {t("title", { accent: <Accent>{t("titleAccent")}</Accent> })}
        </SectionTitle>

        <div ref={ref} className="relative">
          <div className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-foreground/10 md:block">
            <motion.div
              style={{ scaleX }}
              className="h-full origin-left bg-primary"
            />
          </div>
          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step}
                delay={stagger(i)}
                className="space-y-4 md:text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-full border border-foreground/5 bg-background font-serif text-2xl font-semibold text-primary italic shadow-sm md:mx-auto">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold sm:text-2xl">
                  {t(`${step}.title`)}
                </h3>
                <p className="mx-auto max-w-xs text-pretty text-muted-foreground sm:text-lg">
                  {t(`${step}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

const questions = ["connect", "currency", "fees", "phone", "setup"] as const

export function Faq() {
  const t = useScopedI18n("landing.faq")
  const [open, setOpen] = useState<string | null>(questions[0])

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <SectionTitle>
          {t("title", { accent: <Accent>{t("titleAccent")}</Accent> })}
        </SectionTitle>

        <div className="divide-y divide-foreground/10 border-y border-foreground/10">
          {questions.map((question, i) => {
            const isOpen = open === question
            return (
              <Reveal key={question} delay={i * 0.06} y={16}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : question)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium sm:text-xl"
                >
                  {t(`${question}.question`)}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent"
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <Collapse>
                      <p className="pb-5 text-pretty text-muted-foreground sm:text-lg">
                        {t(`${question}.answer`)}
                      </p>
                    </Collapse>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  const t = useScopedI18n("landing.cta")
  const { currentLocaleUrl } = useCurrentLocaleUrl()

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <Reveal y={48} className="mx-auto max-w-6xl">
        <MouseParallaxArea className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-24">
          {/* Drifting honeycomb cells */}
          <MouseLayer
            depth={30}
            className="pointer-events-none absolute -top-10 -left-10 opacity-20"
          >
            <LogoMark className="size-40 text-primary-foreground" />
          </MouseLayer>
          <MouseLayer
            depth={-40}
            className="pointer-events-none absolute -right-8 -bottom-12 opacity-20"
          >
            <LogoMark className="size-56 text-primary-foreground" />
          </MouseLayer>

          <div className="relative mx-auto max-w-3xl space-y-6">
            <h2 className="font-serif text-3xl leading-snug text-balance sm:text-5xl lg:text-6xl">
              {t("title", {
                accent: (
                  <span className="font-semibold italic">
                    {t("titleAccent")}
                  </span>
                ),
              })}
            </h2>
            <p className="text-lg text-pretty opacity-90 sm:text-xl">
              {t("body")}
            </p>
            <LandingButton
              href={currentLocaleUrl("/auth/sign-up")}
              arrow
              className="bg-background text-foreground"
            >
              {t("button")}
            </LandingButton>
          </div>
        </MouseParallaxArea>
      </Reveal>
    </section>
  )
}

export function LandingFooter() {
  const t = useScopedI18n("landing.footer")
  return (
    <footer className="border-t border-foreground/5 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
          <p>
            {t("madeBy", {
              name: (
                <span className="font-medium text-foreground">
                  Ephraim BAHA
                </span>
              ),
            })}
          </p>
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
