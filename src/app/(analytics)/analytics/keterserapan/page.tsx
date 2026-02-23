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
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Target, Users, Briefcase, Clock } from "lucide-react"

interface KeterserapanData {
  summary: {
    totalAlumni: number
    employmentRate: number
    fieldMatchRate: number
    employedAlumni: number
    entrepreneurshipAlumni: number
    furtherStudyAlumni: number
    unemployedAlumni: number
  }
  careerByStatus: { status: string; count: number }[]
}

export default function KeterserapanPage() {
  const [data, setData] = useState<KeterserapanData | null>(null)
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
        <div className="h-80 animate-pulse rounded-lg bg-slate-200" />
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

  const chartData = data.careerByStatus.map((item) => ({
    name: statusLabels[item.status] || item.status,
    jumlah: item.count,
    fill: statusColors[item.status],
  }))

  // Simulated trend data
  const trendData = [
    { tahun: "2018", keterserapan: 75 },
    { tahun: "2019", keterserapan: 78 },
    { tahun: "2020", keterserapan: 72 },
    { tahun: "2021", keterserapan: 80 },
    { tahun: "2022", keterserapan: 83 },
    { tahun: "2023", keterserapan: 85 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tingkat Keterserapan Kerja</h1>
        <p className="text-slate-500">Analisis keterserapan alumni di dunia kerja</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Keterserapan</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.summary.employmentRate}%</div>
            <p className="text-xs text-slate-500">Bekerja + Wirausaha</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kesesuaian Bidang</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.summary.fieldMatchRate}%</div>
            <p className="text-xs text-slate-500">Bekerja di bidang sesuai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wirausaha</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.summary.entrepreneurshipAlumni}</div>
            <p className="text-xs text-slate-500">Alumni berwirausaha</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Belum Bekerja</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.summary.unemployedAlumni}</div>
            <p className="text-xs text-slate-500">Mencari pekerjaan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Karier</CardTitle>
            <CardDescription>Perbandingan jumlah alumni per status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Keterserapan per Tahun</CardTitle>
            <CardDescription>Persentase keterserapan kerja per angkatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Keterserapan"]} />
                  <Line
                    type="monotone"
                    dataKey="keterserapan"
                    stroke="#1E3A8A"
                    strokeWidth={2}
                    dot={{ fill: "#1E3A8A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Definition */}
      <Card>
        <CardHeader>
          <CardTitle>Definisi Keterserapan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Kategori Terserap</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Bekerja:</strong> Alumni yang bekerja di perusahaan/instansi</li>
                <li>• <strong>Wirausaha:</strong> Alumni yang memiliki usaha sendiri</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Kategori Belum Terserap</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Studi Lanjut:</strong> Alumni yang melanjutkan pendidikan</li>
                <li>• <strong>Belum Bekerja:</strong> Alumni yang sedang mencari kerja</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
