"use client"

import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type PointerEvent,
} from "react"

// Shared easing: quick start, soft landing.
export const ease = [0.22, 1, 0.36, 1] as const

/** Honors the OS "reduce motion" setting for every animation below. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

const revealTags = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
}

type RevealProps = ComponentProps<typeof motion.div> & {
  as?: keyof typeof revealTags
  delay?: number
  /** Distance in px the element rises from. */
  y?: number
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({
  as = "div",
  delay = 0,
  y = 28,
  transition,
  ...props
}: RevealProps) {
  const Tag = revealTags[as] as typeof motion.div
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease, delay, ...transition }}
      {...props}
    />
  )
}

/** Stagger delay for the n-th item of a grid row. */
export function stagger(index: number, perRow = 3, step = 0.09) {
  return (index % perRow) * step
}

// Pointer position inside a MouseParallaxArea, from -0.5 to 0.5 on each axis.
type Pointer = { x: MotionValue<number>; y: MotionValue<number> }
const PointerContext = createContext<Pointer | null>(null)

/** Tracks the mouse inside the area so MouseLayer children can follow it. */
export function MouseParallaxArea({
  children,
  ...props
}: ComponentProps<typeof motion.div>) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const spring = { stiffness: 80, damping: 20, mass: 0.6 }
  const x = useSpring(rawX, spring)
  const y = useSpring(rawY, spring)

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <PointerContext.Provider value={{ x, y }}>
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        {...props}
      >
        {children}
      </motion.div>
    </PointerContext.Provider>
  )
}

/** A layer that drifts with the mouse inside a MouseParallaxArea; negative depth moves against it. */
export function MouseLayer({
  depth,
  style,
  ...props
}: ComponentProps<typeof motion.div> & { depth: number }) {
  const pointer = useContext(PointerContext)
  const reduce = useReducedMotion()
  const zero = useMotionValue(0)
  const x = useTransform(pointer?.x ?? zero, (v) => (reduce ? 0 : v * depth))
  const y = useTransform(pointer?.y ?? zero, (v) => (reduce ? 0 : v * depth))
  return <motion.div style={{ x, y, ...style }} {...props} />
}

/** Gentle endless bob, for floating cards. */
export function Float({
  delay = 0,
  distance = 8,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number; distance?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      {...props}
    />
  )
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({
  value,
  duration = 1.4,
  className,
}: {
  value: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const count = useMotionValue(0)
  const text = useTransform(count, (latest) => formatXaf(Math.round(latest)))

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration, ease })
    return () => controls.stop()
  }, [inView, reduce, value, duration, count])

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}

/** 182500 -> "182 500", the way XAF amounts are usually written. */
export function formatXaf(amount: number) {
  return Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Height + fade transition for accordion bodies; render inside AnimatePresence. */
export function Collapse({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  )
}
