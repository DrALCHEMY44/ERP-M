
"use client"

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register', '/create-business', '/join-business'].includes(pathname);

  const content = isAuthPage ? (
    <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background`}>
      {children}
      <Toaster />
    </body>
  ) : (
    <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tenant: Douala_001</span>
                <span className="text-xs font-headline font-bold text-primary">Superette de l'Avenir</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Separator orientation="vertical" className="h-6" />
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                JK
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </body>
  );

  return (
    <html lang="en">
      <LanguageProvider>
        {content}
      </LanguageProvider>
    </html>
  );
}
