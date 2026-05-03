"use client"

import { useApp } from "@/contexts/app.context"
import { useI18n } from "@/lib/i18n/client"
import {
  contactTypeSchema,
  createContactSchema,
  type CreateContactSchema,
  type CreateContactSchemaInput,
} from "@/schemas/contacts.schemas"
import {
  createExpenseCategorySchema,
  type CreateExpenseCategorySchema,
  type CreateExpenseCategorySchemaInput,
} from "@/schemas/expense-categories.schemas"
import {
  createIncomeCategorySchema,
  type CreateIncomeCategorySchema,
  type CreateIncomeCategorySchemaInput,
} from "@/schemas/income-categories.schemas"
import {
  createWalletTypeSchema,
  type CreateWalletTypeSchema,
  type CreateWalletTypeSchemaInput,
} from "@/schemas/wallet-types.schemas"
import {
  createWalletSchema,
  type CreateWalletSchema,
  type CreateWalletSchemaInput,
} from "@/schemas/wallets.schemas"
import { createContact } from "@/services/contacts.services"
import { createExpenseCategory } from "@/services/expense-categories.services"
import { createIncomeCategory } from "@/services/income-categories.services"
import { createWalletType } from "@/services/wallet-types.services"
import { createWallet } from "@/services/wallets.services"
import type {
  Contact,
  ExpenseCategory,
  IncomeCategory,
  Wallet,
  WalletType,
} from "@/types"
import { Alert, AlertDescription } from "@bee-budget/ui/alert"
import { Button } from "@bee-budget/ui/button"
import { Field, FieldGroup } from "@bee-budget/ui/field"
import { InputField, SelectField, TextareaField } from "@bee-budget/ui/fields"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@bee-budget/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, Plus } from "lucide-react"
import { FunctionComponent, ReactNode, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

type EntitySheetButtonProps = {
  buttonLabel: string
  title: string
  description: string
  children: (options: { close: () => void }) => ReactNode
}

const EntitySheetButton: FunctionComponent<EntitySheetButtonProps> = ({
  buttonLabel,
  title,
  description,
  children,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="mb-3 shrink-0">
          <Plus />
          {buttonLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-6">
          {children({ close: () => setOpen(false) })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

type CreateSheetProps<T> = {
  onCreated?: (entity: T) => void
}

const CreateExpenseCategoryForm: FunctionComponent<
  CreateSheetProps<ExpenseCategory> & { onClose: () => void }
> = ({ onCreated, onClose }) => {
  const form = useForm<
    CreateExpenseCategorySchemaInput,
    unknown,
    CreateExpenseCategorySchema
  >({
    resolver: zodResolver(createExpenseCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      color: "#ef4444",
      icon: null,
      defaultWalletTypeId: null,
      defaultContactId: null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const t = useI18n()
  const { addExpenseCategory } = useApp()

  async function onSubmit(data: CreateExpenseCategorySchema) {
    const result = await createExpenseCategory(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    addExpenseCategory(result.data)
    onCreated?.(result.data)
    onClose()
  }

  return (
    <form
      id="create-expense-category-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.expenseCategory.fields.name.label")}
          name="name"
          placeholder={t(
            "app.inlineCreate.expenseCategory.fields.name.placeholder"
          )}
        />
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.expenseCategory.fields.color.label")}
          name="color"
          type="color"
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.inlineCreate.expenseCategory.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" variant="link" onClick={onClose}>
            {t("app.forms.common.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const CreateIncomeCategoryForm: FunctionComponent<
  CreateSheetProps<IncomeCategory> & { onClose: () => void }
> = ({ onCreated, onClose }) => {
  const form = useForm<
    CreateIncomeCategorySchemaInput,
    unknown,
    CreateIncomeCategorySchema
  >({
    resolver: zodResolver(createIncomeCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      color: "#22c55e",
      icon: null,
      defaultWalletTypeId: null,
      defaultContactId: null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const t = useI18n()
  const { addIncomeCategory } = useApp()

  async function onSubmit(data: CreateIncomeCategorySchema) {
    const result = await createIncomeCategory(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    addIncomeCategory(result.data)
    onCreated?.(result.data)
    onClose()
  }

  return (
    <form
      id="create-income-category-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.incomeCategory.fields.name.label")}
          name="name"
          placeholder={t(
            "app.inlineCreate.incomeCategory.fields.name.placeholder"
          )}
        />
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.incomeCategory.fields.color.label")}
          name="color"
          type="color"
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.inlineCreate.incomeCategory.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" variant="link" onClick={onClose}>
            {t("app.forms.common.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const CreateContactForm: FunctionComponent<
  CreateSheetProps<Contact> & { onClose: () => void }
> = ({ onCreated, onClose }) => {
  const t = useI18n()
  const { addContact } = useApp()
  const form = useForm<CreateContactSchemaInput, unknown, CreateContactSchema>({
    resolver: zodResolver(createContactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      color: "#0ea5e9",
      type: contactTypeSchema.enum.person,
      phoneNumber: null,
      email: null,
      comments: null,
      image: null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  const contactTypeItems = useMemo(
    () => [
      {
        value: contactTypeSchema.enum.person,
        label: t("app.inlineCreate.contact.fields.type.options.person"),
      },
      {
        value: contactTypeSchema.enum.entreprise,
        label: t("app.inlineCreate.contact.fields.type.options.entreprise"),
      },
      {
        value: contactTypeSchema.enum.other,
        label: t("app.inlineCreate.contact.fields.type.options.other"),
      },
    ],
    [t]
  )

  async function onSubmit(data: CreateContactSchema) {
    const result = await createContact(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    addContact(result.data)
    onCreated?.(result.data)
    onClose()
  }

  return (
    <form id="create-contact-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.contact.fields.name.label")}
          name="name"
          placeholder={t("app.inlineCreate.contact.fields.name.placeholder")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            formReturn={form}
            label={t("app.inlineCreate.contact.fields.type.label")}
            name="type"
            placeholder={t("app.inlineCreate.contact.fields.type.placeholder")}
            items={contactTypeItems}
          />
          <InputField
            formReturn={form}
            label={t("app.inlineCreate.contact.fields.color.label")}
            name="color"
            type="color"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            formReturn={form}
            label={t("app.inlineCreate.contact.fields.phone.label")}
            name="phoneNumber"
            placeholder={t("app.inlineCreate.contact.fields.phone.placeholder")}
          />
          <InputField
            formReturn={form}
            label={t("app.inlineCreate.contact.fields.email.label")}
            name="email"
            type="email"
            placeholder={t("app.inlineCreate.contact.fields.email.placeholder")}
          />
        </div>
        <TextareaField
          formReturn={form}
          label={t("app.inlineCreate.contact.fields.comments.label")}
          name="comments"
          placeholder={t(
            "app.inlineCreate.contact.fields.comments.placeholder"
          )}
          rows={4}
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.inlineCreate.contact.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" variant="link" onClick={onClose}>
            {t("app.forms.common.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const CreateWalletTypeForm: FunctionComponent<
  CreateSheetProps<WalletType> & { onClose: () => void }
> = ({ onCreated, onClose }) => {
  const t = useI18n()
  const { addWalletType } = useApp()
  const form = useForm<
    CreateWalletTypeSchemaInput,
    unknown,
    CreateWalletTypeSchema
  >({
    resolver: zodResolver(createWalletTypeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      color: "#f59e0b",
      icon: null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(data: CreateWalletTypeSchema) {
    const result = await createWalletType(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    addWalletType(result.data)
    onCreated?.(result.data)
    onClose()
  }

  return (
    <form id="create-wallet-type-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.walletType.fields.name.label")}
          name="name"
          placeholder={t("app.inlineCreate.walletType.fields.name.placeholder")}
        />
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.walletType.fields.color.label")}
          name="color"
          type="color"
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.inlineCreate.walletType.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" variant="link" onClick={onClose}>
            {t("app.forms.common.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const CreateWalletForm: FunctionComponent<
  CreateSheetProps<Wallet> & { onClose: () => void }
> = ({ onCreated, onClose }) => {
  const t = useI18n()
  const { walletTypes, addWallet } = useApp()
  const form = useForm<CreateWalletSchemaInput, unknown, CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      walletTypeId: undefined,
      amount: 0,
      image: null,
    },
  })
  const [errorMessage, setErrorMessage] = useState<string>()

  const walletTypeItems = useMemo(
    () =>
      walletTypes.map((walletType) => ({
        value: walletType.id.toString(),
        label: walletType.name,
      })),
    [walletTypes]
  )

  async function onSubmit(data: CreateWalletSchema) {
    const result = await createWallet(data)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }

    addWallet(result.data)
    onCreated?.(result.data)
    onClose()
  }

  return (
    <form id="create-wallet-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.wallet.fields.name.label")}
          name="name"
          placeholder={t("app.inlineCreate.wallet.fields.name.placeholder")}
        />
        <TextareaField
          formReturn={form}
          label={t("app.inlineCreate.wallet.fields.description.label")}
          name="description"
          placeholder={t(
            "app.inlineCreate.wallet.fields.description.placeholder"
          )}
          rows={4}
        />
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <SelectField
              formReturn={form}
              label={t("app.inlineCreate.wallet.fields.walletType.label")}
              name="walletTypeId"
              placeholder={t(
                "app.inlineCreate.wallet.fields.walletType.placeholder"
              )}
              items={walletTypeItems}
            />
          </div>
          <CreateWalletTypeSheet
            onCreated={(walletType) => {
              form.setValue("walletTypeId", walletType.id, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
          />
        </div>
        <InputField
          formReturn={form}
          label={t("app.inlineCreate.wallet.fields.amount.label")}
          name="amount"
          type="number"
          step="0.01"
          placeholder={t("app.inlineCreate.wallet.fields.amount.placeholder")}
        />
        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {t("app.inlineCreate.wallet.actions.create")}
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
          <Button type="button" variant="link" onClick={onClose}>
            {t("app.forms.common.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export const CreateExpenseCategorySheet: FunctionComponent<
  CreateSheetProps<ExpenseCategory>
> = ({ onCreated }) => {
  const t = useI18n()

  return (
    <EntitySheetButton
      buttonLabel={t("app.inlineCreate.expenseCategory.button")}
      title={t("app.inlineCreate.expenseCategory.title")}
      description={t("app.inlineCreate.expenseCategory.description")}
    >
      {({ close }) => (
        <CreateExpenseCategoryForm onCreated={onCreated} onClose={close} />
      )}
    </EntitySheetButton>
  )
}

export const CreateIncomeCategorySheet: FunctionComponent<
  CreateSheetProps<IncomeCategory>
> = ({ onCreated }) => {
  const t = useI18n()

  return (
    <EntitySheetButton
      buttonLabel={t("app.inlineCreate.incomeCategory.button")}
      title={t("app.inlineCreate.incomeCategory.title")}
      description={t("app.inlineCreate.incomeCategory.description")}
    >
      {({ close }) => (
        <CreateIncomeCategoryForm onCreated={onCreated} onClose={close} />
      )}
    </EntitySheetButton>
  )
}

export const CreateContactSheet: FunctionComponent<
  CreateSheetProps<Contact>
> = ({ onCreated }) => {
  const t = useI18n()

  return (
    <EntitySheetButton
      buttonLabel={t("app.inlineCreate.contact.button")}
      title={t("app.inlineCreate.contact.title")}
      description={t("app.inlineCreate.contact.description")}
    >
      {({ close }) => (
        <CreateContactForm onCreated={onCreated} onClose={close} />
      )}
    </EntitySheetButton>
  )
}

export const CreateWalletTypeSheet: FunctionComponent<
  CreateSheetProps<WalletType>
> = ({ onCreated }) => {
  const t = useI18n()

  return (
    <EntitySheetButton
      buttonLabel={t("app.inlineCreate.walletType.button")}
      title={t("app.inlineCreate.walletType.title")}
      description={t("app.inlineCreate.walletType.description")}
    >
      {({ close }) => (
        <CreateWalletTypeForm onCreated={onCreated} onClose={close} />
      )}
    </EntitySheetButton>
  )
}

export const CreateWalletSheet: FunctionComponent<CreateSheetProps<Wallet>> = ({
  onCreated,
}) => {
  const t = useI18n()

  return (
    <EntitySheetButton
      buttonLabel={t("app.inlineCreate.wallet.button")}
      title={t("app.inlineCreate.wallet.title")}
      description={t("app.inlineCreate.wallet.description")}
    >
      {({ close }) => (
        <CreateWalletForm onCreated={onCreated} onClose={close} />
      )}
    </EntitySheetButton>
  )
}
