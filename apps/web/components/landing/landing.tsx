import { cn } from "@bee-budget/functions"
import { BackendWarmup } from "./backend-warmup"
import { lora } from "./fonts"
import { Hero } from "./hero"
import { LandingHeader } from "./landing-header"
import { MotionProvider } from "./motion"
import {
  Faq,
  Features,
  FinalCta,
  LandingFooter,
  Steps,
  WalletStrip,
} from "./sections"

export function Landing({ hasSession }: { hasSession: boolean }) {
  return (
    <MotionProvider>
      <div className={cn(lora.variable, "overflow-x-clip")}>
        <BackendWarmup />
        <LandingHeader hasSession={hasSession} />
        <main>
          <Hero />
          <WalletStrip />
          <Features />
          <Steps />
          <Faq />
          <FinalCta />
        </main>
        <LandingFooter />
      </div>
    </MotionProvider>
  )
}
