"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  Briefcase,
  MapPin,
  Shield,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold">Tracer Alumni</span>
            <span className="text-blue-200">Universitas Pasifik Morotai UNIPAS</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-white text-black hover:bg-white hover:text-blue-900 font-semibold">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-blue-50 font-semibold">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">
          Tracer Alumni
          <br />
          <span className="text-blue-200">Universitas Pasifik Morotai UNIPAS</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
          Platform tracer study untuk mengelola data alumni, memantau perkembangan karier,
          dan menghasilkan laporan analitik untuk keperluan akreditasi.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="bg-white text-black hover:bg-blue-50 font-semibold px-8">
              Daftar Sekarang
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-blue-900 font-semibold px-8">
              Sudah Punya Akun?
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Users className="mx-auto h-12 w-12 text-blue-200" />
              <h3 className="mt-4 text-lg font-semibold">Manajemen Alumni</h3>
              <p className="mt-2 text-sm text-blue-200">
                Kelola data alumni lengkap dengan profil, karier, dan prestasi
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Briefcase className="mx-auto h-12 w-12 text-blue-200" />
              <h3 className="mt-4 text-lg font-semibold">Tracer Study</h3>
              <p className="mt-2 text-sm text-blue-200">
                Pantau perkembangan karier dan keterserapan kerja alumni
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center text-white">
              <BarChart3 className="mx-auto h-12 w-12 text-blue-200" />
              <h3 className="mt-4 text-lg font-semibold">Analytics Dashboard</h3>
              <p className="mt-2 text-sm text-blue-200">
                Visualisasi data dan statistik untuk keputusan strategis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center text-white">
              <MapPin className="mx-auto h-12 w-12 text-blue-200" />
              <h3 className="mt-4 text-lg font-semibold">Peta Sebaran</h3>
              <p className="mt-2 text-sm text-blue-200">
                Lihat distribusi geografis alumni di seluruh Indonesia
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-blue-200">1,250+</div>
            <div className="mt-2 text-blue-100">Alumni Terdaftar</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-blue-200">85%</div>
            <div className="mt-2 text-blue-100">Tingkat Keterserapan</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-blue-200">50+</div>
            <div className="mt-2 text-blue-100">Perusahaan Mitra</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-blue-200">34</div>
            <div className="mt-2 text-blue-100">Provinsi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-8 text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-200" />
            <h2 className="mt-4 text-2xl font-bold text-white">
              Keamanan & Privasi Terjamin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Data alumni dilindungi dengan enkripsi dan kebijakan privasi yang ketat.
              Pengaturan visibilitas profil sepenuhnya dikelola oleh masing-masing alumni.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">Tracer Alumni</span>
            <span className="text-blue-200">Universitas Pasifik Morotai UNIPAS</span>
          </div>
          <p className="text-sm text-blue-200">
            © 2024 Tracer Alumni - Portal Tracer Study Universitas Pasifik Morotai UNIPAS. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  )
}
