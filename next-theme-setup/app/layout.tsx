import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { ReduxProvider } from "@/lib/store/provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SupervIA - AI Infrastructure Monitoring",
  description: "AI-powered infrastructure monitoring platform with advanced analytics and predictive insights",
  keywords: ["infrastructure", "monitoring", "AI", "analytics", "DevOps", "observability"],
  authors: [{ name: "SupervIA Team" }],
  creator: "SupervIA",
  publisher: "SupervIA",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://supervia.com",
    title: "SupervIA - AI Infrastructure Monitoring",
    description: "Transform your infrastructure monitoring with intelligent AI insights and predictive analytics",
    siteName: "SupervIA",
  },
  twitter: {
    card: "summary_large_image",
    title: "SupervIA - AI Infrastructure Monitoring",
    description: "Transform your infrastructure monitoring with intelligent AI insights and predictive analytics",
    creator: "@supervia",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="supervia-theme"
          >
            <ReduxProvider>
              {children}
              <Toaster />
            </ReduxProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
