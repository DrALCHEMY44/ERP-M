import type { Metadata, Viewport } from "next"

import { AppShell } from "@/components/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "SmartERP AI",
    template: "%s | SmartERP AI",
  },
  description: "Secure ERP, reporting, inventory, finance, workforce, and AI tools for SMEs in Cameroon.",
  applicationName: "SmartERP AI",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
