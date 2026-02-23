"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  MapPin,
  Award,
  Target,
} from "lucide-react"

interface AnalyticsData {
  summary: {
    totalAlumni: number
    employmentRate: number
    fieldMatchRate: number
    employedAlumni: number
    entrepreneurshipAlumni: number
    furtherStudyAlumni: number
    unemployedAlumni: number
  }
  alumniByFakultas: { fakultas: string; count: number }[]
  alumniByAngkatan: { angkatan: number; count: number }[]
  careerByStatus: { status: string; count: number }[]
  careerByIndustry: { industry: string; count: number }[]
  alumniByProvince: { province: string; count: number }[]
  salaryRanges: { range: string; count: number }[]
}

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"]

const statusColors: Record<string, string> = {
  BEKERJA: "#22C55E",
  WIRAUSAHA: "#3B82F6",
  STUDI_LANJUT: "#A855F7",
  BELUM_BEKERJA: "#F97316",
}

const statusLabels: Record<string, string> = {
  BEKERJA: "Bekerja",
  WIRAUSAHA: "Wirausaha",
  STUDI_LANJUT: "Studi Lanjut",
  BELUM_BEKERJA: "Mencari Kerja",
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [jurusanFilter, setJurusanFilter] = useState("all")

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
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
        <p className="text-slate-500">Gagal memuat data analytics</p>
      </div>
    )
  }

  const pieChartData = data?.careerByStatus?.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: statusColors[item.status],
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
          <p className="text-slate-500">Analisis data alumni dan keterserapan kerja</p>
        </div>
        <Select value={jurusanFilter} onValueChange={setJurusanFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua Fakultas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Fakultas</SelectItem>
            {data.alumniByFakultas.map((j) => (
              <SelectItem key={j.fakultas} value={j.fakultas}>
                {j.fakultas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalAlumni}</div>
            <p className="text-xs text-slate-500">Alumni terdaftar</p>
          </CardContent>
        </Card>

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
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.summary.fieldMatchRate}%</div>
            <p className="text-xs text-slate-500">Bekerja di bidang sesuai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Studi Lanjut</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.summary.furtherStudyAlumni}</div>
            <p className="text-xs text-slate-500">Melanjutkan pendidikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Career Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Distribusi Status Karier
            </CardTitle>
            <CardDescription>Sebaran status karier alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {pieChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alumni by Fakultas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Alumni per Fakultas
            </CardTitle>
            <CardDescription>Distribusi alumni berdasarkan fakultas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.alumniByFakultas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="fakultas" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alumni by Angkatan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tren Alumni per Angkatan
            </CardTitle>
            <CardDescription>Jumlah alumni per tahun angkatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.alumniByAngkatan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="angkatan" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E3A8A"
                    strokeWidth={2}
                    dot={{ fill: "#1E3A8A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Career by Industry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Industri
            </CardTitle>
            <CardDescription>Industri dengan alumni terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.careerByIndustry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Province Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Distribusi per Provinsi
          </CardTitle>
          <CardDescription>Lokasi domisili alumni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {data.alumniByProvince.map((province, index) => (
              <div
                key={province.province}
                className="rounded-lg border p-3 text-center"
              >
                <p className="text-lg font-bold">{province.count}</p>
                <p className="text-sm text-slate-500 truncate">{province.province}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
