
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  Users,
  Briefcase,
  FileText,
  MessageSquareQuote,
  History,
  Settings,
  ShieldCheck,
  Building2,
  ChevronDown,
  LogOut,
  UserCircle,
  BarChart3
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Inventory", icon: Package, href: "/inventory" },
  { name: "Sales", icon: ShoppingCart, href: "/sales" },
  { name: "AI Assistant", icon: MessageSquareQuote, href: "/ai-assistant", accent: true },
  { name: "Expenses", icon: Receipt, href: "/expenses" },
  { name: "Finance", icon: BarChart3, href: "/finance" },
  { name: "Employees", icon: Users, href: "/employees" },
  { name: "Customers", icon: UserCircle, href: "/customers" },
  { name: "Suppliers", icon: Building2, href: "/suppliers" },
  { name: "Tasks", icon: Briefcase, href: "/tasks" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Activity Logs", icon: History, href: "/activity-logs" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Building2 className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-headline font-bold text-sm tracking-tight text-white uppercase">SmartERP AI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">SME Resource Hub</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50 px-4 py-2 text-[10px] uppercase font-bold tracking-widest">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className={item.accent ? "text-accent font-semibold hover:bg-accent/10 data-[active=true]:bg-accent/20" : ""}
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
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full text-left outline-none group">
              <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border">
                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg font-bold">JK</AvatarFallback>
              </Avatar>
              {state !== "collapsed" && (
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium truncate text-white">{MOCK_USER.fullName}</span>
                  <span className="text-[10px] text-muted-foreground truncate uppercase">{MOCK_USER.role}</span>
                </div>
              )}
              {state !== "collapsed" && <ChevronDown className="size-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <UserCircle className="size-4" />
                Business Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="size-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
