"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Linkedin,
  Filter,
  Users,
  Phone,
} from "lucide-react"

interface Alumni {
  id: string
  nama: string
  angkatan: number
  fakultas: string
  prodi: string
  noHp: string | null
  kotaDomisili: string
  provinsiDomisili: string
  avatarUrl: string | null
  linkedinUrl: string | null
  profileVisibility: string
  karier: {
    status: string
    namaPerusahaan: string | null
    jabatan: string | null
  } | null
}

const fakultasList = [
  "Semua Fakultas",
  "Fakultas Ekonomi",
  "Fakultas ilmu sosial dan ilmu politik",
  "Fakultas Keguruan dan Ilmu Pendidikan",
  "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  "Fakultas Perikanan dan Ilmu kelautan",
  "Fakultas Teknik",
]

const angkatanList = ["Semua Angkatan", "2024", "2023", "2022", "2021", "2020", "2019", "2018"]

export default function NetworkPage() {
  const [loading, setLoading] = useState(true)
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [fakultasFilter, setFakultasFilter] = useState("Semua Fakultas")
  const [angkatanFilter, setAngkatanFilter] = useState("Semua Angkatan")

  useEffect(() => {
    fetchAlumni()
  }, [])

  useEffect(() => {
    filterAlumni()
  }, [searchQuery, fakultasFilter, angkatanFilter, alumni])

  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/alumni/network")
      if (response.ok) {
        const data = await response.json()
        setAlumni(data)
        setFilteredAlumni(data)
      }
    } catch (error) {
      console.error("Error fetching alumni:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAlumni = () => {
    let filtered = [...alumni]

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.kotaDomisili.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (fakultasFilter !== "Semua Fakultas") {
      filtered = filtered.filter((a) => a.fakultas === fakultasFilter)
    }

    if (angkatanFilter !== "Semua Angkatan") {
      filtered = filtered.filter((a) => a.angkatan === parseInt(angkatanFilter))
    }

    setFilteredAlumni(filtered)
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
      <Badge className={styles[status] || ""}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Jaringan Alumni</h1>
        <p className="text-slate-500">Temukan dan terhubung dengan sesama alumni</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari nama, jurusan, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={fakultasFilter} onValueChange={setFakultasFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Fakultas" />
              </SelectTrigger>
              <SelectContent>
                {fakultasList.map((fakultas) => (
                  <SelectItem key={fakultas} value={fakultas}>
                    {fakultas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={angkatanFilter} onValueChange={setAngkatanFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Angkatan" />
              </SelectTrigger>
              <SelectContent>
                {angkatanList.map((angkatan) => (
                  <SelectItem key={angkatan} value={angkatan}>
                    {angkatan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-slate-500" />
        <p className="text-slate-500">
          Menampilkan <span className="font-semibold text-slate-900">{filteredAlumni.length}</span> dari{" "}
          <span className="font-semibold text-slate-900">{alumni.length}</span> alumni
        </p>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((person) => (
            <Card key={person.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.avatarUrl || ""} />
                    <AvatarFallback className="bg-blue-900 text-white">
                      {person.nama.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{person.nama}</h3>
                    <p className="text-sm text-slate-500">{person.prodi}</p>
                    <p className="text-sm text-slate-500">Angkatan {person.angkatan}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {person.karier && (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(person.karier.status)}
                    </div>
                  )}
                  
                  {person.karier?.namaPerusahaan && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{person.karier.namaPerusahaan}</span>
                    </div>
                  )}

                  {person.karier?.jabatan && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{person.karier.jabatan}</span>
                    </div>
                  )}

                  {person.noHp && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{person.noHp}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{person.kotaDomisili}, {person.provinsiDomisili}</span>
                  </div>
                </div>

                {person.linkedinUrl && (
                  <div className="mt-4 pt-3 border-t">
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold">Tidak Ada Hasil</h3>
            <p className="mt-2 text-center text-slate-500">
              Tidak ada alumni yang sesuai dengan pencarian Anda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
