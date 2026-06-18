
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
import Head from "next/head";

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
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">Tenant: Douala_001</span>
                <span className="text-xs font-headline font-bold text-primary truncate max-w-[120px] md:max-w-none">Superette de l'Avenir</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <NotificationCenter />
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                JK
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="https://placehold.co/192x192/2563eb/white?text=ERP" />
      </Head>
      <LanguageProvider>
        {content}
      </LanguageProvider>
    </html>
  );
}
