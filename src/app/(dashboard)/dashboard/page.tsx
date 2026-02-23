"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  Users, 
  User,
  Building2,
  Award,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    profileCompletion: 0,
    totalAlumni: 0,
    alumniWithCareer: 0,
    alumniWithAchievements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔐 Alumni Dashboard - Status:", status, "Role:", session?.user?.role)
    
    if (status === "authenticated") {
      const userRole = session?.user?.role
      if (userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "PIMPINAN") {
        console.log("🔄 Admin/pimpinan accessing alumni dashboard - redirecting")
        const redirectUrl = userRole?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/analytics"
        window.location.href = redirectUrl
        return
      }
      console.log("✅ Alumni authenticated, fetching data...")
      fetchStats()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting to login")
      window.location.href = "/login"
    }
  }, [session, status])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role?.toUpperCase() !== "ADMIN" && session?.user?.role?.toUpperCase() !== "PIMPINAN") {
      fetchStats()
    }
  }, [session, status])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Users className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-gray-900">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-medium text-gray-900">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const recentActivities = [
    { type: "career", message: "Perbarui data karier terbaru Anda", action: "/karier" },
    { type: "profile", message: "Lengkapi profil untuk meningkatkan visibilitas", action: "/profile" },
    { type: "network", message: "Jelajahi jaringan alumni di kota Anda", action: "/network" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Selamat Datang! 👋
        </h1>
        <p className="mt-2 text-blue-100">
          Kelola profil dan data karier Anda untuk membantu universitas dalam akreditasi dan tracer study.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kelengkapan Profil</CardTitle>
            <User className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileCompletion}%</div>
            <Progress value={stats.profileCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAlumni?.toLocaleString('id-ID') || 0}</div>
            <p className="text-xs text-slate-500">Terdaftar di sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alumni dengan Karier</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.alumniWithCareer?.toLocaleString('id-ID') || 0}</div>
            <p className="text-xs text-slate-500">Memiliki data karier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alumni dengan Prestasi</CardTitle>
            <Award className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.alumniWithAchievements?.toLocaleString('id-ID') || 0}</div>
            <p className="text-xs text-slate-500">Memiliki prestasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses fitur utama dengan cepat</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/karier">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Update Data Karier
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Edit Profil
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/network">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Jelajahi Alumni
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* To-Do / Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Perlu Perhatian</CardTitle>
            <CardDescription>Pentingingan aktivitas Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <Link
                key={index}
                href={activity.action}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {activity.type === "career" && (
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  )}
                  {activity.type === "profile" && (
                    <Users className="h-5 w-5 text-green-600" />
                  )}
                  {activity.type === "network" && (
                    <Building2 className="h-5 w-5 text-purple-600" />
                  )}
                  <span className="text-sm">{activity.message}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Career Stats Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statistik Karier Alumni
          </CardTitle>
          <CardDescription>
            Gambaran umum status karier alumni universitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-green-500" />
              <p className="mt-2 text-2xl font-bold">68%</p>
              <p className="text-sm text-slate-500">Bekerja</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <Award className="mx-auto h-8 w-8 text-blue-500" />
              <p className="mt-2 text-2xl font-bold">15%</p>
              <p className="text-sm text-slate-500">Wirausaha</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-purple-500" />
              <p className="mt-2 text-2xl font-bold">12%</p>
              <p className="text-sm text-slate-500">Studi Lanjut</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <Users className="mx-auto h-8 w-8 text-orange-500" />
              <p className="mt-2 text-2xl font-bold">5%</p>
              <p className="text-sm text-slate-500">Mencari Kerja</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
