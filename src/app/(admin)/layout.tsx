"use client"

import { AdminLayout as AdminPanelLayout } from "@/components/layout/admin-layout"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/contexts/theme-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </ThemeProvider>
    </SessionProvider>
  )
}
