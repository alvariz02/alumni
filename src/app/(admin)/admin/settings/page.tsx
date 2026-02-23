"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  Database,
  Key
} from "lucide-react"

interface SettingsData {
  siteName: string
  siteDescription: string
  contactEmail: string
  enableNotifications: boolean
  enableEmailBroadcast: boolean
  autoVerifyAlumni: boolean
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "KP Alumni",
    siteDescription: "Sistem Tracer Study Alumni",
    contactEmail: "admin@alumni.ac.id",
    enableNotifications: true,
    enableEmailBroadcast: true,
    autoVerifyAlumni: false,
  })

  useEffect(() => {
    console.log("🔄 Settings Page - Status:", status, "Role:", session?.user?.role)
    
    const userRole = session?.user?.role
    if (status === "authenticated" && (userRole === "ADMIN" || userRole === "PIMPINAN")) {
      console.log("✅ Admin authenticated, loading settings...")
      fetchSettings()
    } else if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting...")
      window.location.href = "/login"
    }
  }, [session, status])

  const fetchSettings = async () => {
    try {
      console.log("🔄 Fetching settings...")
      // In a real app, you would fetch settings from an API
      // For now, we'll use the default settings
      setLoading(false)
    } catch (error) {
      console.error("❌ Error fetching settings:", error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveSuccess(false)
      
      console.log("💾 Saving settings:", settings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("✅ Settings saved successfully")
      setSaveSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("❌ Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Settings className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-white">
            {status === "loading" ? "Checking authentication..." : "Loading settings..."}
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pengaturan</h1>
            <p className="mt-2 text-slate-100">
              Konfigurasi sistem dan pengaturan admin
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Badge className="bg-white/20 text-white">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Badge>
              <Badge className="bg-white/20 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                {session?.user?.name || "Admin"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Pengaturan berhasil disimpan!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Konfigurasi dasar sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nama Situs</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="Nama situs Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Kontak</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Situs</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  placeholder="Deskripsi singkat tentang sistem"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Verifikasi Alumni</Label>
                  <p className="text-sm text-slate-500">
                    Otomatis verifikasi alumni baru setelah registrasi
                  </p>
                </div>
                <Switch
                  checked={settings.autoVerifyAlumni}
                  onCheckedChange={(checked) => handleChange("autoVerifyAlumni", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pengaturan Email
              </CardTitle>
              <CardDescription>
                Konfigurasi server email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.contoh.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    placeholder="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">Email Pengirim</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@contoh.com"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base">Aktifkan Broadcast Email</Label>
                  <p className="text-sm text-slate-500">
                    Izinkan admin mengirim email broadcast ke alumni
                  </p>
                </div>
                <Switch
                  checked={settings.enableEmailBroadcast}
                  onCheckedChange={(checked) => handleChange("enableEmailBroadcast", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola notifikasi sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifikasi Email</Label>
                  <p className="text-sm text-slate-500">
                    Kirim notifikasi via email untuk aktivitas penting
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleChange("enableNotifications", checked)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notifikasi yang akan diterima:</h4>
                <div className="space-y-3">
                  {[
                    { label: "Pendaftaran alumni baru", description: "Notifikasi saat ada alumni baru terdaftar" },
                    { label: "Verifikasi alumni", description: "Notifikasi saat ada alumni需要 verifikasi" },
                    { label: "Testimoni baru", description: "Notifikasi saat ada testimoni需要 moderasi" },
                    { label: "Update data karier", description: "Notifikasi saat ada update data karier" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>
                Konfigurasi keamanan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    defaultValue="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    defaultValue="5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500">
                    Wajibkan 2FA untuk semua admin
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base">Log Aktivitas Admin</Label>
                  <p className="text-sm text-slate-500">
                    Catat semua aktivitas admin untuk audit
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>API Keys</Label>
                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium">API Key</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                  </div>
                  <Input
                    type="password"
                    value="••••••••••••••••••••••••••••••••"
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Admin
              </CardTitle>
              <CardDescription>
                Kelola informasi profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Nama Lengkap</Label>
                  <Input
                    id="adminName"
                    defaultValue={session?.user?.name || ""}
                    placeholder="Nama lengkap Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone">Nomor Telepon</Label>
                <Input
                  id="adminPhone"
                  type="tel"
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => fetchSettings()}>
          Reset
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
