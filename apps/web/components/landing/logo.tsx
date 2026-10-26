import { cn } from "@bee-budget/functions"

/** Honeycomb cell with bee stripes, in the primary color. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 text-primary", className)}
      aria-hidden
    >
      <path
        d="M16 1.5 28.5 8.75v14.5L16 30.5 3.5 23.25V8.75Z"
        fill="currentColor"
      />
      <path
        d="M9 13h14M8 17.5h16M9 22h14"
        stroke="var(--background)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">BeeBudget</span>
    </span>
  )
}
