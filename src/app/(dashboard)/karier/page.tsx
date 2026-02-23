"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Plus,
  Clock,
  GraduationCap,
  User,
  Building
} from "lucide-react"
import { toast } from "sonner"

const careerStatuses = [
  { value: "BEKERJA", label: "Bekerja", icon: Briefcase, color: "bg-green-500" },
  { value: "WIRAUSAHA", label: "Wirausaha", icon: Building2, color: "bg-blue-500" },
  { value: "STUDI_LANJUT", label: "Studi Lanjut", icon: GraduationCap, color: "bg-purple-500" },
  { value: "BELUM_BEKERJA", label: "Belum Bekerja", icon: User, color: "bg-orange-500" },
]

const salaryRanges = [
  "< 3 Juta",
  "3 - 5 Juta",
  "5 - 10 Juta",
  "10 - 15 Juta",
  "15 - 25 Juta",
  "25 - 50 Juta",
  "> 50 Juta",
]

const industrySectors = [
  "Teknologi Informasi",
  "Keuangan & Perbankan",
  "Manufaktur",
  "Kesehatan",
  "Pendidikan",
  "Pemerintahan",
  "E-Commerce",
  "Konsultan",
  "Media & Komunikasi",
  "Retail",
  "Konstruksi",
  "Pertanian",
  "Transportasi",
  "Pariwisata",
  "Lainnya",
]

interface CareerData {
  id: string
  status: string
  namaPerusahaan: string | null
  jabatan: string | null
  sektorIndustri: string | null
  kotaKerja: string | null
  provinsiKerja: string | null
  negaraKerja: string
  rentangGaji: string | null
  isSesuaiBidang: boolean | null
  tanggalMulai: string | null
  isCurrent: boolean
  createdAt: string
}

