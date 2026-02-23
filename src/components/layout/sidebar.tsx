"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Briefcase,
  Network,
  MessageSquare,
  BarChart3,
  MapPin,
  LogOut,
  GraduationCap,
  FileSpreadsheet,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const alumniNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profil Saya", icon: UserCircle },
  { href: "/karier", label: "Data Karier", icon: Briefcase },
  { href: "/network", label: "Jaringan Alumni", icon: Network },
  { href: "/testimoni", label: "Testimoni", icon: MessageSquare },
]

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard Admin", icon: LayoutDashboard },
  { href: "/admin/alumni", label: "Kelola Alumni", icon: Users },
  { href: "/admin/testimoni", label: "Moderasi Testimoni", icon: MessageSquare },
  { href: "/admin/broadcast", label: "Kirim Email", icon: Mail },
  { href: "/admin/export", label: "Export Data", icon: FileSpreadsheet },
]

const pimpinanNavItems = [
  { href: "/analytics", label: "Dashboard Analytics", icon: BarChart3 },
  { href: "/analytics/sebaran", label: "Peta Sebaran", icon: MapPin },
  { href: "/analytics/karier", label: "Statistik Karier", icon: Briefcase },
  { href: "/analytics/keterserapan", label: "Keterserapan Kerja", icon: GraduationCap },
  { href: "/analytics/angkatan", label: "Tren Angkatan", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Determine role based on current path
  const getNavItems = () => {
    if (pathname.startsWith("/admin")) return adminNavItems
    if (pathname.startsWith("/analytics")) return pimpinanNavItems
    return alumniNavItems
  }

  const navItems = getNavItems()
  const role = pathname.startsWith("/admin") ? "ADMIN" : pathname.startsWith("/analytics") ? "PIMPINAN" : "ALUMNI"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-900" />
              <span className="font-bold text-blue-900">AlumniKu</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Quick Links for Admin/Pimpinan */}
          {(role === "ADMIN" || role === "PIMPINAN") && (
            <>
              {!collapsed && (
                <div className="mt-6 px-3 text-xs font-semibold uppercase text-slate-400">
                  Menu Alumni
                </div>
              )}
              <ul className="mt-2 space-y-1">
                {alumniNavItems.slice(0, 3).map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-900 text-white"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-2 dark:border-slate-800">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700",
              collapsed && "justify-center"
            )}
            onClick={() => {
              localStorage.removeItem("alumni_user")
              localStorage.removeItem("alumni_session")
              window.location.href = "/login"
            }}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Keluar</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
