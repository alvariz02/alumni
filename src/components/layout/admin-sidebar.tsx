"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Mail,
  FileSpreadsheet,
  Settings,
  Shield,
  Bell,
  Search,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Award,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { useTheme } from "@/contexts/theme-context"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kelola Alumni",
    href: "/admin/alumni",
    icon: Users,
  },
  {
    title: "Karier & Prestasi",
    href: "/admin/karier",
    icon: Briefcase,
  },
  {
    title: "Testimoni",
    href: "/admin/testimoni",
    icon: MessageSquare,
  },
  {
    title: "Broadcast Email",
    href: "/admin/broadcast",
    icon: Mail,
  },
  {
    title: "Export Data",
    href: "/admin/export",
    icon: FileSpreadsheet,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: { collapsed: boolean; setCollapsed: (value: boolean) => void; mobileOpen?: boolean; setMobileOpen?: (value: boolean) => void }) {
  const pathname = usePathname()
  const { theme } = useTheme()

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={cn(
        "flex h-16 items-center justify-between px-4 border-b",
        theme === "dark" ? "border-slate-700" : "border-gray-200"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-lg bg-blue-600 p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              "text-base font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Admin
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "transition-colors hidden md:flex",
            theme === "dark"
              ? "text-slate-400 hover:text-white hover:bg-slate-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen?.(false)}
          className={cn(
            "transition-colors md:hidden",
            theme === "dark"
              ? "text-slate-400 hover:text-white hover:bg-slate-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                  : theme === "dark"
                    ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t p-4",
        theme === "dark" ? "border-slate-700" : "border-gray-200"
      )}>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full justify-start transition-colors text-sm",
            theme === "dark"
              ? "text-slate-300 hover:bg-slate-700 hover:text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-40 flex-col h-screen transition-all duration-300",
          theme === "dark"
            ? "bg-slate-800 border-r border-slate-700"
            : "bg-white border-r border-gray-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 md:hidden">
          <SheetTitle className="sr-only">Menu Admin</SheetTitle>
          <div className={cn(
            "h-full flex flex-col",
            theme === "dark"
              ? "bg-slate-800"
              : "bg-white"
          )}>
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
