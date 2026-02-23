"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Trophy,
  Medal,
  Star,
  Calendar,
  Building,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PrestasiData {
  id: string
  alumniId: string
  alumni: {
    nama: string
    nim: string
    fakultas: string
    prodi: string
    angkatan: number
  }
  namaPrestasi: string
  tingkat: string
  tahun: number
  penyelenggara: string
  deskripsi: string
  createdAt: string
}

interface PrestasiStats {
  totalPrestasi: number
  prestasiByTingkat: Array<{
    tingkat: string
    count: number
  }>
  prestasiByTahun: Array<{
    tahun: number
    count: number
  }>
  prestasiByFakultas: Array<{
    fakultas: string
    count: number
  }>
}

export default function AdminPrestasiPage() {
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [prestasi, setPrestasi] = useState<PrestasiData[]>([])
  const [stats, setStats] = useState<PrestasiStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTingkat, setFilterTingkat] = useState("all")

  const handleViewPrestasi = (prestasiId: string) => {
    console.log("View prestasi:", prestasiId)
    // TODO: Open view dialog or navigate to detail page
  }

  const handleEditPrestasi = (prestasiId: string) => {
    console.log("Edit prestasi:", prestasiId)
    // TODO: Open edit dialog or navigate to edit page
  }

  const handleDeletePrestasi = async (prestasiId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data prestasi ini?")) {
      try {
        const response = await fetch(`/api/admin/prestasi`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Cookie": document.cookie
          },
          body: JSON.stringify({ prestasiId })
        })
        
        if (response.ok) {
          console.log("Prestasi deleted successfully")
          fetchPrestasi() // Refresh data
          fetchStats()
        } else {
          console.error("Failed to delete prestasi")
        }
      } catch (error) {
        console.error("Error deleting prestasi:", error)
      }
    }
  }

  useEffect(() => {
    console.log("🔄 Prestasi Page - Status:", status, "Role:", session?.user?.role)
    
    const userRole = session?.user?.role
    if (status === "authenticated" && (userRole === "ADMIN" || userRole === "PIMPINAN")) {
      console.log("✅ Admin authenticated, fetching data...")
      fetchPrestasi()
      fetchStats()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting...")
      window.location.href = "/login"
    }
  }, [session, status])

  const fetchPrestasi = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/prestasi", {
        headers: {
          "Cookie": document.cookie
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("📊 Admin Prestasi Data:", data)
        setPrestasi(data.prestasi || [])
      } else {
        console.error("❌ Failed to fetch prestasi:", response.status)
      }
    } catch (error) {
      console.error("❌ Error fetching prestasi:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/prestasi/stats", {
        headers: {
          "Cookie": document.cookie
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error)
    }
  }

  const getTingkatColor = (tingkat: string) => {
    switch (tingkat) {
      case "INTERNASIONAL":
        return "bg-blue-100 text-blue-800"
      case "NASIONAL":
        return "bg-green-100 text-green-800"
      case "PROVINSI":
        return "bg-yellow-100 text-yellow-800"
      case "KOTA/KABUPATEN":
        return "bg-purple-100 text-purple-800"
      case "UNIVERSITAS":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTingkatIcon = (tingkat: string) => {
    switch (tingkat) {
      case "INTERNASIONAL":
        return <Trophy className="h-4 w-4" />
      case "NASIONAL":
        return <Medal className="h-4 w-4" />
      case "PROVINSI":
        return <Award className="h-4 w-4" />
      case "KOTA/KABUPATEN":
        return <Star className="h-4 w-4" />
      case "UNIVERSITAS":
        return <Award className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  const filteredPrestasi = prestasi.filter((p) => {
    const matchesSearch = p.namaPrestasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.alumni.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterTingkat === "all" || p.tingkat === filterTingkat
    
    return matchesSearch && matchesFilter
  })

  if (loading || status === "loading") {
    return (
      <div className={cn(
        "flex h-screen items-center justify-center",
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      )}>
        <div className="flex flex-col items-center gap-4">
          <Award className="h-12 w-12 animate-spin text-blue-500" />
          <p className={cn(
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            {status === "loading" ? "Checking authentication..." : "Loading prestasi data..."}
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className={cn(
        "flex h-screen items-center justify-center",
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      )}>
        <div className="flex flex-col items-center gap-4">
          <p className={cn(
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "rounded-lg p-6 text-white",
        theme === "dark" 
          ? "bg-gradient-to-r from-amber-800 to-amber-600" 
          : "bg-gradient-to-r from-amber-600 to-amber-500"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Prestasi</h1>
            <p className={cn(
              "mt-2",
              theme === "dark" ? "text-amber-100" : "text-amber-50"
            )}>
              Kelola data prestasi dan pencapaian alumni
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Badge className={cn(
                "text-white",
                theme === "dark" ? "bg-amber-700/50" : "bg-amber-500/50"
              )}>
                <Trophy className="mr-2 h-4 w-4" />
                {stats?.totalPrestasi || 0} Total Prestasi
              </Badge>
            </div>
          </div>
          <Link href="/admin/prestasi/add">
            <Button className={cn(
              "text-white border hover:bg-white/20",
              theme === "dark" 
                ? "bg-amber-700/50 border-amber-600/50 hover:bg-amber-600/50" 
                : "bg-amber-500/50 border-amber-400/50 hover:bg-amber-600/50"
            )}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Prestasi
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Total Prestasi
            </CardTitle>
            <Trophy className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-amber-400" : "text-amber-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-amber-400" : "text-amber-600"
            )}>
              {stats?.totalPrestasi || 0}
            </div>
            <p className={cn(
              "text-xs mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              Pencapaian alumni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Prestasi Internasional
            </CardTitle>
            <Trophy className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            )}>
              {stats?.prestasiByTingkat.find(p => p.tingkat === "INTERNASIONAL")?.count || 0}
            </div>
            <p className={cn(
              "text-xs mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              Tingkat internasional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Prestasi Nasional
            </CardTitle>
            <Medal className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-green-400" : "text-green-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-green-400" : "text-green-600"
            )}>
              {stats?.prestasiByTingkat.find(p => p.tingkat === "NASIONAL")?.count || 0}
            </div>
            <p className={cn(
              "text-xs mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              Tingkat nasional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Tahun Teraktif
            </CardTitle>
            <Calendar className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-purple-400" : "text-purple-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            )}>
              {stats?.prestasiByTahun.sort((a, b) => b.count - a.count)[0]?.tahun || "-"}
            </div>
            <p className={cn(
              "text-xs mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              {stats?.prestasiByTahun.sort((a, b) => b.count - a.count)[0]?.count || 0} prestasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            <Search className="h-5 w-5" />
            Pencarian dan Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari prestasi, nama alumni, atau penyelenggara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  theme === "dark" 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400" 
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                )}
              />
            </div>
            <select
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value)}
              className={cn(
                "px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark" 
                  ? "bg-slate-800 border-slate-700 text-white" 
                  : "bg-white border-gray-200 text-gray-900"
              )}
            >
              <option value="all">Semua Tingkat</option>
              <option value="INTERNASIONAL">Internasional</option>
              <option value="NASIONAL">Nasional</option>
              <option value="PROVINSI">Provinsi</option>
              <option value="KOTA/KABUPATEN">Kota/Kabupaten</option>
              <option value="UNIVERSITAS">Universitas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Prestasi Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            <Award className="h-5 w-5" />
            Data Prestasi Alumni
          </CardTitle>
          <CardDescription className={cn(
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}>
            Daftar prestasi yang telah dicapai oleh alumni
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
                      Prestasi
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Tingkat
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Tahun
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Penyelenggara
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
                  {filteredPrestasi.map((prestasi) => (
                    <tr 
                      key={prestasi.id} 
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
                            {prestasi.alumni.nama}
                          </div>
                          <div className={cn(
                            "text-sm",
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          )}>
                            {prestasi.alumni.nim}
                          </div>
                          <div className={cn(
                            "text-xs",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {prestasi.alumni.fakultas}
                          </div>
                          <div className={cn(
                            "text-xs",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {prestasi.alumni.prodi}
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        <div>
                          <div className="font-medium">{prestasi.namaPrestasi}</div>
                          <div className={cn(
                            "text-sm",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {prestasi.deskripsi}
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700" : "border-gray-200"
                      )}>
                        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTingkatColor(prestasi.tingkat)}`}>
                          {getTingkatIcon(prestasi.tingkat)}
                          {prestasi.tingkat}
                        </div>
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {prestasi.tahun}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {prestasi.penyelenggara}
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
                            onClick={() => handleViewPrestasi(prestasi.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-gray-300 hover:text-white hover:bg-slate-600" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            )}
                            onClick={() => handleEditPrestasi(prestasi.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-slate-600" : "text-red-600 hover:text-red-700 hover:bg-gray-100"
                            )}
                            onClick={() => handleDeletePrestasi(prestasi.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPrestasi.length === 0 && (
              <div className="text-center py-8">
                <Award className={cn(
                  "mx-auto h-12 w-12",
                  theme === "dark" ? "text-slate-400" : "text-gray-400"
                )} />
                <p className={cn(
                  "mt-2",
                  theme === "dark" ? "text-slate-500" : "text-gray-500"
                )}>
                  Tidak ada data prestasi yang ditemukan
                </p>
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
              <div className={cn(
                "rounded-full p-3",
                theme === "dark" ? "bg-blue-900" : "bg-blue-100"
              )}>
                <Users className={cn(
                  "h-6 w-6",
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  Kelola Alumni
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === "dark" ? "text-slate-400" : "text-gray-500"
                )}>
                  Update data alumni
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/karier">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={cn(
                "rounded-full p-3",
                theme === "dark" ? "bg-green-900" : "bg-green-100"
              )}>
                <Building className={cn(
                  "h-6 w-6",
                  theme === "dark" ? "text-green-400" : "text-green-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  Data Karier
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === "dark" ? "text-slate-400" : "text-gray-500"
                )}>
                  Informasi pekerjaan
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/testimoni">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={cn(
                "rounded-full p-3",
                theme === "dark" ? "bg-purple-900" : "bg-purple-100"
              )}>
                <Star className={cn(
                  "h-6 w-6",
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  Testimoni
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === "dark" ? "text-slate-400" : "text-gray-500"
                )}>
                  Review alumni
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
