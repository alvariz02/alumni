"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Briefcase,
  Building2,
  GraduationCap,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  Edit,
  Plus,
  BarChart3,
  DollarSign,
  Clock,
  Trash2,
  X,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CareerData {
  id: string
  alumniId: string
  alumni: {
    nama: string
    nim: string
    fakultas: string
    prodi: string
    angkatan: number
  }
  namaPerusahaan: string
  jabatan: string
  lokasi: string
  gaji: string
  rentangGaji: string
  tanggalMulai: string
  isCurrent: boolean
  status: string
  deskripsi?: string
  createdAt: string
}

interface CareerStats {
  totalCareers: number
  employedAlumni: number
  entrepreneurshipAlumni: number
  furtherStudyAlumni: number
  unemployedAlumni: number
  averageSalary: number
  topCompanies: Array<{
    name: string
    count: number
  }>
  careerByFakultas: Array<{
    fakultas: string
    employed: number
    total: number
  }>
}

export default function AdminKarierPage() {
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [careers, setCareers] = useState<CareerData[]>([])
  const [stats, setStats] = useState<CareerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCareer, setSelectedCareer] = useState<CareerData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleViewCareer = (careerId: string) => {
    const career = careers.find(c => c.id === careerId)
    if (career) {
      setSelectedCareer(career)
      setIsViewDialogOpen(true)
    }
  }

  const handleEditCareer = (careerId: string) => {
    const career = careers.find(c => c.id === careerId)
    if (career) {
      setSelectedCareer(career)
      setIsEditDialogOpen(true)
    }
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
    setSelectedCareer(null)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedCareer(null)
  }

  const handleSaveEdit = async (updatedCareer: Partial<CareerData>) => {
    if (!selectedCareer) return
    
    try {
      const response = await fetch(`/api/admin/karier`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": document.cookie
        },
        body: JSON.stringify({
          careerId: selectedCareer.id,
          ...updatedCareer
        })
      })
      
      if (response.ok) {
        console.log("Career updated successfully")
        fetchCareers() // Refresh data
        handleCloseEditDialog()
      } else {
        console.error("Failed to update career")
      }
    } catch (error) {
      console.error("Error updating career:", error)
    }
  }

  const handleDeleteCareer = async (careerId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data karier ini?")) {
      try {
        const response = await fetch(`/api/admin/karier`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Cookie": document.cookie
          },
          body: JSON.stringify({ careerId })
        })
        
        if (response.ok) {
          console.log("Career deleted successfully")
          fetchCareers() // Refresh data
          fetchStats()
        } else {
          console.error("Failed to delete career")
        }
      } catch (error) {
        console.error("Error deleting career:", error)
      }
    }
  }

  useEffect(() => {
    console.log("🔄 Karier Page - Status:", status, "Role:", session?.user?.role)
    
    const userRole = session?.user?.role
    if (status === "authenticated" && (userRole === "ADMIN" || userRole === "PIMPINAN")) {
      console.log("✅ Admin authenticated, fetching data...")
      fetchCareers()
      fetchStats()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting...")
      window.location.href = "/login"
    }
  }, [session, status, searchTerm, filterStatus])

  const fetchCareers = async () => {
    try {
      console.log("🔄 Starting fetchCareers...")
      setLoading(true)
      
      // Get session token and pass it in headers
      const response = await fetch(`/api/admin/karier?search=${encodeURIComponent(searchTerm)}&status=${filterStatus}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": document.cookie
        }
      })
      
      console.log("🔄 Response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("💼 Admin Career Data received:", data)
        setCareers(data.careers || [])
      } else {
        console.error("❌ Failed to fetch careers:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("❌ Error fetching careers:", error)
    } finally {
      console.log("🔄 Setting loading to false")
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      console.log("🔄 Starting fetchStats...")
      
      // Get session token and pass it in headers
      const response = await fetch("/api/admin/karier/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": document.cookie
        }
      })
      
      console.log("🔄 Stats response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("📈 Career Stats Data received:", data)
        setStats(data)
      } else {
        console.error("❌ Failed to fetch career stats:", response.status)
      }
    } catch (error) {
      console.error("❌ Error fetching career stats:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BEKERJA":
        return "bg-green-100 text-green-800"
      case "WIRAUSAHA":
        return "bg-blue-100 text-blue-800"
      case "STUDI_LANJUT":
        return "bg-purple-100 text-purple-800"
      case "BELUM_BEKERJA":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "BEKERJA":
        return <Briefcase className="h-4 w-4" />
      case "WIRAUSAHA":
        return <Building2 className="h-4 w-4" />
      case "STUDI_LANJUT":
        return <GraduationCap className="h-4 w-4" />
      case "BELUM_BEKERJA":
        return <Clock className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Briefcase className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-900">
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-900">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  
  const employmentRate = stats
    ? Math.round(((stats.employedAlumni + stats.entrepreneurshipAlumni) / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
        <h1 className="text-3xl font-bold">Manajemen Data Karier</h1>
        <p className="mt-2 text-blue-100">
          Pantau dan kelola data karier alumni
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Badge className="bg-white/20 text-white">
            <Briefcase className="mr-2 h-4 w-4" />
            {stats?.totalCareers || 0} Total Data Karier
          </Badge>
          <Badge className="bg-white/20 text-white">
            <TrendingUp className="mr-2 h-4 w-4" />
            {employmentRate}% Tingkat Keterserapan
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bekerja</CardTitle>
            <Briefcase className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.employedAlumni || 0}</div>
            <div className="mt-2">
              <Progress value={stats ? (stats.employedAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100 : 0} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">
                {stats ? Math.round((stats.employedAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100) : 0}% dari total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wirausaha</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.entrepreneurshipAlumni || 0}</div>
            <div className="mt-2">
              <Progress value={stats ? (stats.entrepreneurshipAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100 : 0} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">
                {stats ? Math.round((stats.entrepreneurshipAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100) : 0}% dari total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Studi Lanjut</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.furtherStudyAlumni || 0}</div>
            <div className="mt-2">
              <Progress value={stats ? (stats.furtherStudyAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100 : 0} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">
                {stats ? Math.round((stats.furtherStudyAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100) : 0}% dari total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mencari Kerja</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.unemployedAlumni || 0}</div>
            <div className="mt-2">
              <Progress value={stats ? (stats.unemployedAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100 : 0} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">
                {stats ? Math.round((stats.unemployedAlumni / (stats.employedAlumni + stats.entrepreneurshipAlumni + stats.furtherStudyAlumni + stats.unemployedAlumni)) * 100) : 0}% dari total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian Data Karier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama alumni, NIM, atau perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="BEKERJA">Bekerja</option>
              <option value="WIRAUSAHA">Wirausaha</option>
              <option value="STUDI_LANJUT">Studi Lanjut</option>
              <option value="BELUM_BEKERJA">Belum Bekerja</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Career Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            <Briefcase className="h-5 w-5" />
            Data Karier Alumni
          </CardTitle>
          <CardDescription className={cn(
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}>
            Daftar karier alumni terbaru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className={cn(
                "w-full border-collapse border",
                theme === "dark" ? "border-slate-700" : "border-gray-200"
              )}>
                <thead>
                  <tr className={cn(
                    theme === "dark" ? "bg-slate-800" : "bg-gray-50"
                  )}>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Alumni
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Status
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Perusahaan
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Jabatan
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Lokasi
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Gaji
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Tanggal Mulai
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Loading skeleton for career table
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700" : "border-gray-200"
                        )}>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          </div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700" : "border-gray-200"
                        )}>
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                        )}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                        )}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                        )}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                        )}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                        )}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </td>
                        <td className={cn(
                          "border px-4 py-2",
                          theme === "dark" ? "border-slate-700" : "border-gray-200"
                        )}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : careers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-400 py-8">
                        Tidak ada data karier yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    careers.map((career) => (
                    <tr 
                      key={career.id} 
                      className={cn(
                        theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"
                      )}
                    >
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700" : "border-gray-200"
                      )}>
                        <div>
                          <div className={cn(
                            "font-medium",
                            theme === "dark" ? "text-white" : "text-gray-900"
                          )}>
                            {career.alumni.nama}
                          </div>
                          <div className={cn(
                            "text-sm",
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          )}>
                            {career.alumni.nim}
                          </div>
                          <div className={cn(
                            "text-xs",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {career.alumni.fakultas}
                          </div>
                          <div className={cn(
                            "text-xs",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {career.alumni.prodi}
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700" : "border-gray-200"
                      )}>
                        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(career.status)}`}>
                          {getStatusIcon(career.status)}
                          {career.status.replace('_', ' ')}
                        </div>
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {career.namaPerusahaan}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {career.jabatan}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {career.lokasi}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {career.gaji}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {career.tanggalMulai}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700" : "border-gray-200"
                      )}>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-gray-300 hover:text-white hover:bg-slate-600" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            )}
                            onClick={() => handleViewCareer(career.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-gray-300 hover:text-white hover:bg-slate-600" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            )}
                            onClick={() => handleEditCareer(career.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-slate-600" : "text-red-600 hover:text-red-700 hover:bg-gray-100"
                            )}
                            onClick={() => handleDeleteCareer(career.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>

            {careers.length === 0 && !loading && (
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-slate-500">Tidak ada data karier yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/alumni">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Kelola Alumni</h3>
                <p className="text-sm text-slate-500">Update data alumni</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/export">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-green-100 p-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Export Laporan</h3>
                <p className="text-sm text-slate-500">Download data karier</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-slate-500">Analisis mendalam</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className={cn(
          "max-w-2xl",
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "flex items-center justify-between",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Detail Karier Alumni
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseViewDialog}
                className={cn(
                  theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCareer && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className={cn(
                      "font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      Informasi Alumni
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Nama:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.alumni.nama}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>NIM:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.alumni.nim}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Fakultas:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.alumni.fakultas}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Program Studi:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.alumni.prodi}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Angkatan:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.alumni.angkatan}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      Informasi Karier
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Status:</span>
                        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedCareer.status)}`}>
                          {getStatusIcon(selectedCareer.status)}
                          {selectedCareer.status.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Perusahaan:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.namaPerusahaan}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Jabatan:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.jabatan}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Lokasi:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.lokasi}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Gaji:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{selectedCareer.gaji}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>Tanggal Mulai:</span>
                        <p className={cn(
                          "font-medium",
                          theme === "dark" ? "text-white" : "text-gray-900"
                        )}>{new Date(selectedCareer.tanggalMulai).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedCareer.deskripsi && (
                  <div>
                    <h4 className={cn(
                      "font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      Deskripsi
                    </h4>
                    <p className={cn(
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}>
                      {selectedCareer.deskripsi}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={cn(
          "max-w-2xl",
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "flex items-center justify-between",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Edit Karier Alumni
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEditDialog}
                className={cn(
                  theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCareer && (
              <form onSubmit={(e) => {
                e.preventDefault()
                // Handle form submission
                handleSaveEdit(selectedCareer)
              }}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Status Karier
                      </label>
                      <select
                        value={selectedCareer.status}
                        onChange={(e) => setSelectedCareer({...selectedCareer, status: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="BEKERJA">Bekerja</option>
                        <option value="WIRAUSA">Wirausaha</option>
                        <option value="STUDI_LANJUT">Studi Lanjut</option>
                        <option value="BELUM_BEKERJA">Belum Bekerja</option>
                      </select>
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Perusahaan
                      </label>
                      <input
                        type="text"
                        value={selectedCareer.namaPerusahaan}
                        onChange={(e) => setSelectedCareer({...selectedCareer, namaPerusahaan: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={selectedCareer.jabatan}
                        onChange={(e) => setSelectedCareer({...selectedCareer, jabatan: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={selectedCareer.lokasi}
                        onChange={(e) => setSelectedCareer({...selectedCareer, lokasi: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Gaji
                      </label>
                      <input
                        type="text"
                        value={selectedCareer.gaji}
                        onChange={(e) => setSelectedCareer({...selectedCareer, gaji: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={selectedCareer.tanggalMulai}
                        onChange={(e) => setSelectedCareer({...selectedCareer, tanggalMulai: e.target.value})}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                  </div>
                  {selectedCareer.deskripsi && (
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        Deskripsi
                      </label>
                      <textarea
                        value={selectedCareer.deskripsi}
                        onChange={(e) => setSelectedCareer({...selectedCareer, deskripsi: e.target.value})}
                        rows={3}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          theme === "dark" 
                            ? "bg-slate-700 border-slate-600 text-white" 
                            : "bg-white border-gray-200 text-gray-900"
                        )}
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseEditDialog}
                      className={cn(
                        theme === "dark" 
                          ? "border-slate-600 text-gray-300 hover:bg-slate-700" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className={cn(
                        theme === "dark" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      Simpan
                    </Button>
                  </div>
                </form>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>  )
}