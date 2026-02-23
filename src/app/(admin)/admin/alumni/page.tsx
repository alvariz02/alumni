"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  DownloadCloud,
  FileSpreadsheet,
  MoreVertical,
  Shield,
  Mail,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Briefcase,
  MapPin,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface Alumni {
  id: string
  nim: string
  nama: string
  email: string
  angkatan: number
  fakultas: string
  prodi: string
  noHp: string | null
  kotaDomisili: string
  isVerified: boolean
  createdAt: string
  karier: {
    status: string
    namaPerusahaan: string | null
  } | null
}

interface AlumniResponse {
  alumni: Alumni[]
  total: number
  limit: number
  offset: number
}

export default function AdminAlumniPage() {
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [fakultasFilter, setFakultasFilter] = useState("all")
  const [prodiFilter, setProdiFilter] = useState("all")
  const [verifyFilter, setVerifyFilter] = useState("all")
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    // ✅ FIX 1: Role check now case-insensitive — handles both "ADMIN" and "admin"
    const role = session?.user?.role?.toUpperCase()
    if (status === "authenticated" && (role === "ADMIN" || role === "PIMPINAN")) {
      fetchAlumni()
    } else if (status === "unauthenticated") {
      window.location.href = "/login"
    }
  }, [session, status, currentPage, verifyFilter, fakultasFilter, prodiFilter, searchQuery])

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1)
  }, [searchQuery, verifyFilter, fakultasFilter, prodiFilter])

  const fetchAlumni = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      // ✅ FIX 2: Removed manual "Cookie" header — Next.js handles session cookies automatically
      // Manually setting Cookie header can break NextAuth session detection
      const response = await fetch(
        `/api/admin/alumni?limit=${itemsPerPage}&offset=${offset}&filter=${verifyFilter}&search=${encodeURIComponent(searchQuery)}&fakultas=${encodeURIComponent(fakultasFilter)}&prodi=${encodeURIComponent(prodiFilter)}`,
        {
          method: "GET",
          credentials: "include", // ensures cookies are sent automatically
          signal: controller.signal,
        }
      )
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data: AlumniResponse = await response.json()
        console.log("👥 Admin Alumni Data received:", data)
        setAlumni(data.alumni || [])
        setTotalItems(data.total || 0)
      } else {
        const errText = await response.text()
        console.error("❌ Failed to fetch alumni:", response.status, errText)
        toast.error(`Gagal memuat data alumni: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        toast.error("Request timeout, coba lagi")
      } else {
        console.error("❌ Error fetching alumni:", error)
        toast.error("Gagal memuat data alumni")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`, {
        headers: {
          "Cookie": document.cookie
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `data-${type}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success(`Data ${type} berhasil diunduh`)
      } else {
        toast.error(`Gagal mengunduh data ${type}`)
      }
    } catch (error) {
      console.error("❌ Error exporting data:", error)
      toast.error("Gagal mengunduh data")
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchAlumni()
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // ✅ FIX 3: Removed manual Cookie header from all fetch calls below
  const handleVerify = async (alumniId: string, verify: boolean) => {
    try {
      const response = await fetch(`/api/admin/alumni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ action: verify ? "verify" : "unverify", alumniId })
      })

      if (response.ok) {
        toast.success(verify ? "Alumni berhasil diverifikasi" : "Verifikasi dibatalkan")
        fetchAlumni()
      } else {
        throw new Error("Gagal update")
      }
    } catch (error) {
      console.error("❌ Error verifying alumni:", error)
      toast.error("Gagal mengubah status verifikasi")
    }
  }

  const handleDelete = async (alumniId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus alumni ini?")) return

    try {
      const response = await fetch(`/api/admin/alumni`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ alumniId })
      })

      if (response.ok) {
        toast.success("Alumni berhasil dihapus")
        fetchAlumni()
      } else {
        throw new Error("Gagal hapus")
      }
    } catch (error) {
      console.error("❌ Error deleting alumni:", error)
      toast.error("Gagal menghapus alumni")
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      BEKERJA: "bg-green-100 text-green-800",
      WIRAUSAHA: "bg-blue-100 text-blue-800",
      STUDI_LANJUT: "bg-purple-100 text-purple-800",
      BELUM_BEKERJA: "bg-orange-100 text-orange-800",
    }
    const labels: Record<string, string> = {
      BEKERJA: "Bekerja",
      WIRAUSAHA: "Wirausaha",
      STUDI_LANJUT: "Studi Lanjut",
      BELUM_BEKERJA: "Mencari Kerja",
    }
    return (
      <Badge className={styles[status] || ""} variant="secondary">
        {labels[status] || status}
      </Badge>
    )
  }

  const uniqueFakultas = [...new Set(alumni.map((a) => a.fakultas))]

  // ✅ FIX 4: Only show full page loading for authentication, not for data loading
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Users className="h-12 w-12 animate-spin text-blue-500" />
          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Kelola Alumni
          </h1>
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
            Total {totalItems} alumni terdaftar
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={cn(
            theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          )}>
            <DropdownMenuItem onClick={() => handleExport("alumni")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Data Alumni
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("karier")}>
              <Briefcase className="mr-2 h-4 w-4" />
              Data Karier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("lokasi")}>
              <MapPin className="mr-2 h-4 w-4" />
              Distribusi Lokasi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("akreditasi")}>
              <FileText className="mr-2 h-4 w-4" />
              Laporan Akreditasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama, NIM, atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={fakultasFilter} onValueChange={setFakultasFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua Fakultas" />
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
            <Select value={prodiFilter} onValueChange={setProdiFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                <SelectItem value="ADM">Administrasi Bisnis</SelectItem>
                <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                <SelectItem value="PGSD">PGSD</SelectItem>
                <SelectItem value="Matematika">Matematika</SelectItem>
                <SelectItem value="Ilmu Kelautan">Ilmu Kelautan</SelectItem>
                <SelectItem value="Teknologi Hasil Pertanian">Teknologi Hasil Pertanian</SelectItem>
                <SelectItem value="Teknik Industri">Teknik Industri</SelectItem>
                <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
                <SelectItem value="Teknik Lingkungan">Teknik Lingkungan</SelectItem>
                <SelectItem value="Teknik Sipil">Teknik Sipil</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifyFilter} onValueChange={setVerifyFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status Verifikasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="verified">Terverifikasi</SelectItem>
                <SelectItem value="unverified">Belum Verifikasi</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Mencari..." : "Cari"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Alumni
          </CardTitle>
          <CardDescription>
            Menampilkan {alumni.length} dari {totalItems} alumni (Halaman {currentPage} dari {Math.max(totalPages, 1)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Fakultas</TableHead>
                  <TableHead>Angkatan</TableHead>
                  <TableHead>No HP</TableHead>
                  <TableHead>Status Karier</TableHead>
                  <TableHead>Verifikasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-8 ml-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : alumni.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                      Tidak ada data alumni ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  alumni.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-mono">{person.nim}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{person.nama}</p>
                          <p className="text-xs text-gray-500">{person.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{person.fakultas}</p>
                          <p className="text-xs text-gray-500">{person.prodi}</p>
                        </div>
                      </TableCell>
                      <TableCell>{person.angkatan}</TableCell>
                      <TableCell>{person.noHp || "-"}</TableCell>
                      <TableCell>
                        {person.karier ? getStatusBadge(person.karier.status) : "-"}
                      </TableCell>
                      <TableCell>
                        {person.isVerified ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Terverifikasi
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="mr-1 h-3 w-3" />
                            Belum
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAlumni(person)
                                setShowDetail(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleVerify(person.id, !person.isVerified)}>
                              <Shield className="mr-2 h-4 w-4" />
                              {person.isVerified ? "Batalkan Verifikasi" : "Verifikasi"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Kirim Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(person.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} alumni
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    // ✅ FIX 5: Limit rendered page buttons to avoid UI overflow on large datasets
                    .filter((page) => {
                      if (totalPages <= 7) return true
                      if (page === 1 || page === totalPages) return true
                      if (Math.abs(page - currentPage) <= 2) return true
                      return false
                    })
                    .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === "number" && (page as number) - (arr[idx - 1] as number) > 1) {
                        acc.push("...")
                      }
                      acc.push(page)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">…</span>
                      ) : (
                        <Button
                          key={item}
                          variant={currentPage === item ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(item as number)}
                          className="w-8 h-8 p-0"
                        >
                          {item}
                        </Button>
                      )
                    )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Alumni</DialogTitle>
            <DialogDescription>Informasi lengkap alumni</DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-medium">{selectedAlumni.nim}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{selectedAlumni.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedAlumni.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Angkatan</p>
                  <p className="font-medium">{selectedAlumni.angkatan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fakultas</p>
                  <p className="font-medium">{selectedAlumni.fakultas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program Studi</p>
                  <p className="font-medium">{selectedAlumni.prodi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kota Domisili</p>
                  <p className="font-medium">{selectedAlumni.kotaDomisili}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Verifikasi</p>
                  <p className="font-medium">
                    {selectedAlumni.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                  </p>
                </div>
              </div>
              {selectedAlumni.karier && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Status Karier Saat Ini</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedAlumni.karier.status)}
                  </div>
                  {selectedAlumni.karier.namaPerusahaan && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedAlumni.karier.namaPerusahaan}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}