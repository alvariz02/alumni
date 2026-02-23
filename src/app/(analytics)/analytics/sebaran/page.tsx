"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Users, RefreshCw } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface LocationData {
  province: string
  city: string
  count: number
  lat: number
  lng: number
}

// Indonesian province coordinates (simplified)
const provinceCoords: Record<string, [number, number]> = {
  "DKI Jakarta": [-6.2088, 106.8456],
  "Jawa Barat": [-6.9175, 107.6191],
  "Jawa Tengah": [-6.9666, 110.4196],
  "Jawa Timur": [-7.2575, 112.7521],
  "Banten": [-6.4403, 106.1265],
  "DI Yogyakarta": [-7.7972, 110.3608],
  "Sumatera Utara": [3.5952, 98.6722],
  "Sumatera Selatan": [-3.3194, 103.2828],
  "Kalimantan Timur": [0.5022, 117.1536],
  "Sulawesi Selatan": [-5.1477, 119.4327],
  "Bali": [-8.3405, 115.0920],
}

export default function SebaranAlumniPage() {
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [angkatanFilter, setAngkatanFilter] = useState("all")

  useEffect(() => {
    fetchLocationData()
  }, [])

  const fetchLocationData = async () => {
    try {
      const response = await fetch("/api/analytics/sebaran")
      if (response.ok) {
        const data = await response.json()
        setLocationData(data)
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalAlumni = locationData.reduce((sum, loc) => sum + loc.count, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[500px] animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Peta Sebaran Alumni</h1>
          <p className="text-slate-500">Visualisasi distribusi geografis alumni</p>
        </div>
        <Select value={angkatanFilter} onValueChange={setAngkatanFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Angkatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Angkatan</SelectItem>
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                Angkatan {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAlumni}</p>
              <p className="text-sm text-slate-500">Total Alumni</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{locationData.length}</p>
              <p className="text-sm text-slate-500">Provinsi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-purple-100 p-3">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{locationData[0]?.province || "-"}</p>
              <p className="text-sm text-slate-500">Provinsi Terbanyak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Peta Distribusi
          </CardTitle>
          <CardDescription>
            Klik marker untuk melihat detail alumni per lokasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-lg border overflow-hidden">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationData.map((location, index) => {
                const coords = provinceCoords[location.province] || [-2.5, 118]
                return (
                  <Marker key={index} position={[coords[0] + (Math.random() - 0.5) * 0.5, coords[1] + (Math.random() - 0.5) * 0.5]}>
                    <Popup>
                      <div className="p-2">
                        <p className="font-semibold">{location.province}</p>
                        <p className="text-sm text-slate-500">{location.city}</p>
                        <Badge className="mt-2">{location.count} Alumni</Badge>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Location List */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Per Provinsi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {locationData.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{location.province}</p>
                  <p className="text-sm text-slate-500">{location.city}</p>
                </div>
                <Badge variant="secondary">{location.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
