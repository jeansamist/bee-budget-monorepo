/* eslint-disable @next/next/no-img-element */
"use client"
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
import {
  ArrowUpDown,
  BarChart2,
  Box,
  FileText,
  HelpCircle,
  Home,
  LucideIcon,
  Plug,
  Settings,
  Wallet,
} from "lucide-react"
import { FunctionComponent, useMemo } from "react"

export type AppSidebarProps = {
  user: {
    avatarUrl: string
    name: string
    jobTitle: string
  }
}

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

export const AppSidebar: FunctionComponent<AppSidebarProps> = ({ user }) => {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const sections = useMemo<AppSidebarSection[]>(
    () => [
      {
        title: t("generalMenu"),
        links: [
          {
            label: "Dashboard",
            href: "/#dashboard",
            icon: Home,
            isActive: true,
          },

          {
            label: "Transactions",
            href: "/#transactions",
            icon: ArrowUpDown,
          },
          {
            label: "Wallets",
            href: "/#wallets",
            icon: Wallet,
          },
        ],
      },
      {
        title: "ANALYTICS",
        links: [
          {
            label: "Analytics",
            href: "/#analytics",
            icon: BarChart2,
            isBeta: true,
          },
          {
            label: "Reports",
            href: "/#reports",
            icon: FileText,
            isInDev: true,
          },
        ],
      },
      {
        title: "CATEGORIES & TYPES",
        links: [
          { label: "Wallets types", href: "/#wallet-types", icon: Wallet },
          { label: "Transactions categories", href: "/#categories", icon: Box },
        ],
      },
      {
        title: "SUPPORT",
        links: [
          { label: "Settings", href: "/#settings", icon: Settings },
          { label: "Integration", href: "/#integration", icon: Plug },
        ],
      },
    ],
    []
  )

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Box className="mx-auto" size={20} />
          </div>
          <h3 className="font-semibold">Jeansamist</h3>
        </div>
        <div className="flex cursor-pointer items-center gap-2 rounded-2xl border bg-background p-1 transition-colors hover:border-primary">
          <img
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            className="flex aspect-square w-10 items-center justify-center rounded-xl bg-muted text-primary-foreground"
          />
          <div>
            <h3 className="text-sm font-semibold">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.jobTitle}</p>
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
                      <a href={link.href}>
                        <SectionIcon />
                        <span>{link.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {link.isBeta && (
                      <Badge
                        className="mr-1 bg-primary/15 text-primary!"
                        asChild
                      >
                        <SidebarMenuBadge>BETA</SidebarMenuBadge>
                      </Badge>
                    )}
                    {link.isInDev && (
                      <Badge
                        className="mr-1 bg-muted text-muted-foreground"
                        asChild
                      >
                        <SidebarMenuBadge>SOON</SidebarMenuBadge>
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
              <h3 className="font-semibold">Help & Support</h3>
              <p className="text-sm text-muted-foreground">
                Typical reply: 4mins
              </p>
            </div>
            <Button
              variant={"outline"}
              className="w-full text-primary"
              size={"lg"}
            >
              Go to help center
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  )
}
