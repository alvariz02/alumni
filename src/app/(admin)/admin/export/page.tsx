"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileSpreadsheet, 
  Download, 
  Users, 
  Briefcase, 
  MapPin, 
  GraduationCap,
  Loader2 
} from "lucide-react"
import { toast } from "sonner"

export default function ExportPage() {
  const [exporting, setExporting] = useState(false)
  const [filters, setFilters] = useState({
    angkatan: "all",
    fakultas: "all",
    status: "all",
    verified: "all",
  })

  const handleExport = async (type: string) => {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") {
          params.append(key, value)
        }
      })
      params.append("type", type)

      const response = await fetch(`/api/admin/export?${params.toString()}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `alumni-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Export berhasil diunduh")
      } else {
        throw new Error("Gagal export")
      }
    } catch (error) {
      toast.error("Gagal mengekspor data")
    } finally {
      setExporting(false)
    }
  }

  const exportTypes = [
    {
      title: "Data Alumni Lengkap",
      description: "Semua data profil alumni",
      icon: Users,
      type: "alumni",
    },
    {
      title: "Data Karier",
      description: "Status karier dan pekerjaan",
      icon: Briefcase,
      type: "karier",
    },
    {
      title: "Distribusi Geografis",
      description: "Data domisili alumni",
      icon: MapPin,
      type: "lokasi",
    },
    {
      title: "Laporan Akreditasi",
      description: "Format khusus untuk BAN-PT",
      icon: GraduationCap,
      type: "akreditasi",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Export Data</h1>
        <p className="text-slate-500">Ekspor data alumni ke format CSV untuk keperluan akreditasi</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Data</CardTitle>
          <CardDescription>Pilih filter untuk data yang akan diekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Angkatan</Label>
              <Select
                value={filters.angkatan}
                onValueChange={(value) => setFilters({ ...filters, angkatan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Angkatan</SelectItem>
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fakultas</Label>
              <Select
                value={filters.fakultas}
                onValueChange={(value) => setFilters({ ...filters, fakultas: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Fakultas</SelectItem>
                  <SelectItem value="Fakultas Ekonomi">Fakultas Ekonomi</SelectItem>
                  <SelectItem value="Fakultas ilmu sosial dan ilmu politik">Fakultas Ilmu Sosial dan Ilmu Politik</SelectItem>
                  <SelectItem value="Fakultas Keguruan dan Ilmu Pendidikan">Fakultas Keguruan dan Ilmu Pendidikan</SelectItem>
                  <SelectItem value="Fakultas Matematika dan Ilmu Pengetahuan Alam">Fakultas Matematika dan Ilmu Pengetahuan Alam</SelectItem>
                  <SelectItem value="Fakultas Perikanan dan Ilmu kelautan">Fakultas Perikanan dan Ilmu Kelautan</SelectItem>
                  <SelectItem value="Fakultas Teknik">Fakultas Teknik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status Karier</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="BEKERJA">Bekerja</SelectItem>
                  <SelectItem value="WIRAUSAHA">Wirausaha</SelectItem>
                  <SelectItem value="STUDI_LANJUT">Studi Lanjut</SelectItem>
                  <SelectItem value="BELUM_BEKERJA">Belum Bekerja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status Verifikasi</Label>
              <Select
                value={filters.verified}
                onValueChange={(value) => setFilters({ ...filters, verified: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Terverifikasi</SelectItem>
                  <SelectItem value="false">Belum Verifikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-2">
        {exportTypes.map((item) => (
          <Card key={item.type} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => handleExport(item.type)}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengexport...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Format Export</h4>
              <p className="text-sm text-blue-700 mt-1">
                File yang diekspor dalam format CSV (.csv) dan dapat dibuka dengan Microsoft Excel, 
                Google Sheets, atau aplikasi spreadsheet lainnya. Data gaji tidak disertakan untuk 
                menjaga privasi alumni.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>
}
