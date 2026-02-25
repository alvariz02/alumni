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
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

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

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (value: boolean) => void }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const [internalOpenMobile, setInternalOpenMobile] = useState(false)
  const openMobile = mobileOpen !== undefined ? mobileOpen : internalOpenMobile
  const setOpenMobile = setMobileOpen !== undefined ? setMobileOpen : setInternalOpenMobile

  const getNavItems = () => {
    if (pathname.startsWith("/admin")) return adminNavItems
    if (pathname.startsWith("/analytics")) return pimpinanNavItems
    return alumniNavItems
  }

  const navItems = getNavItems()
  const role = pathname.startsWith("/admin") ? "ADMIN" : pathname.startsWith("/analytics") ? "PIMPINAN" : "ALUMNI"

  const sidebarContent = (
    <>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-900" />
              <span className="font-bold text-sm sm:text-base text-blue-900">AlumniKu</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hidden md:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            className="h-8 w-8 md:hidden"
          >
            <X className="h-4 w-4" />
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
                    onClick={() => setOpenMobile(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
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
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
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
              "w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm",
              collapsed && "justify-center"
            )}
            onClick={() => {
              localStorage.removeItem("alumni_user")
              localStorage.removeItem("alumni_session")
              window.location.href = "/login"
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Sheet/Drawer */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-64 p-0 md:hidden">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
