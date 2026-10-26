"use client"

import { Confirm } from "@/components/confirm"
import { useAuth } from "@/contexts/auth.context"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordSchema,
  type ProfileSchema,
  type ProfileSchemaInput,
} from "@/schemas/settings.schemas"
import {
  changePassword,
  deleteAccount,
  logout,
  updateProfile,
} from "@/services/auth.services"
import { cn } from "@bee-budget/functions"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { Button } from "@bee-budget/ui/button"
import { Field, FieldGroup } from "@bee-budget/ui/field"
import { InputField } from "@bee-budget/ui/fields"
import { Input } from "@bee-budget/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, LogOut, Monitor, Moon, Sun } from "lucide-react"
import { useHydrated } from "@/lib/use-hydrated"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: {
  title: string
  description: string
  children: ReactNode
  danger?: boolean
}) {
  return (
    <section
      className={cn(
        "grid gap-6 rounded-3xl border p-5 lg:grid-cols-[18rem_minmax(0,1fr)]",
        danger && "border-destructive/30"
      )}
    >
      <div className="space-y-1">
        <h3 className={cn("font-semibold", danger && "text-destructive")}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="max-w-xl min-w-0">{children}</div>
    </section>
  )
}

function ProfileForm() {
  const t = useI18n()
  const router = useRouter()
  const { user } = useAuth()
  const form = useForm<ProfileSchemaInput, unknown, ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      avatar: user?.avatar ?? "",
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(data: ProfileSchema) {
    const result = await updateProfile(data)
    if (!result.success) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    setErrorMessage(undefined)
    // The saved values become the new baseline for "unsaved changes"
    form.reset({ ...data, avatar: data.avatar ?? "" })
    toast.success(t("app.settings.profile.saved"))
    // The user comes from the server layout
    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.settings.profile.firstName")}
            name="firstName"
          />
          <InputField
            formReturn={form}
            label={t("app.settings.profile.lastName")}
            name="lastName"
          />
        </div>
        <Field>
          <label className="text-sm font-medium" htmlFor="settings-email">
            {t("app.settings.profile.email")}
          </label>
          <Input id="settings-email" value={user?.email ?? ""} disabled />
          <p className="text-xs text-muted-foreground">
            {t("app.settings.profile.emailHelp")}
          </p>
        </Field>
        <InputField
          formReturn={form}
          label={t("app.settings.profile.avatar")}
          description={t("app.settings.profile.avatarHelp")}
          name="avatar"
          type="url"
          placeholder="https://"
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              form.formState.isSubmitting
            }
          >
            {t("app.manage.actions.save")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

function PasswordForm() {
  const t = useI18n()
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(data: ChangePasswordSchema) {
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    if (!result.success) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    setErrorMessage(undefined)
    form.reset()
    toast.success(t("app.settings.password.saved"))
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.settings.password.current")}
          name="currentPassword"
          type="password"
          autoComplete="current-password"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.settings.password.new")}
            description={t("app.settings.password.newHelp")}
            name="newPassword"
            type="password"
            autoComplete="new-password"
          />
          <InputField
            formReturn={form}
            label={t("app.settings.password.confirm")}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.settings.password.submit")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

function AppearancePicker() {
  const t = useI18n()
  const { theme: currentTheme, setTheme } = useTheme()
  // The theme is only known in the browser
  const theme = useHydrated() ? currentTheme : undefined
  const options = [
    { value: "light", icon: Sun, label: t("app.settings.appearance.light") },
    { value: "dark", icon: Moon, label: t("app.settings.appearance.dark") },
    {
      value: "system",
      icon: Monitor,
      label: t("app.settings.appearance.system"),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition-colors hover:border-primary/50",
            theme === value && "border-primary ring-1 ring-primary"
          )}
        >
          <Icon className="size-5" />
          {label}
        </button>
      ))}
    </div>
  )
}

function SessionActions() {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const [pending, setPending] = useState(false)

  async function onLogout() {
    setPending(true)
    await logout()
    // Full navigation so every server-rendered part forgets the session
    window.location.href = currentLocaleUrl("/auth/sign-in")
  }

  return (
    <Button variant="outline" onClick={onLogout} disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
      {t("app.settings.session.logout")}
    </Button>
  )
}

function DeleteAccount() {
  const t = useI18n()
  const { user } = useAuth()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const confirmed =
    Boolean(user?.email) &&
    confirmation.trim().toLowerCase() === user?.email.toLowerCase()

  async function onDelete() {
    if (!confirmed) return
    const result = await deleteAccount()
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    window.location.href = currentLocaleUrl("/")
  }

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm">
        <span>
          {t("app.settings.danger.typeEmail", { email: user?.email ?? "" })}
        </span>
        <Input
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="off"
          placeholder={user?.email}
        />
      </label>
      <Button
        variant="destructive"
        disabled={!confirmed}
        onClick={() => setOpen(true)}
      >
        {t("app.settings.danger.delete")}
      </Button>
      <Confirm
        open={open}
        onOpenChange={setOpen}
        title={t("app.settings.danger.confirmTitle")}
        content={t("app.settings.danger.confirmContent")}
        confirmText={t("app.settings.danger.delete")}
        onConfirm={onDelete}
      />
    </div>
  )
}

export function SettingsView() {
  const t = useI18n()
  return (
    <div className="space-y-4 px-4 pb-6">
      <SettingsSection
        title={t("app.settings.profile.title")}
        description={t("app.settings.profile.description")}
      >
        <ProfileForm />
      </SettingsSection>
      <SettingsSection
        title={t("app.settings.password.title")}
        description={t("app.settings.password.description")}
      >
        <PasswordForm />
      </SettingsSection>
      <SettingsSection
        title={t("app.settings.appearance.title")}
        description={t("app.settings.appearance.description")}
      >
        <AppearancePicker />
      </SettingsSection>
      <SettingsSection
        title={t("app.settings.session.title")}
        description={t("app.settings.session.description")}
      >
        <SessionActions />
      </SettingsSection>
      <SettingsSection
        title={t("app.settings.danger.title")}
        description={t("app.settings.danger.description")}
        danger
      >
        <DeleteAccount />
      </SettingsSection>
    </div>
  )
}
