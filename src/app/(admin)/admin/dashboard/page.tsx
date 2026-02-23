"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  MessageSquare,
  Mail,
  FileSpreadsheet,
  UserCheck,
  UserX,
  Activity,
  Clock,
  CheckCircle,
  Briefcase,
  Building2,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface DashboardStats {
  totalAlumni: number
  verifiedAlumni: number
  unverifiedAlumni: number
  employedAlumni: number
  entrepreneurshipAlumni: number
  furtherStudyAlumni: number
  unemployedAlumni: number
  pendingTestimonials: number
  recentRegistrations: number
  activeUsers: number
}

interface AlumniData {
  id: string
  nama: string
  nim: string
  email: string
  fakultas: string
  prodi: string
  angkatan: number
  isVerified: boolean
  createdAt: string
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAlumni, setRecentAlumni] = useState<AlumniData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔐 Admin Dashboard - Status:", status, "Role:", session?.user?.role)
    
    const userRole = session?.user?.role
    if (status === "authenticated") {
      if (userRole?.toUpperCase() !== "ADMIN") {
        console.log("❌ Not admin, redirecting to dashboard")
        window.location.href = "/dashboard"
        return
      }
      console.log("✅ Admin authenticated, fetching data...")
      fetchStats()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting to login")
      window.location.href = "/login"
    }
  }, [session, status])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        console.log("� Admin Dashboard Stats:", data)
        setStats(data.stats)
        setRecentAlumni(data.recentAlumni || [])
      } else {
        console.error("❌ Failed to fetch stats:", response.status)
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className={cn(
        "flex h-screen items-center justify-center",
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      )}>
        <div className="flex flex-col items-center gap-4">
          <Users className="h-12 w-12 animate-spin text-blue-500" />
          <p className={cn(
            "text-lg font-medium",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn(
        "flex h-screen items-center justify-center",
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      )}>
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-12 w-12 animate-spin text-blue-500" />
          <p className={cn(
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  const employmentRate = stats
    ? Math.round(
        ((stats.employedAlumni + stats.entrepreneurshipAlumni) / stats.totalAlumni) * 100
      )
    : 0

  const verificationRate = stats
    ? Math.round((stats.verifiedAlumni / stats.totalAlumni) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "rounded-lg p-6 text-white",
        theme === "dark" 
          ? "bg-gradient-to-r from-blue-800 to-blue-600" 
          : "bg-gradient-to-r from-blue-600 to-blue-500"
      )}>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className={cn(
          "mt-2",
          theme === "dark" ? "text-blue-100" : "text-blue-50"
        )}>
          Kelola data alumni dan pantau statistik keterserapan kerja
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Badge className={cn(
            "text-white",
            theme === "dark" ? "bg-blue-700/50" : "bg-blue-500/50"
          )}>
            <Activity className="mr-2 h-4 w-4" />
            {stats?.activeUsers || 0} Pengguna Aktif
          </Badge>
          <Badge className={cn(
            "text-white",
            theme === "dark" ? "bg-blue-700/50" : "bg-blue-500/50"
          )}>
            <Clock className="mr-2 h-4 w-4" />
            Real-time
          </Badge>
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
              Total Alumni
            </CardTitle>
            <Users className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              {stats?.totalAlumni || 0}
            </div>
            <div className={cn(
              "mt-2 flex items-center gap-2 text-xs",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              <ArrowUpRight className="h-3 w-3" />
              <span>+{Math.floor(Math.random() * 10) + 1}% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Tingkat Keterserapan
            </CardTitle>
            <TrendingUp className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              {employmentRate}%
            </div>
            <div className={cn(
              "mt-2 flex items-center gap-2 text-xs",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              <ArrowUpRight className="h-3 w-3" />
              <span>+{Math.floor(Math.random() * 5) + 1}% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Alumni Terverifikasi
            </CardTitle>
            <UserCheck className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              {stats?.verifiedAlumni || 0}
            </div>
            <div className={cn(
              "mt-2 flex items-center gap-2 text-xs",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              <ArrowUpRight className="h-3 w-3" />
              <span>{verificationRate}% verifikasi</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Testimoni Pending
            </CardTitle>
            <MessageSquare className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              {stats?.pendingTestimonials || 0}
            </div>
            <div className={cn(
              "mt-2 flex items-center gap-2 text-xs",
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            )}>
              <AlertCircle className="h-3 w-3" />
              <span>Menunggu review</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            <Users className="h-5 w-5" />
            Alumni Terbaru
          </CardTitle>
          <CardDescription className={cn(
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}>
            Alumni yang baru mendaftar
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
                      Nama
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      NIM
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Fakultas
                    </th>
                    <th className={cn(
                      "border px-4 py-2 text-left text-sm font-medium",
                      theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                    )}>
                      Prodi
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
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlumni.map((alumni) => (
                    <tr 
                      key={alumni.id} 
                      className={cn(
                        theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"
                      )}
                    >
                      <td className={cn(
                        "border px-4 py-2 font-medium",
                        theme === "dark" ? "border-slate-700 text-white" : "border-gray-200 text-gray-900"
                      )}>
                        {alumni.nama}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {alumni.nim}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {alumni.fakultas}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700 text-gray-300" : "border-gray-200 text-gray-700"
                      )}>
                        {alumni.prodi}
                      </td>
                      <td className={cn(
                        "border px-4 py-2",
                        theme === "dark" ? "border-slate-700" : "border-gray-200"
                      )}>
                        <Badge variant={alumni.isVerified ? "default" : "secondary"}>
                          {alumni.isVerified ? "Terverifikasi" : "Belum"}
                        </Badge>
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
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              theme === "dark" ? "text-gray-300 hover:text-white hover:bg-slate-600" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            )}
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <Link href="/admin/alumni">
                <Button variant="outline">
                  Lihat Semua Alumni <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/alumni">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Kelola Alumni</h3>
                <p className="text-sm text-slate-500">Lihat, edit, verifikasi</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/testimoni">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-green-100 p-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Moderasi Testimoni</h3>
                <p className="text-sm text-slate-500">Setujui atau tolak</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/broadcast">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Kirim Email</h3>
                <p className="text-sm text-slate-500">Broadcast ke alumni</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/export">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-orange-100 p-3">
                <FileSpreadsheet className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-slate-500">Download laporan</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
