import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { MOCK_USER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: 'KoboCore ERP | AI-Powered Resource Management',
  description: 'An AI-powered Enterprise Resource Planning platform for SMEs in Cameroon.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-1 items-center justify-between">
                 <div className="flex flex-col text-left">
                    <h1 className="text-sm font-semibold tracking-tight">SmartERP AI</h1>
                    <p className="text-[10px] text-muted-foreground uppercase">Tenant: {MOCK_USER.tenantId}</p>
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
        <Toaster />
      </body>
    </html>
  );
}
