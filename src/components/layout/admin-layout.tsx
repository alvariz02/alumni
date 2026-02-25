"use client"

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminHeader } from "@/components/layout/admin-header"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark" ? "bg-slate-900" : "bg-gray-50"
    )}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <AdminHeader collapsed={collapsed} onMenuClick={() => setMobileMenuOpen(true)} />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300 px-3 sm:px-4 md:px-6",
          "w-full md:block",
          collapsed && "md:pl-0",
          "md:pl-64",
          collapsed && "md:pl-16"
        )}
      >
        <div className="max-w-7xl mx-auto py-4 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
