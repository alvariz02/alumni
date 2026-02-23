"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Briefcase, Building2, TrendingUp, DollarSign } from "lucide-react"

interface AnalyticsData {
  careerByIndustry: { industry: string; count: number }[]
  careerByStatus: { status: string; count: number }[]
  salaryRanges: { range: string; count: number }[]
}

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#2563EB", "#1D4ED8", "#1E40AF"]

export default function KarierAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-80 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">Gagal memuat data</p>
      </div>
    )
  }

  const statusLabels: Record<string, string> = {
    BEKERJA: "Bekerja",
    WIRAUSAHA: "Wirausaha",
    STUDI_LANJUT: "Studi Lanjut",
    BELUM_BEKERJA: "Belum Bekerja",
  }

  const statusColors: Record<string, string> = {
    BEKERJA: "#22C55E",
    WIRAUSAHA: "#3B82F6",
    STUDI_LANJUT: "#A855F7",
    BELUM_BEKERJA: "#F97316",
  }

  const statusChartData = data.careerByStatus.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: statusColors[item.status],
  }))

  const industryData = data.careerByIndustry.map((item) => ({
    name: item.industry || "Tidak Diketahui",
    jumlah: item.count,
  }))

  const salaryData = data.salaryRanges.map((item) => ({
    range: item.range || "Tidak Diketahui",
    jumlah: item.count,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Statistik Karier</h1>
        <p className="text-slate-500">Analisis karier dan pekerjaan alumni</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {data.careerByStatus.find((s) => s.status === "BEKERJA")?.count || 0}
              </p>
              <p className="text-sm text-slate-500">Alumni Bekerja</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.careerByIndustry.length}</p>
              <p className="text-sm text-slate-500">Sektor Industri</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {data.careerByStatus.reduce((sum, s) => sum + s.count, 0)}
              </p>
              <p className="text-sm text-slate-500">Total Data Karier</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Distribusi Status Karier
            </CardTitle>
            <CardDescription>Perbandingan status karier alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Sektor Industri
            </CardTitle>
            <CardDescription>Industri dengan alumni terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Distribusi Rentang Gaji
          </CardTitle>
          <CardDescription>Data gaji bersifat anonim dan agregat</CardDescription>
        </CardHeader>
        <CardContent>
          {salaryData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Jumlah Alumni"]} />
                  <Bar dataKey="jumlah" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Data gaji belum tersedia
            </div>
          )}
        </CardContent>
      </Card>

      {/* Industry List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Sektor Industri</CardTitle>
          <CardDescription>Semua sektor industri tempat alumni bekerja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {industryData.map((item, index) => (
              <Badge key={index} variant="outline" className="py-2 px-3">
                {item.name} ({item.jumlah})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
