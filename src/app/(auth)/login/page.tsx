"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nim, setNim] = useState("")

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        nim, // Include NIM for alumni login
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email, password, atau NIM salah")
        setIsLoading(false)
        return
      }

      toast.success("Login berhasil!")
      setIsLoading(false)
      
      // Fetch session to get user role and redirect accordingly
      setTimeout(async () => {
        try {
          const sessionRes = await fetch('/api/auth/session')
          const session = await sessionRes.json()
          
          const userRole = session?.user?.role
          
          // Redirect based on user role
          if (userRole === 'ADMIN' || userRole === 'PIMPINAN') {
            window.location.href = '/admin'
          } else {
            window.location.href = '/dashboard'
          }
        } catch (err) {
          // Fallback to dashboard if session fetch fails
          window.location.href = '/dashboard'
        }
      }, 500)
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Terjadi kesalahan saat login")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-900">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>
            Masuk ke Portal Alumni Universitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (untuk admin)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nim">NIM (untuk alumni)</Label>
              <Input
                id="nim"
                type="text"
                placeholder="2021001"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-900 hover:underline font-medium">
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
