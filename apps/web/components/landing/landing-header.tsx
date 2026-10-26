"use client"

import { useCurrentLocaleUrl, useScopedI18n } from "@/lib/i18n/client"
import { Menu, X } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import { useState } from "react"
import { LandingButton } from "./button"
import { Logo } from "./logo"
import { ease } from "./motion"

export function LandingHeader({ hasSession }: { hasSession: boolean }) {
  const t = useScopedI18n("landing.nav")
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  // Hide while scrolling down past the hero, show again as soon as the user scrolls up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(y > previous && y > 240 && !menu)
  })

  const links = [
    { href: "#features", label: t("features") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#faq", label: t("faq") },
  ]

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-4 lg:py-6"
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.35, ease }}
    >
      <div className="pointer-events-auto relative w-full max-w-5xl rounded-[1.75rem] border border-foreground/5 bg-background/70 p-1.5 backdrop-blur-2xl sm:p-2">
        <div className="flex items-center justify-between gap-4">
          <a href="#top" className="px-2">
            <Logo />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-base text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {hasSession ? (
              <LandingButton
                href={currentLocaleUrl("/app/dashboard")}
                className="h-10 px-5 text-sm sm:h-11 sm:text-base"
              >
                {t("openApp")}
              </LandingButton>
            ) : (
              <>
                <LandingButton
                  variant="ghost"
                  href={currentLocaleUrl("/auth/sign-in")}
                  className="hidden h-10 px-3 text-sm sm:inline-flex sm:h-11 sm:text-base"
                >
                  {t("signIn")}
                </LandingButton>
                <LandingButton
                  href={currentLocaleUrl("/auth/sign-up")}
                  className="h-10 px-5 text-sm sm:h-11 sm:text-base"
                >
                  {t("getStarted")}
                </LandingButton>
              </>
            )}
            <button
              type="button"
              aria-label={t("menu")}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
              className="flex size-10 items-center justify-center rounded-full hover:bg-foreground/5 md:hidden"
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 px-2 pt-3 pb-2">
                {links.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenu(false)}
                    className="rounded-xl px-3 py-2.5 text-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
                {!hasSession && (
                  <a
                    href={currentLocaleUrl("/auth/sign-in")}
                    className="rounded-xl px-3 py-2.5 text-lg font-medium sm:hidden"
                  >
                    {t("signIn")}
                  </a>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
