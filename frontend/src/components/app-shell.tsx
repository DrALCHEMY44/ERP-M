"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, RotateCw } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { LanguageProvider } from "@/components/language-provider"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { canAccessRoute } from "@/lib/client-access"

const pageNames: Record<string, string> = {
  "/admin/dashboard": "Platform overview",
  "/admin/users": "Platform users",
  "/dashboard": "Overview",
  "/inventory": "Inventory",
  "/sales": "Sales",
  "/expenses": "Expenses",
  "/finance": "Finance",
  "/accounting": "Accounting",
  "/tasks": "Tasks",
  "/announcements": "Announcements",
  "/employees": "Team members",
  "/hr": "HR operations",
  "/payroll": "Payroll",
  "/customers": "Customers",
  "/suppliers": "Suppliers",
  "/reports": "Reports",
  "/documents": "Documents",
  "/activity-logs": "Activity log",
  "/settings": "Settings",
  "/business-profile": "Business profile",
  "/ai-assistant": "AI assistant",
}

function AppContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { user, loading: authLoading, profile } = useAuth()
  const isAuthPage = ["/", "/login", "/register", "/reset-password", "/create-business", "/join-business"].includes(pathname)
  const pageTitle = Object.entries(pageNames).find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1] || "Workspace"
  const initials = profile?.fullName?.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join("").toUpperCase() || "ME"

  React.useEffect(() => {
    if (authLoading) return
    if (!user && !isAuthPage) {
      router.replace("/login")
      return
    }
    if (!user) return
    const hasCompleteProfile = Boolean(profile?.tenantId && profile?.businessId)
    if (!hasCompleteProfile && pathname !== "/register") {
      router.replace("/register")
    } else if (hasCompleteProfile && !isAuthPage && !canAccessRoute(pathname, profile?.role)) {
      router.replace(profile?.role === "Platform Super Admin" ? "/admin/dashboard" : "/dashboard")
    } else if (hasCompleteProfile && isAuthPage && pathname !== "/") {
      router.replace("/dashboard")
    }
  }, [user, profile, authLoading, isAuthPage, pathname, router])

  React.useEffect(() => {
    const showToast = sessionStorage.getItem("show_refresh_toast")
    if (showToast !== "true") return
    sessionStorage.removeItem("show_refresh_toast")
    toast({
      title: "System synchronized",
      description: "Your workspace has reloaded the latest cloud records.",
    })
  }, [toast])

  const handleRefresh = () => {
    setIsRefreshing(true)
    sessionStorage.setItem("show_refresh_toast", "true")
    window.location.reload()
  }

  // Public entry and authentication pages should render immediately while the
  // session check runs in the background. Only protected workspace routes need
  // to block on authentication/profile resolution.
  if (authLoading && !isAuthPage) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6" role="status" aria-live="polite">
        <div className="flex max-w-sm flex-col items-center text-center">
          <p className="text-xl font-semibold tracking-tight">Opening your workspace</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Getting your account and business ready.</p>
          <Loader2 className="mt-6 size-5 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      {isAuthPage ? (
        <>
          {children}
          <Toaster />
        </>
      ) : (
        <SidebarProvider defaultOpen>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-card/95 px-3 backdrop-blur-md sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="text-muted-foreground" />
                <Separator orientation="vertical" className="hidden h-7 sm:block" />
                <div className="min-w-0">
                  <p className="truncate text-xs leading-relaxed text-muted-foreground">
                    {profile?.role === "Platform Super Admin" ? "Platform administration" : "Business workspace"}
                  </p>
                  <p className="truncate text-sm font-semibold sm:text-base">{pageTitle}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <div className="hidden items-center lg:flex">
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => window.history.back()} title="Go back" aria-label="Go back">
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => window.history.forward()} title="Go forward" aria-label="Go forward">
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("text-muted-foreground", isRefreshing && "text-primary")}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh workspace"
                  aria-label={isRefreshing ? "Refreshing workspace" : "Refresh workspace"}
                >
                  {isRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />}
                </Button>
                <NotificationCenter />
                <Separator orientation="vertical" className="mx-2 hidden h-8 sm:block" />
                <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-sm font-semibold text-primary sm:flex" title={profile?.fullName || "Your account"}>
                  {initials}
                </div>
              </div>
            </header>
            <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 scroll-mt-24 px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      )}
    </LanguageProvider>
  )
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  )
}
