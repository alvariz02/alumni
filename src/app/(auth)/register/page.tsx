"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

const fakultasList = [
  "Fakultas Ekonomi",
  "Fakultas ilmu sosial dan ilmu politik",
  "Fakultas Keguruan dan Ilmu Pendidikan",
  "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  "Fakultas Perikanan dan Ilmu kelautan",
  "Fakultas Teknik",
]

const prodiByFakultas: Record<string, string[]> = {
  "Fakultas Ekonomi": ["Akuntansi", "ADM", "Manajemen", "Ekonomi Pembangunan"],
  "Fakultas ilmu sosial dan ilmu politik": ["Ilmu Politik", "Sosiologi", "Ilmu Administrasi Negara", "Hubungan Internasional"],
  "Fakultas Keguruan dan Ilmu Pendidikan": ["PGSD", "PGPAUD", "Pendidikan Bahasa Inggris", "Pendidikan Matematika", "Bimbingan Konseling"],
  "Fakultas Matematika dan Ilmu Pengetahuan Alam": ["Matematika", "Fisika", "Kimia", "Biologi", "Teknologi Hasil Pertanian"],
  "Fakultas Perikanan dan Ilmu kelautan": ["Ilmu Kelautan", "Perikanan", "Budidaya Perairan", "Teknologi Hasil Perikanan"],
  "Fakultas Teknik": ["Teknik Informatika", "Teknik Sipil", "Teknik Industri", "Teknik Lingkungan", "Teknik Elektro", "Teknik Mesin"],
}

const currentYear = new Date().getFullYear()
const angkatanList = Array.from({ length: 10 }, (_, i) => currentYear - i)

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    angkatan: "",
    fakultas: "",
    prodi: "",
    noHp: "",
    kotaDomisili: "",
    provinsiDomisili: "",
  })

  const [prodiList, setProdiList] = useState<string[]>([])

  const handleFakultasChange = (fakultas: string) => {
    setFormData({ ...formData, fakultas, prodi: "" })
    setProdiList(prodiByFakultas[fakultas] || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Validate NIM and email format
      if (!formData.nim || !formData.nama || !formData.email) {
        toast.error("Mohon lengkapi semua field")
        return
      }
      setStep(2)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak sama")
      return
    }

    if (!formData.fakultas || !formData.prodi || !formData.angkatan) {
      toast.error("Mohon lengkapi data akademik")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: formData.nim,
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          angkatan: parseInt(formData.angkatan),
          fakultas: formData.fakultas,
          prodi: formData.prodi,
          noHp: formData.noHp,
          kotaDomisili: formData.kotaDomisili || "Jakarta",
          provinsiDomisili: formData.provinsiDomisili || "DKI Jakarta",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal")
      }

      toast.success("Registrasi berhasil! Silakan login.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat registrasi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-900">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Registrasi Alumni</CardTitle>
          <CardDescription>
            Langkah {step} dari 2 - {step === 1 ? "Data Akun" : "Data Akademik"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nim">NIM (Nomor Induk Mahasiswa)</Label>
                  <Input
                    id="nim"
                    type="text"
                    placeholder="Contoh: 2020120001"
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    type="text"
                    placeholder="Nama sesuai ijazah"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="angkatan">Tahun Angkatan</Label>
                  <Select
                    value={formData.angkatan}
                    onValueChange={(value) => setFormData({ ...formData, angkatan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun angkatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {angkatanList.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noHp">Nomor HP/WA</Label>
                  <Input
                    id="noHp"
                    type="tel"
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fakultas">Fakultas</Label>
                  <Select value={formData.fakultas} onValueChange={handleFakultasChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih fakultas" />
                    </SelectTrigger>
                    <SelectContent>
                      {fakultasList.map((fakultas) => (
                        <SelectItem key={fakultas} value={fakultas}>
                          {fakultas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prodi">Program Studi</Label>
                  <Select
                    value={formData.prodi}
                    onValueChange={(value) => setFormData({ ...formData, prodi: value })}
                    disabled={!formData.fakultas}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program studi" />
                    </SelectTrigger>
                    <SelectContent>
                      {prodiList.map((prodi) => (
                        <SelectItem key={prodi} value={prodi}>
                          {prodi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kotaDomisili">Kota Domisili</Label>
                    <Input
                      id="kotaDomisili"
                      type="text"
                      placeholder="Contoh: Jakarta"
                      value={formData.kotaDomisili}
                      onChange={(e) => setFormData({ ...formData, kotaDomisili: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provinsiDomisili">Provinsi</Label>
                    <Input
                      id="provinsiDomisili"
                      type="text"
                      placeholder="Contoh: DKI Jakarta"
                      value={formData.provinsiDomisili}
                      onChange={(e) => setFormData({ ...formData, provinsiDomisili: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Kembali
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-blue-900 hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 1 ? "Lanjutkan" : "Daftar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-900 hover:underline font-medium">
              Masuk di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
