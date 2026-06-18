
"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { MOCK_USER } from "@/lib/mock-data"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between min-w-0">
               <div className="flex flex-col text-left overflow-hidden">
                  <h1 className="text-xs md:text-sm font-semibold tracking-tight uppercase tracking-widest font-headline truncate">SmartERP AI</h1>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase truncate">ID: {MOCK_USER.tenantId}</p>
               </div>
               <div className="flex items-center gap-2 px-2 md:px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <span className="size-1.5 md:size-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-bold text-accent uppercase tracking-wider">AI Assistant Online</span>
               </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
