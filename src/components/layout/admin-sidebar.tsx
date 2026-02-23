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

export function AdminSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300",
        theme === "dark"
          ? "bg-slate-800 border-r border-slate-700"
          : "bg-white border-r border-gray-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex h-16 items-center justify-between px-4 border-b",
        theme === "dark" ? "border-slate-700" : "border-gray-200"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              "text-lg font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Admin Panel
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "transition-colors",
            theme === "dark"
              ? "text-slate-400 hover:text-white hover:bg-slate-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                  : theme === "dark"
                    ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
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
            "w-full justify-start transition-colors",
            theme === "dark"
              ? "text-slate-300 hover:bg-slate-700 hover:text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
