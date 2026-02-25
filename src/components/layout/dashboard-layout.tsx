"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <Header 
        collapsed={collapsed} 
        onMenuClick={() => setMobileMenuOpen(true)}
        showMobileMenu={mobileMenuOpen}
      />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300 px-3 sm:px-4 md:px-6",
          "w-full md:left-0",
          collapsed && "md:pl-0",
          "md:w-auto md:pl-64",
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
