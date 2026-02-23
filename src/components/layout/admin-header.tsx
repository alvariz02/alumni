"use client"

import { Bell, Search, User, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"

interface AdminHeaderProps {
  collapsed?: boolean
}

export function AdminHeader({ collapsed }: AdminHeaderProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Search alumni
      const alumniResponse = await fetch(`/api/admin/alumni?search=${query}&limit=5`, {
        headers: {
          "Cookie": document.cookie
        }
      })
      
      if (alumniResponse.ok) {
        const alumniData = await alumniResponse.json()
        const results = alumniData.alumni.map((alumni: any) => ({
          type: 'alumni',
          id: alumni.id,
          title: alumni.nama,
          subtitle: `${alumni.nim} - ${alumni.jurusan}`,
          href: `/admin/alumni`,
          icon: '👤'
        }))
        setSearchResults(results)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: any) => {
    setSearchQuery("")
    setSearchResults([])
    router.push(result.href)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([])
        setSearchQuery("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-30 h-16 transition-colors duration-300",
      theme === "dark" 
        ? "bg-slate-900 border-b border-slate-700" 
        : "bg-white border-b border-gray-200 shadow-sm"
    )}>
      <div className="flex h-full items-center justify-between px-4">
        <div className={cn(
          "flex items-center gap-4 transition-all duration-300",
          collapsed ? "flex-1" : "flex-1 ml-64"
        )}>
          <div className={cn(
            "relative transition-all duration-300",
            collapsed ? "max-w-lg flex-1" : "max-w-md flex-1"
          )} ref={searchContainerRef}>
            <Search className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
              theme === "dark" ? "text-slate-400" : "text-gray-400"
            )} />
            <Input
              placeholder="Search alumni, data, or settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 transition-colors",
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:ring-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              )}
            />
            
            {/* Search Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className={cn(
                "absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto",
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
              )}>
                {isSearching ? (
                  <div className={cn(
                    "p-4 text-center",
                    theme === "dark" ? "text-slate-400" : "text-gray-500"
                  )}>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "p-3 cursor-pointer transition-colors border-b last:border-b-0",
                        theme === "dark"
                          ? "hover:bg-slate-700 border-slate-700"
                          : "hover:bg-gray-50 border-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{result.icon}</span>
                        <div className="flex-1">
                          <div className={cn(
                            "font-medium",
                            theme === "dark" ? "text-white" : "text-gray-900"
                          )}>
                            {result.title}
                          </div>
                          <div className={cn(
                            "text-sm",
                            theme === "dark" ? "text-slate-400" : "text-gray-500"
                          )}>
                            {result.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className={cn(
                    "p-4 text-center",
                    theme === "dark" ? "text-slate-400" : "text-gray-500"
                  )}>
                    No results found
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "transition-colors",
              theme === "dark" 
                ? "text-slate-400 hover:text-white hover:bg-slate-700" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "relative transition-colors",
              theme === "dark" 
                ? "text-slate-400 hover:text-white hover:bg-slate-700" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-3 w-3 bg-red-500" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className={cn(
                "text-sm font-medium",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                Administrator
              </p>
              <p className={cn(
                "text-xs",
                theme === "dark" ? "text-slate-400" : "text-gray-500"
              )}>
                System Admin
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className={cn(
                "transition-colors",
                theme === "dark" 
                  ? "text-slate-400 hover:text-white hover:bg-slate-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
