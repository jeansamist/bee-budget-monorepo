export default {
  "common.app-name": "BeeBudget",

  "home.ready.title": "Project ready!",
  "home.ready.description": "You may now add components and start building.",
  "home.ready.button-hint": "We've already added the button component for you.",
  "home.ready.button": "Button",
  "home.dark-mode-hint": "(Press d to toggle dark mode)",

  "auth.signUp.firstName.label": "First name",
  "auth.signUp.firstName.placeholder": "Enter your first name",
  "auth.signUp.lastName.label": "Last name",
  "auth.signUp.lastName.placeholder": "Enter your last name",
  "auth.signUp.email.label": "Email",
  "auth.signUp.email.placeholder": "Enter your email",
  "auth.signUp.password.label": "Password",
  "auth.signUp.password.placeholder": "Enter a password",
  "auth.signUp.submit": "Submit",
  "auth.signUp.signIn.link": "I already have an account",
} as const
export type Locale = typeof import("./en").default
export type LocaleKey = keyof Locale
