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

function AppContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { user, loading: authLoading, profile } = useAuth()
  const isAuthPage = ["/", "/login", "/register", "/create-business", "/join-business"].includes(pathname)

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

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing SmartERP AI…</p>
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
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-card/50 px-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="mr-2 flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" onClick={() => window.history.back()} title="Go back" aria-label="Go back">
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" onClick={() => window.history.forward()} title="Go forward" aria-label="Go forward">
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("size-8 text-muted-foreground hover:text-primary", isRefreshing && "text-primary")}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Refresh workspace"
                    aria-label="Refresh workspace"
                  >
                    {isRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />}
                  </Button>
                </div>
                <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-[9px] font-bold uppercase tracking-widest text-muted-foreground md:text-[10px]">
                    Tenant: {profile?.businessCode || profile?.tenantId || "Syncing…"}
                  </span>
                  <span className="max-w-[120px] truncate text-xs font-bold text-primary md:max-w-none">
                    {profile?.fullName ? `SME Hub • ${profile.fullName.split(" ")[0]}` : "SmartERP Workspace"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Separator orientation="vertical" className="h-6" />
                <NotificationCenter />
                <Separator orientation="vertical" className="hidden h-6 md:block" />
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                  {profile?.fullName?.substring(0, 2).toUpperCase() || "??"}
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
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
