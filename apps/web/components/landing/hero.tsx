"use client"

import { useCurrentLocaleUrl, useScopedI18n } from "@/lib/i18n/client"
import { Briefcase, Check } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { LandingButton } from "./button"
import { DashboardMock } from "./mockups/dashboard-mock"
import { MOCK_WALLETS } from "./mockups/data"
import { WalletCardMock } from "./mockups/parts"
import {
  Float,
  formatXaf,
  MouseLayer,
  MouseParallaxArea,
  Reveal,
} from "./motion"

export function Hero() {
  const t = useScopedI18n("landing.hero")
  const tMock = useScopedI18n("landing.mock")
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const mockRef = useRef<HTMLDivElement>(null)

  // The dashboard starts tilted back and straightens as it scrolls up.
  const { scrollYProgress } = useScroll({
    target: mockRef,
    offset: ["start end", "start 30%"],
  })
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])

  return (
    <MouseParallaxArea
      id="top"
      className="relative overflow-hidden bg-linear-to-b from-accent via-accent to-background pt-32 pb-16 sm:pt-40 lg:pt-48"
    >
      {/* Honeycomb glow behind the headline */}
      <div className="pointer-events-none absolute top-0 left-1/2 aspect-square w-[min(60rem,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl space-y-8 px-4 text-center sm:px-6 lg:space-y-10">
        <MouseLayer depth={10} className="space-y-6">
          <Reveal
            as="p"
            delay={0.1}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-foreground/5 bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {t("eyebrow")}
          </Reveal>
          <Reveal
            as="h1"
            delay={0.2}
            y={40}
            className="mx-auto max-w-4xl font-serif text-4xl leading-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {t("title", {
              accent: (
                <span className="font-semibold text-primary italic dark:text-chart-2">
                  {t("titleAccent")}
                </span>
              ),
            })}
          </Reveal>
          <Reveal
            as="p"
            delay={0.35}
            className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl"
          >
            {t("intro")}
          </Reveal>
        </MouseLayer>

        <Reveal
          delay={0.5}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6"
        >
          <LandingButton href={currentLocaleUrl("/auth/sign-up")} arrow>
            {t("primary")}
          </LandingButton>
          <LandingButton variant="ghost" href="#how-it-works">
            {t("secondary")}
          </LandingButton>
        </Reveal>
        <Reveal
          as="p"
          delay={0.6}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Check className="size-4 text-primary" />
          {t("note")}
        </Reveal>
      </div>

      <div
        ref={mockRef}
        className="relative mx-auto mt-14 w-full max-w-6xl px-4 [perspective:1600px] sm:mt-20 sm:px-6"
      >
        <motion.div
          style={{ rotateX, scale, transformOrigin: "50% 0%" }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          <DashboardMock />
        </motion.div>

        {/* Floating cards around the dashboard, on large screens */}
        <MouseLayer
          depth={-28}
          className="absolute top-64 -left-6 hidden w-64 lg:block xl:-left-16"
        >
          <Float delay={0.3}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center gap-3 rounded-2xl border border-foreground/5 bg-background/90 p-3 shadow-xl shadow-foreground/10 backdrop-blur"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <Briefcase className="size-5" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-xs text-muted-foreground">
                  {tMock("salaryReceived")}
                </p>
                <p className="font-semibold text-green-600 tabular-nums dark:text-green-400">
                  +{formatXaf(450000)} XAF
                </p>
              </div>
            </motion.div>
          </Float>
        </MouseLayer>
        <MouseLayer
          depth={-40}
          className="absolute -right-4 bottom-10 hidden w-60 lg:block xl:-right-12"
        >
          <Float delay={1.2} distance={10}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <WalletCardMock
                wallet={MOCK_WALLETS[1]}
                className="border border-foreground/5 bg-background/90 shadow-xl shadow-foreground/10 backdrop-blur"
              />
            </motion.div>
          </Float>
        </MouseLayer>
      </div>
    </MouseParallaxArea>
  )
}
