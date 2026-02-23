"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Send, Users, Building2, GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BroadcastPage() {
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    target: "all",
    jurusan: "",
    angkatan: "",
  })

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.content) {
      toast.error("Mohon lengkapi subjek dan konten email")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Email berhasil dikirim ke ${result.sent} alumni`)
        setFormData({
          subject: "",
          content: "",
          target: "all",
          jurusan: "",
          angkatan: "",
        })
      } else {
        throw new Error("Gagal mengirim")
      }
    } catch (error) {
      toast.error("Gagal mengirim email broadcast")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Broadcast Email</h1>
        <p className="text-slate-500">Kirim email ke semua alumni atau grup tertentu</p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Semua</p>
              <p className="text-sm text-slate-500">Total Alumni</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Per Jurusan</p>
              <p className="text-sm text-slate-500">Filter jurusan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-purple-100 p-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Per Angkatan</p>
              <p className="text-sm text-slate-500">Filter tahun</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Kirim Email Broadcast
          </CardTitle>
          <CardDescription>
            Email akan dikirim melalui layanan email yang telah dikonfigurasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-6">
            {/* Target Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Penerima</Label>
                <Select
                  value={formData.target}
                  onValueChange={(value) => setFormData({ ...formData, target: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Alumni</SelectItem>
                    <SelectItem value="jurusan">Per Jurusan</SelectItem>
                    <SelectItem value="angkatan">Per Angkatan</SelectItem>
                    <SelectItem value="unverified">Belum Terverifikasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.target === "jurusan" && (
                <div className="space-y-2">
                  <Label>Pilih Jurusan</Label>
                  <Select
                    value={formData.jurusan}
                    onValueChange={(value) => setFormData({ ...formData, jurusan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
                      <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                      <SelectItem value="Manajemen">Manajemen</SelectItem>
                      <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                      <SelectItem value="Hukum">Hukum</SelectItem>
                      <SelectItem value="Kedokteran">Kedokteran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.target === "angkatan" && (
                <div className="space-y-2">
                  <Label>Pilih Angkatan</Label>
                  <Select
                    value={formData.angkatan}
                    onValueChange={(value) => setFormData({ ...formData, angkatan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih angkatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Angkatan {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Email Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subjek Email</Label>
                <Input
                  id="subject"
                  placeholder="Contoh: Pengumutan Tracer Study 2024"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten Email</Label>
                <Textarea
                  id="content"
                  placeholder="Tulis isi email di sini..."
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <p className="text-xs text-slate-500">
                  Gunakan {"{nama}"} untuk menyisipkan nama alumni secara otomatis
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setFormData({
                subject: "",
                content: "",
                target: "all",
                jurusan: "",
                angkatan: "",
              })}>
                Reset
              </Button>
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Fitur ini memerlukan konfigurasi layanan email (Resend/SendGrid). 
            Pastikan sudah mengatur API key yang sesuai di environment variables.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
