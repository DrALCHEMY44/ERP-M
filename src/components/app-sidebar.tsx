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
  ShieldCheck
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
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"
import { usePathname } from "next/navigation"

const groups = [
  {
    label: "Core",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "AI Assistant", icon: Sparkles, href: "/ai-assistant", accent: true },
    ]
  },
  {
    label: "Operations",
    items: [
      { name: "Inventory", icon: Package, href: "/inventory" },
      { name: "Sales", icon: ShoppingCart, href: "/sales" },
      { name: "Expenses", icon: Receipt, href: "/expenses" },
      { name: "Finance", icon: BarChart3, href: "/finance" },
    ]
  },
  {
    label: "Management",
    items: [
      { name: "Tasks", icon: Briefcase, href: "/tasks" },
      { name: "Employees", icon: Users, href: "/employees" },
      { name: "Customers", icon: UserCircle, href: "/customers" },
      { name: "Suppliers", icon: Truck, href: "/suppliers" },
    ]
  },
  {
    label: "Administration",
    items: [
      { name: "Documents", icon: FileText, href: "/documents" },
      { name: "Reports", icon: PieChart, href: "/reports" },
      { name: "Activity Logs", icon: History, href: "/activity-logs" },
      { name: "Users", icon: ShieldCheck, href: "/user-management" },
      { name: "Settings", icon: Settings, href: "/settings" },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

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
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">SME Hub</span>
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">JK</AvatarFallback>
              </Avatar>
              {state !== "collapsed" && (
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium truncate text-white">{MOCK_USER.fullName}</span>
                  <span className="text-[10px] text-muted-foreground truncate uppercase">{MOCK_USER.role}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link href="/business-profile">
              <DropdownMenuItem className="cursor-pointer">Business Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
