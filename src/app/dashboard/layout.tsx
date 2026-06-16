import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
             <div className="flex flex-col">
                <h1 className="text-sm font-semibold tracking-tight">KoboCore Dashboard</h1>
                <p className="text-[10px] text-muted-foreground">Tenant: Douala - Superette de l'Avenir</p>
             </div>
             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="size-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">AI Assistant Online</span>
             </div>
          </div>
        </header>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
