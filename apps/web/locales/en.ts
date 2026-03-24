export default {
  "common.app-name": "BeeBudget",

  "home.ready.title": "Project ready!",
  "home.ready.description": "You may now add components and start building.",
  "home.ready.button-hint": "We've already added the button component for you.",
  "home.ready.button": "Button",
  "home.dark-mode-hint": "(Press d to toggle dark mode)",
} as const
export type Locale = typeof import("./en").default
export type LocaleKey = keyof Locale
