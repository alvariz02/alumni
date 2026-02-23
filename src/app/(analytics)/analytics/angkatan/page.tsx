"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TrendingUp, Users, GraduationCap, Target } from "lucide-react"

interface AnalyticsData {
  alumniByAngkatan: { angkatan: number; count: number }[]
  careerByStatus: { status: string; count: number }[]
  summary: {
    totalAlumni: number
    employmentRate: number
  }
}

export default function AngkatanPage() {
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

  const angkatanData = data.alumniByAngkatan.map((item) => ({
    angkatan: item.angkatan.toString(),
    jumlah: item.count,
    // Simulated employment rate per angkatan
    keterserapan: 60 + Math.floor(Math.random() * 30),
  }))

  // Simulated salary trend
  const salaryTrend = data.alumniByAngkatan.map((item) => ({
    angkatan: item.angkatan.toString(),
    rataRataGaji: 5 + Math.floor(Math.random() * 10),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tren Per Angkatan</h1>
        <p className="text-slate-500">Analisis perkembangan alumni per tahun angkatan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Angkatan</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.alumniByAngkatan.length}</div>
            <p className="text-xs text-slate-500">Tahun angkatan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Angkatan Terbanyak</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.alumniByAngkatan.sort((a, b) => b.count - a.count)[0]?.angkatan || "-"}
            </div>
            <p className="text-xs text-slate-500">
              {data.alumniByAngkatan.sort((a, b) => b.count - a.count)[0]?.count || 0} alumni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Keterserapan</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.employmentRate}%</div>
            <p className="text-xs text-slate-500">Semua angkatan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Jumlah Alumni per Angkatan
            </CardTitle>
            <CardDescription>Distribusi jumlah alumni berdasarkan tahun angkatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={angkatanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="angkatan" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Jumlah Alumni" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Keterserapan per Angkatan</CardTitle>
            <CardDescription>Persentase keterserapan kerja per tahun angkatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={angkatanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="angkatan" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Keterserapan"]} />
                  <Line
                    type="monotone"
                    dataKey="keterserapan"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: "#22C55E" }}
                    name="Keterserapan (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Rata-rata Gaji per Angkatan</CardTitle>
            <CardDescription>Kisaran gaji rata-rata dalam juta rupiah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="angkatan" />
                  <YAxis label={{ value: "Juta Rupiah", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`Rp ${value} Juta`, "Rata-rata Gaji"]} />
                  <Bar dataKey="rataRataGaji" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Per Angkatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Angkatan</th>
                  <th className="text-right py-3 px-4">Jumlah Alumni</th>
                  <th className="text-right py-3 px-4">Keterserapan</th>
                  <th className="text-right py-3 px-4">Rata-rata Gaji</th>
                </tr>
              </thead>
              <tbody>
                {angkatanData.map((item) => (
                  <tr key={item.angkatan} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.angkatan}</td>
                    <td className="text-right py-3 px-4">{item.jumlah}</td>
                    <td className="text-right py-3 px-4">{item.keterserapan}%</td>
                    <td className="text-right py-3 px-4">Rp {salaryTrend.find(s => s.angkatan === item.angkatan)?.rataRataGaji || 0} Juta</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
