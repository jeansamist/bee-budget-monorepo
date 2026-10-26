import { cn } from "@bee-budget/functions"
import { ArrowRight } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

const variants = {
  primary: "h-12 bg-foreground text-background sm:h-14",
  ghost: "h-12 px-2 text-muted-foreground hover:text-foreground sm:h-14",
}

type LandingButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: keyof typeof variants
  /** Shows the arrow in a circle (primary only). */
  arrow?: boolean
}

/**
 * Pill link in the portfolio style. Links into the app are plain <a> on
 * purpose: a full page load goes through the proxy, which shows the
 * cold-start loader if the API is still asleep.
 */
export function LandingButton({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...props
}: LandingButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-full text-base font-semibold transition-colors sm:text-lg",
        variants[variant],
        variant === "primary" &&
          (arrow ? "py-1.5 pr-1.5 pl-6 sm:py-2 sm:pr-2" : "px-6"),
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {arrow && variant === "primary" && (
        <span className="flex aspect-square h-full items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ArrowRight className="size-4 sm:size-5" />
        </span>
      )}
    </a>
  )
}