export default function KarierPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [careerHistory, setCareerHistory] = useState<CareerData[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    console.log("🔐 Karier Page - Status:", status, "Role:", session?.user?.role)
    
    if (status === "authenticated") {
      const userRole = session?.user?.role
      if (userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "PIMPINAN") {
        console.log("🔄 Admin/pimpinan accessing karier page - redirecting")
        const redirectUrl = userRole?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/analytics"
        window.location.href = redirectUrl
        return
      }
      console.log("✅ Alumni authenticated, fetching career data...")
      fetchCareerData()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting to login")
      window.location.href = "/login"
    }
  }, [session, status])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role?.toUpperCase() !== "ADMIN" && session?.user?.role?.toUpperCase() !== "PIMPINAN") {
      fetchCareerData()
    }
  }, [session, status])

  const fetchCareerData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/alumni/karier')
      if (response.ok) {
        const data = await response.json()
        setCareerHistory(data.careers || [])
      }
    } catch (error) {
      console.error('Error fetching career data:', error)
      toast.error("Gagal memuat data karier")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Briefcase className="h-12 w-12 animate-spin text-blue-500" />
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

  const [formData, setFormData] = useState({
    status: "",
    namaPerusahaan: "",
    jabatan: "",
    sektorIndustri: "",
    kotaKerja: "",
    provinsiKerja: "",
    negaraKerja: "Indonesia",
    rentangGaji: "",
    isSesuaiBidang: "",
    tanggalMulai: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.status) {
      toast.error("Pilih status karier terlebih dahulu")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/alumni/karier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isSesuaiBidang: formData.isSesuaiBidang === "true",
          tanggalMulai: formData.tanggalMulai || null,
        }),
      })

      if (response.ok) {
        toast.success("Data karier berhasil disimpan")
        setShowForm(false)
        setFormData({
          status: "",
          namaPerusahaan: "",
          jabatan: "",
          sektorIndustri: "",
          kotaKerja: "",
          provinsiKerja: "",
          negaraKerja: "Indonesia",
          rentangGaji: "",
          isSesuaiBidang: "",
          tanggalMulai: "",
        })
        fetchCareerData()
      } else {
        throw new Error("Gagal menyimpan")
      }
    } catch (error) {
      toast.error("Gagal menyimpan data karier")
    } finally {
      setSaving(false)
    }
  }

  const selectedStatus = careerStatuses.find((s) => s.value === formData.status)

  const needsCompanyInfo = ["BEKERJA", "WIRAUSAHA"].includes(formData.status)
  const needsEducationInfo = formData.status === "STUDI_LANJUT"

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Karier</h1>
          <p className="text-slate-500">Kelola informasi karier dan pekerjaan Anda</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            "Batal"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Update Karier
            </>
          )}
        </Button>
      </div>

      {/* Current Status Card */}
      {careerHistory.length > 0 && !showForm && (
        <Card className="border-l-4 border-l-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status Karier Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            {careerHistory.filter((c) => c.isCurrent).map((current) => {
              const statusInfo = careerStatuses.find((s) => s.value === current.status)
              return (
                <div key={current.id} className="flex flex-wrap items-start gap-4">
                  <Badge className={`${statusInfo?.color} text-white`}>
                    {statusInfo?.label}
                  </Badge>
                  {current.namaPerusahaan && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <span>{current.namaPerusahaan}</span>
                    </div>
                  )}
                  {current.jabatan && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-500" />
                      <span>{current.jabatan}</span>
                    </div>
                  )}
                  {current.kotaKerja && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{current.kotaKerja}, {current.provinsiKerja}</span>
                    </div>
                  )}
                  {current.rentangGaji && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <DollarSign className="h-4 w-4" />
                      <span>RP {current.rentangGaji}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Update Data Karier</CardTitle>
            <CardDescription>
              Informasi ini digunakan untuk keperluan tracer study dan akreditasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Status Karier Saat Ini</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {careerStatuses.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: status.value })}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-blue-900 ${
                        formData.status === status.value
                          ? "border-blue-900 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className={`rounded-full p-2 ${status.color}`}>
                        <status.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Fields - Bekerja / Wirausaha */}
              {needsCompanyInfo && (
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Informasi Pekerjaan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nama Perusahaan/Instansi</Label>
                      <Input
                        value={formData.namaPerusahaan}
                        onChange={(e) => setFormData({ ...formData, namaPerusahaan: e.target.value })}
                        placeholder="Contoh: PT Teknologi Indonesia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jabatan/Posisi</Label>
                      <Input
                        value={formData.jabatan}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        placeholder="Contoh: Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sektor Industri</Label>
                      <Select
                        value={formData.sektorIndustri}
                        onValueChange={(value) => setFormData({ ...formData, sektorIndustri: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih sektor" />
                        </SelectTrigger>
                        <SelectContent>
                          {industrySectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Mulai Bekerja</Label>
                      <Input
                        type="date"
                        value={formData.tanggalMulai}
                        onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kota Kerja</Label>
                      <Input
                        value={formData.kotaKerja}
                        onChange={(e) => setFormData({ ...formData, kotaKerja: e.target.value })}
                        placeholder="Contoh: Jakarta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Provinsi Kerja</Label>
                      <Input
                        value={formData.provinsiKerja}
                        onChange={(e) => setFormData({ ...formData, provinsiKerja: e.target.value })}
                        placeholder="Contoh: DKI Jakarta"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Rentang Gaji (Opsional, Anonim)</Label>
                      <Select
                        value={formData.rentangGaji}
                        onValueChange={(value) => setFormData({ ...formData, rentangGaji: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih rentang gaji" />
                        </SelectTrigger>
                        <SelectContent>
                          {salaryRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              RP {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Data gaji hanya ditampilkan secara agregat, tidak per individu
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Pekerjaan Sesuai Bidang Studi?</Label>
                      <Select
                        value={formData.isSesuaiBidang}
                        onValueChange={(value) => setFormData({ ...formData, isSesuaiBidang: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih opsi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Ya, Sesuai</SelectItem>
                          <SelectItem value="false">Tidak Sesuai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Fields - Studi Lanjut */}
              {needsEducationInfo && (
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Informasi Studi Lanjut</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nama Institusi</Label>
                      <Input placeholder="Contoh: Universitas Indonesia" />
                    </div>
                    <div className="space-y-2">
                      <Label>Program Studi</Label>
                      <Input placeholder="Contoh: Magister Teknologi Informasi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenjang</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S2">S2 (Magister)</SelectItem>
                          <SelectItem value="S3">S3 (Doktor)</SelectItem>
                          <SelectItem value="PROFESI">Profesi</SelectItem>
                          <SelectItem value="DIPLOMA">Diploma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Masuk</Label>
                      <Input type="number" placeholder="2024" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Data Karier"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Career History */}
      {careerHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Riwayat Karier
            </CardTitle>
            <CardDescription>Daftar riwayat pekerjaan dan status karier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerHistory.map((career, index) => {
                const statusInfo = careerStatuses.find((s) => s.value === career.status)
                const IconComponent = statusInfo?.icon
                return (
                  <div
                    key={career.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className={`rounded-full p-2 ${statusInfo?.color}`}>
                      {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{statusInfo?.label}</Badge>
                        {career.isCurrent && (
                          <Badge className="bg-green-500">Saat Ini</Badge>
                        )}
                      </div>
                      {career.namaPerusahaan && (
                        <p className="mt-1 font-medium">{career.namaPerusahaan}</p>
                      )}
                      {career.jabatan && (
                        <p className="text-sm text-slate-500">{career.jabatan}</p>
                      )}
                      {career.kotaKerja && (
                        <p className="text-sm text-slate-500">
                          {career.kotaKerja}, {career.provinsiKerja}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-slate-400">
                        Diperbarui: {new Date(career.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {careerHistory.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold">Belum Ada Data Karier</h3>
            <p className="mt-2 text-center text-slate-500">
              Silakan update data karier Anda untuk membantu universitas dalam tracer study
            </p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Update Karier Sekarang
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
