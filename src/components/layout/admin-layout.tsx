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
  const { theme } = useTheme()

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark" ? "bg-slate-900" : "bg-gray-50"
    )}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AdminHeader collapsed={collapsed} />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          collapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
