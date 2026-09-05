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
  BarChart3,
  Sparkles,
  UserCircle,
  Truck,
  FileText,
  PieChart,
  History,
  ShieldCheck,
  Globe,
  Loader2,
  Megaphone,
  CalendarCheck,
  WalletCards,
  BookOpenCheck,
  ChevronsUpDown,
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
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { authClient } from "@/lib/auth/client"
import { useAuth } from "@/hooks/use-auth"
import { canAccessRoute } from "@/lib/client-access"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const { t, language, setLanguage } = useTranslation()
  const { profile, loading: authLoading } = useAuth()
  const expanded = state !== "collapsed" || isMobile
  const initials = profile?.fullName?.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join("").toUpperCase() || "ME"
  const closeMobileNavigation = () => setOpenMobile(false)

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  const canOpen = (href: string) => canAccessRoute(href, profile?.role)
  const groups = [
    {
      label: "Platform Administration",
      items: [
        { name: "SaaS Dashboard", icon: ShieldCheck, href: "/admin/dashboard" },
        { name: "Platform Users", icon: Users, href: "/admin/users" },
      ]
    },
    {
      label: t('sidebar.core'),
      items: [
        { name: t('common.dashboard'), icon: LayoutDashboard, href: "/dashboard" },
        { name: t('common.aiAssistant'), icon: Sparkles, href: "/ai-assistant" },
      ]
    },
    {
      label: t('sidebar.ops'),
      items: [
        { name: t('common.inventory'), icon: Package, href: "/inventory" },
        { name: t('common.sales'), icon: ShoppingCart, href: "/sales" },
        { name: t('common.expenses'), icon: Receipt, href: "/expenses" },
        { name: t('common.finance'), icon: BarChart3, href: "/finance" },
        { name: "Accounting", icon: BookOpenCheck, href: "/accounting" },
      ]
    },
    {
      label: t('sidebar.mgmt'),
      items: [
        { name: t('common.tasks'), icon: Briefcase, href: "/tasks" },
        { name: "Announcements", icon: Megaphone, href: "/announcements" },
        { name: t('common.employees'), icon: Users, href: "/employees" },
        { name: "HR Operations", icon: CalendarCheck, href: "/hr" },
        { name: "Payroll", icon: WalletCards, href: "/payroll" },
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
  ].map((group) => ({ ...group, items: group.items.filter((item) => canOpen(item.href)) }))
    .filter((group) => group.items.length > 0)

  if (authLoading) {
    return (
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarContent className="flex items-center justify-center" role="status">
          <Loader2 className="size-5 animate-spin text-sidebar-foreground" aria-hidden="true" />
          <span className="sr-only">Loading navigation</span>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-[76px] shrink-0 justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-3">
        <Link href={profile?.role === "Platform Super Admin" ? "/admin/dashboard" : "/dashboard"} onClick={closeMobileNavigation} className="flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-sidebar-ring" aria-label="SmartERP home">
          {!expanded && <span className="text-sm font-semibold text-white">ERP</span>}
          {expanded && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate font-headline text-lg font-semibold tracking-tight text-white">SmartERP<span className="ml-1 text-blue-300">AI</span></span>
              <span className="truncate text-xs text-slate-400">{t('sidebar.smeHub')}</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-3">
        <nav aria-label="Workspace navigation">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="px-3 py-2">
            <SidebarGroupLabel className="mb-1 h-7 px-3 text-xs font-medium text-slate-400">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className={cn(
                        "h-11 gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-3",
                        "data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-[inset_3px_0_0_#93b4ff]",
                      )}
                    >
                      <Link href={item.href} onClick={closeMobileNavigation} aria-current={active ? "page" : undefined}>
                        <item.icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="shrink-0 border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="Account and language options" className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:p-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-sm font-semibold text-white">
                {initials}
              </div>
              {expanded && (
                <>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-white">{profile?.fullName || 'Your account'}</span>
                    <span className="truncate text-xs text-slate-400">{profile?.role || 'Member'}</span>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5" side={isMobile ? "top" : "right"} sideOffset={12}>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
              <Globe className="size-4" />
              <span>{language === 'en' ? 'Français' : 'English'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {canOpen("/business-profile") && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/business-profile" onClick={closeMobileNavigation}>{t('common.profile')}</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>{t('common.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
