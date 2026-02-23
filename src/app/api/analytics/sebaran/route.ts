import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Indonesian province coordinates (simplified)
const provinceCoords: Record<string, { lat: number; lng: number }> = {
  "DKI Jakarta": { lat: -6.2088, lng: 106.8456 },
  "Jawa Barat": { lat: -6.9175, lng: 107.6191 },
  "Jawa Tengah": { lat: -6.9666, lng: 110.4196 },
  "Jawa Timur": { lat: -7.2575, lng: 112.7521 },
  "Banten": { lat: -6.4403, lng: 106.1265 },
  "DI Yogyakarta": { lat: -7.7972, lng: 110.3608 },
  "Sumatera Utara": { lat: 3.5952, lng: 98.6722 },
  "Sumatera Selatan": { lat: -3.3194, lng: 103.2828 },
  "Kalimantan Timur": { lat: 0.5022, lng: 117.1536 },
  "Sulawesi Selatan": { lat: -5.1477, lng: 119.4327 },
  "Bali": { lat: -8.3405, lng: 115.0920 },
}

export async function GET() {
  try {
    const alumniByProvince = await db.alumni.groupBy({
      by: ["provinsiDomisili"],
      _count: true,
      orderBy: { _count: { provinsiDomisili: "desc" } },
    })

    // Also get city breakdown for each province
    const alumniByCity = await db.alumni.groupBy({
      by: ["provinsiDomisili", "kotaDomisili"],
      _count: true,
    })

    // Combine data
    const result = alumniByProvince.map((p) => {
      const cities = alumniByCity
        .filter((c) => c.provinsiDomisili === p.provinsiDomisili)
        .map((c) => ({ city: c.kotaDomisili, count: c._count }))
      
      const coords = provinceCoords[p.provinsiDomisili] || { lat: -2.5, lng: 118 }
      
      return {
        province: p.provinsiDomisili,
        city: cities[0]?.city || p.provinsiDomisili,
        count: p._count,
        lat: coords.lat,
        lng: coords.lng,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching sebaran data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
