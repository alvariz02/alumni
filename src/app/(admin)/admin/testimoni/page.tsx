"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { toast } from "sonner"

interface Testimoni {
  id: string
  konten: string
  status: string
  createdAt: string
  alumni: {
    nama: string
    email: string
    jurusan: string
    angkatan: number
  }
}

export default function AdminTestimoniPage() {
  const [testimoni, setTestimoni] = useState<Testimoni[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimoni, setSelectedTestimoni] = useState<Testimoni | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchTestimoni()
  }, [])

  const fetchTestimoni = async () => {
    try {
      const response = await fetch("/api/admin/testimoni")
      if (response.ok) {
        const data = await response.json()
        setTestimoni(data)
      }
    } catch (error) {
      toast.error("Gagal memuat data testimoni")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/testimoni/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      })

      if (response.ok) {
        toast.success("Testimoni disetujui")
        fetchTestimoni()
        setShowDetail(false)
      } else {
        throw new Error("Gagal update")
      }
    } catch (error) {
      toast.error("Gagal menyetujui testimoni")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/testimoni/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      })

      if (response.ok) {
        toast.success("Testimoni ditolak")
        fetchTestimoni()
        setShowDetail(false)
      } else {
        throw new Error("Gagal update")
      }
    } catch (error) {
      toast.error("Gagal menolak testimoni")
    } finally {
      setProcessing(false)
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

  const pendingCount = testimoni.filter((t) => t.status === "PENDING").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderasi Testimoni</h1>
          <p className="text-slate-500">Setujui atau tolak testimoni dari alumni</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-orange-500">
            {pendingCount} menunggu persetujuan
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-orange-100 p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-slate-500">Menunggu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{testimoni.filter((t) => t.status === "APPROVED").length}</p>
              <p className="text-sm text-slate-500">Disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{testimoni.filter((t) => t.status === "REJECTED").length}</p>
              <p className="text-sm text-slate-500">Ditolak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimoni List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Daftar Testimoni
          </CardTitle>
          <CardDescription>
            Total {testimoni.length} testimoni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimoni.length > 0 ? (
            <div className="space-y-4">
              {testimoni.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{item.alumni.nama}</span>
                      <span className="text-sm text-slate-500">
                        ({item.alumni.jurusan} - {item.alumni.angkatan})
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.konten}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTestimoni(item)
                      setShowDetail(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Belum ada testimoni
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Testimoni</DialogTitle>
            <DialogDescription>
              Informasi lengkap testimoni
            </DialogDescription>
          </DialogHeader>
          {selectedTestimoni && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Nama</p>
                  <p className="font-medium">{selectedTestimoni.alumni.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{selectedTestimoni.alumni.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Jurusan</p>
                  <p className="font-medium">{selectedTestimoni.alumni.jurusan}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Angkatan</p>
                  <p className="font-medium">{selectedTestimoni.alumni.angkatan}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">Isi Testimoni</p>
                <div className="rounded-lg border p-3 bg-slate-50">
                  <p className="text-sm">{selectedTestimoni.konten}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(selectedTestimoni.status)}</div>
                <p className="text-xs text-slate-400">
                  {new Date(selectedTestimoni.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedTestimoni?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleReject(selectedTestimoni.id)}
                  disabled={processing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedTestimoni.id)}
                  disabled={processing}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Setujui
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
