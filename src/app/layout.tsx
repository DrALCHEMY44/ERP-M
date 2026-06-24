
"use client"

import * as React from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { usePathname, useRouter } from "next/navigation";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { LanguageProvider } from "@/components/language-provider";
import { RotateCw, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth, AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { user, loading: authLoading, profile } = useAuth();

  const isAuthPage = ['/login', '/register', '/create-business', '/join-business'].includes(pathname);

  React.useEffect(() => {
    if (!authLoading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, authLoading, isAuthPage, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "System Synchronized",
        description: "Your workspace data has been re-synced with the latest cloud records.",
      });
    }, 800);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing SmartERP AI...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      {isAuthPage ? (
        <>
          {children}
          <Toaster />
        </>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                
                <div className="flex items-center gap-0.5 mr-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => window.history.back()}
                    title="Go Back"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => window.history.forward()}
                    title="Go Forward"
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 text-muted-foreground hover:text-primary transition-colors",
                      isRefreshing && "text-primary"
                    )}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Sync/Refresh Workspace"
                  >
                    {isRefreshing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <RotateCw className="size-4" />
                    )}
                  </Button>
                </div>
                
                <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
                
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                    Tenant: {profile?.tenantId || 'Syncing...'}
                  </span>
                  <span className="text-xs font-headline font-bold text-primary truncate max-w-[120px] md:max-w-none">
                    {profile?.fullName ? `SME Hub • ${profile.fullName.split(' ')[0]}` : 'SmartERP Workspace'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3">
                <Separator orientation="vertical" className="h-6" />
                <NotificationCenter />
                <Separator orientation="vertical" className="h-6 hidden md:block" />
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {profile?.fullName?.substring(0, 2).toUpperCase() || '??'}
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
      )}
    </LanguageProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="https://placehold.co/192x192/2563eb/white?text=ERP" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
