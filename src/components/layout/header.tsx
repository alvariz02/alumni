"use client"

import { Bell, Search, Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface HeaderProps {
  collapsed?: boolean
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export function Header({ collapsed = false, onMenuClick, showMobileMenu = false }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header
      className={cn(
        "fixed top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-3 sm:px-4 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 right-0",
        "left-0 md:left-64 md:transition-all duration-300",
        collapsed && "md:left-16"
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden mr-2"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
        {/* Search */}
        <div className="relative w-full max-w-[200px] sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 flex-shrink-0" />
          <Input
            type="search"
            placeholder="Cari..."
            className="w-full pl-9 pr-3 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
            <div className="p-4">
              <p className="font-medium text-sm sm:text-base">Notifikasi</p>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Belum ada notifikasi baru
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-900 text-white text-sm">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <a href="/profile" className="text-sm">Profil Saya</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="/settings" className="text-sm">Pengaturan</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
