"use client"
import { useI18n } from "@/lib/i18n/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@bee-budget/ui/breadcrumb"
import { Button } from "@bee-budget/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@bee-budget/ui/input-group"
import { Separator } from "@bee-budget/ui/separator"
import { SidebarTrigger } from "@bee-budget/ui/sidebar"
import { Bell, MessageSquare, Search } from "lucide-react"
import Link from "next/link"
import React, { FunctionComponent } from "react"
import { ModeToggle } from "./theme-toggle-button"
export type AppHeaderProps = {
  path: { href: string; label: string }[]
  title: string
}

export const AppHeader: FunctionComponent<AppHeaderProps> = ({ path, title }) => {
  const t = useI18n()

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b p-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <div className="flex flex-col">
          <Breadcrumb>
            <BreadcrumbList>
              {path.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {path.length - 1 === index ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="font-semibold md:text-lg">{title}</h2>
        </div>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <InputGroup>
          <InputGroupInput placeholder={t("app.header.search.placeholder")} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button variant="outline" size="icon">
          <Bell />
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare />
        </Button>
        <ModeToggle />
        <Separator orientation="vertical" />
        <Button variant="outline" asChild>
          <Link
            target="_blank"
            href="https://github.com/jeansamist/templates/tree/main/nextjs/hr-saas-1"
          >
            {t("app.header.openGithub")}
          </Link>
        </Button>
      </div>
    </header>
  )
}
