"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Users,
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Calendar, 
  GraduationCap,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Shield
} from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AlumniProfile {
  id: string
  nim: string
  nama: string
  email: string
  noHp: string | null
  linkedinUrl: string | null
  angkatan: number
  jurusan: string
  prodi: string
  kotaDomisili: string
  provinsiDomisili: string
  negaraDomisili: string
  avatarUrl: string | null
  profileVisibility: string
  isVerified: boolean
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<AlumniProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    nama: "",
    noHp: "",
    linkedinUrl: "",
    kotaDomisili: "",
    provinsiDomisili: "",
    profileVisibility: "PUBLIC",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/alumni/me")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          nama: data.nama,
          noHp: data.noHp || "",
          linkedinUrl: data.linkedinUrl || "",
          kotaDomisili: data.kotaDomisili,
          provinsiDomisili: data.provinsiDomisili,
          profileVisibility: data.profileVisibility,
        })
      }
    } catch (error) {
      toast.error("Gagal memuat profil")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/alumni/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updated = await response.json()
        setProfile(updated)
        setIsEditing(false)
        toast.success("Profil berhasil diperbarui")
      } else {
        throw new Error("Gagal menyimpan")
      }
    } catch (error) {
      toast.error("Gagal menyimpan profil")
    } finally {
      setSaving(false)
    }
  }

  const calculateProfileCompletion = () => {
    if (!profile) return 0
    const fields = [
      profile.nama,
      profile.noHp,
      profile.linkedinUrl,
      profile.kotaDomisili,
      profile.provinsiDomisili,
    ]
    const filledFields = fields.filter((f) => f && f.trim() !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">Profil tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profil Saya</h1>
          <p className="text-slate-500">Kelola informasi profil dan pengaturan visibilitas</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage src={profile.avatarUrl || ""} />
                <AvatarFallback className="text-3xl bg-blue-900 text-white">
                  {profile.nama.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Badge 
                variant={profile.isVerified ? "default" : "secondary"}
                className={profile.isVerified ? "bg-green-600" : ""}
              >
                {profile.isVerified ? (
                  <>
                    <Shield className="mr-1 h-3 w-3" />
                    Terverifikasi
                  </>
                ) : (
                  "Belum Terverifikasi"
                )}
              </Badge>
              <div className="text-center">
                <p className="text-sm text-slate-500">Kelengkapan Profil</p>
                <p className="text-lg font-semibold">{calculateProfileCompletion()}%</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4" /> Nama Lengkap
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{profile.nama}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-4 w-4" /> No. HP
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                    />
                  ) : (
                    <p className="font-medium">{profile.noHp || "-"}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-slate-500">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile.linkedinUrl ? (
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.linkedinUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Informasi Akademik
          </CardTitle>
          <CardDescription>Data akademik tidak dapat diubah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">NIM</p>
              <p className="font-medium">{profile.nim}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Angkatan</p>
              <p className="font-medium">{profile.angkatan}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Jurusan</p>
              <p className="font-medium">{profile.jurusan}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Program Studi</p>
              <p className="font-medium">{profile.prodi}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Privacy */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Domisili
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Kota</Label>
              {isEditing ? (
                <Input
                  value={formData.kotaDomisili}
                  onChange={(e) => setFormData({ ...formData, kotaDomisili: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.kotaDomisili}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Provinsi</Label>
              {isEditing ? (
                <Input
                  value={formData.provinsiDomisili}
                  onChange={(e) => setFormData({ ...formData, provinsiDomisili: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.provinsiDomisili}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Negara</Label>
              <p className="font-medium">{profile.negaraDomisili}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Pengaturan Privasi
            </CardTitle>
            <CardDescription>
              Kontrol siapa yang dapat melihat profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Visibilitas Profil</Label>
              {isEditing ? (
                <Select
                  value={formData.profileVisibility}
                  onValueChange={(value) => setFormData({ ...formData, profileVisibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Publik - Semua orang dapat melihat
                      </div>
                    </SelectItem>
                    <SelectItem value="ALUMNI_ONLY">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Alumni Only - Hanya sesama alumni
                      </div>
                    </SelectItem>
                    <SelectItem value="PRIVATE">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Privat - Hanya Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-2">
                  <Badge variant="outline">
                    {profile.profileVisibility === "PUBLIC" && "Publik"}
                    {profile.profileVisibility === "ALUMNI_ONLY" && "Alumni Only"}
                    {profile.profileVisibility === "PRIVATE" && "Privat"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
