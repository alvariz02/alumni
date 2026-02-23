"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface Testimoni {
  id: string
  konten: string
  status: string
  createdAt: string
}

export default function TestimoniPage() {
  const { data: session } = useSession()
  const [testimoni, setTestimoni] = useState<Testimoni[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [konten, setKonten] = useState("")

  useEffect(() => {
    fetchTestimoni()
  }, [])

  const fetchTestimoni = async () => {
    try {
      const response = await fetch("/api/testimoni")
      if (response.ok) {
        const data = await response.json()
        setTestimoni(data)
      }
    } catch (error) {
      toast.error("Gagal memuat testimoni")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!konten.trim()) {
      toast.error("Mohon tulis testimoni Anda")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ konten }),
      })

      if (response.ok) {
        toast.success("Testimoni berhasil dikirim dan menunggu persetujuan")
        setKonten("")
        fetchTestimoni()
      } else {
        throw new Error("Gagal mengirim")
      }
    } catch (error) {
      toast.error("Gagal mengirim testimoni")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Disetujui</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500"><XCircle className="mr-1 h-3 w-3" /> Ditolak</Badge>
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Menunggu</Badge>
    }
  }

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
      <div>
        <h1 className="text-2xl font-bold">Testimoni</h1>
        <p className="text-slate-500">Bagikan pengalaman Anda selama kuliah di universitas</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tulis Testimoni
          </CardTitle>
          <CardDescription>
            Ceritakan pengalaman Anda kepada calon mahasiswa dan masyarakat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Bagikan pengalaman, kesan, atau pesan Anda..."
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Mengirim..." : "Kirim Testimoni"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Testimoni Anda</CardTitle>
          <CardDescription>Daftar testimoni yang pernah Anda kirim</CardDescription>
        </CardHeader>
        <CardContent>
          {testimoni.length > 0 ? (
            <div className="space-y-4">
              {testimoni.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-600 flex-1">{item.konten}</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Belum ada testimoni. Tulis testimoni pertama Anda!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
