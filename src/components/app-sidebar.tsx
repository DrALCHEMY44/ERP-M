
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  Users,
  Briefcase,
  Settings,
  Building2,
  BarChart3,
  Sparkles,
  UserCircle,
  Truck,
  FileText,
  PieChart,
  History,
  Languages,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/avatar"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/components/language-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { t, language, setLanguage } = useTranslation()

  const groups = [
    {
      label: t('sidebar.core'),
      items: [
        { name: t('common.dashboard'), icon: LayoutDashboard, href: "/dashboard" },
        { name: t('common.aiAssistant'), icon: Sparkles, href: "/ai-assistant", accent: true },
      ]
    },
    {
      label: t('sidebar.ops'),
      items: [
        { name: t('common.inventory'), icon: Package, href: "/inventory" },
        { name: t('common.sales'), icon: ShoppingCart, href: "/sales" },
        { name: t('common.expenses'), icon: Receipt, href: "/expenses" },
        { name: t('common.finance'), icon: BarChart3, href: "/finance" },
      ]
    },
    {
      label: t('sidebar.mgmt'),
      items: [
        { name: t('common.tasks'), icon: Briefcase, href: "/tasks" },
        { name: t('common.employees'), icon: Users, href: "/employees" },
        { name: t('common.customers'), icon: UserCircle, href: "/customers" },
        { name: t('common.suppliers'), icon: Truck, href: "/suppliers" },
      ]
    },
    {
      label: t('sidebar.admin'),
      items: [
        { name: t('common.reports'), icon: PieChart, href: "/reports" },
        { name: t('common.documents'), icon: FileText, href: "/documents" },
        { name: t('common.activityLogs'), icon: History, href: "/activity-logs" },
        { name: t('common.settings'), icon: Settings, href: "/settings" },
      ]
    }
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-headline font-bold text-sm text-white uppercase tracking-tighter">SmartERP AI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('sidebar.smeHub')}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest opacity-50 px-4 mb-2 text-white">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.name}
                      className={item.accent ? "text-primary font-bold bg-primary/5" : ""}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full text-left outline-none">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {MOCK_USER.fullName.substring(0, 2).toUpperCase()}
              </div>
              {state !== "collapsed" && (
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium truncate text-white">{MOCK_USER.fullName}</span>
                  <span className="text-[10px] text-muted-foreground truncate uppercase">{MOCK_USER.role}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
              <Languages className="size-4" />
              <span>{language === 'en' ? 'Français' : 'English'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/business-profile">
              <DropdownMenuItem className="cursor-pointer">{t('common.profile')}</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer text-destructive">{t('common.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
