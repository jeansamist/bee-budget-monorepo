/* eslint-disable @next/next/no-img-element */
"use client"
import { useAuth } from "@/contexts/auth.context"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import { Badge } from "@bee-budget/ui/badge"
import { Button } from "@bee-budget/ui/button"
import { Card, CardContent } from "@bee-budget/ui/card"
import { Separator } from "@bee-budget/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bee-budget/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpDown,
  BarChart2,
  Box,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LucideIcon,
  Plug,
  Settings,
  Wallet,
} from "lucide-react"
import { FunctionComponent, useCallback, useMemo } from "react"

type AppSidebarLink = {
  label: string
  href: string
  notifications?: number
  icon: LucideIcon
  isBeta?: boolean
  isActive?: boolean
  isInDev?: boolean
}

type AppSidebarSection = {
  title: string
  links: AppSidebarLink[]
}

export const AppSidebar: FunctionComponent = ({}) => {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const { user } = useAuth()
  const pathname = usePathname()

  const isLinkActive = useCallback(
    (href: string) => {
      if (!href.startsWith("/")) return false
      if (href.includes("#")) return false
      return pathname === href
    },
    [pathname]
  )

  const sections = useMemo<AppSidebarSection[]>(
    () => [
      {
        title: t("app.sidebar.generalMenu.title"),
        links: [
          {
            label: t("app.sidebar.links.dashboard"),
            href: currentLocaleUrl("/app/dashboard"),
            icon: Home,
            isActive: isLinkActive(currentLocaleUrl("/app/dashboard")),
          },

          {
            label: t("app.sidebar.links.transactions"),
            href: currentLocaleUrl("/app/transactions"),
            icon: ArrowUpDown,
            isActive: isLinkActive(currentLocaleUrl("/app/transactions")),
          },
          {
            label: t("app.sidebar.links.wallets"),
            href: "/#wallets",
            icon: Wallet,
          },
        ],
      },
      {
        title: t("app.sidebar.analytics.title"),
        links: [
          {
            label: t("app.sidebar.links.analytics"),
            href: "/#analytics",
            icon: BarChart2,
            isBeta: true,
          },
          {
            label: t("app.sidebar.links.reports"),
            href: "/#reports",
            icon: FileText,
            isInDev: true,
          },
        ],
      },
      {
        title: t("app.sidebar.categoriesTypes.title"),
        links: [
          {
            label: t("app.sidebar.links.walletTypes"),
            href: "/#wallet-types",
            icon: Wallet,
          },
          {
            label: t("app.sidebar.links.transactionCategories"),
            href: "/#categories",
            icon: Box,
          },
        ],
      },
      {
        title: t("app.sidebar.support.title"),
        links: [
          {
            label: t("app.sidebar.links.settings"),
            href: "/#settings",
            icon: Settings,
          },
          {
            label: t("app.sidebar.links.integration"),
            href: "/#integration",
            icon: Plug,
          },
        ],
      },
    ],
    [currentLocaleUrl, isLinkActive, t]
  )

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <DollarSign className="mx-auto" size={20} />
          </div>
          <h3 className="font-semibold">BeeBudget</h3>
        </div>
        <div className="flex cursor-pointer items-center gap-2 rounded-2xl border bg-background p-1 transition-colors hover:border-primary">
          <img
            src={
              user!.avatar ??
              "https://tapback.co/api/avatar/" + user!.firstName.toLowerCase()
            }
            alt={`${user!.initials} avatar`}
            className="flex aspect-square w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary-foreground"
          />
          <div>
            <h3 className="text-sm font-semibold">
              {user!.firstName} {user!.lastName}
            </h3>
            <p className="text-xs text-muted-foreground">{user!.email}</p>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {section.links.map((link) => {
                const SectionIcon = link.icon
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={link.isActive}>
                      <Link href={link.href}>
                        <SectionIcon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {link.isBeta && (
                      <Badge
                        className="mr-1 bg-primary/15 text-primary!"
                        asChild
                      >
                        <SidebarMenuBadge>
                          {t("app.sidebar.badges.beta")}
                        </SidebarMenuBadge>
                      </Badge>
                    )}
                    {link.isInDev && (
                      <Badge
                        className="mr-1 bg-muted text-muted-foreground"
                        asChild
                      >
                        <SidebarMenuBadge>
                          {t("app.sidebar.badges.soon")}
                        </SidebarMenuBadge>
                      </Badge>
                    )}
                    {link.notifications && (
                      <Badge
                        variant={"outline"}
                        className="mr-1 bg-background"
                        asChild
                      >
                        <SidebarMenuBadge>
                          {link.notifications.toString().padStart(2, "0")}
                        </SidebarMenuBadge>
                      </Badge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Card>
          <CardContent className="flex flex-col items-center space-y-4 text-center">
            <Button variant={"outline"} size={"icon-lg"}>
              <HelpCircle />
            </Button>
            <div>
              <h3 className="font-semibold">{t("app.sidebar.help.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("app.sidebar.help.description")}
              </p>
            </div>
            <Button
              variant={"outline"}
              className="w-full text-primary"
              size={"lg"}
            >
              {t("app.sidebar.help.button")}
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  )
}
