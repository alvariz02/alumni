import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Standard CSV format for maximum Excel compatibility
function generateStandardCSV(data: any[], headers: string[]): string {
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF'
  
  // Format headers properly
  const csvHeaders = headers.join(",")
  
  // Format data rows with proper escaping
  const csvRows = data.map((row) => {
    return Object.values(row)
      .map((val) => {
        if (val === null || val === undefined) return ""
        const str = String(val)
        
        // Remove newlines and carriage returns
        const cleanStr = str.replace(/[\r\n]+/g, ' ').trim()
        
        // If contains comma, quote the field and escape any quotes
        if (cleanStr.includes(',') || cleanStr.includes('"')) {
          return `"${cleanStr.replace(/"/g, '""')}"`
        }
        
        return cleanStr
      })
      .join(",")
  })
  
  return BOM + [csvHeaders, ...csvRows].join("\r\n")
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Export API called")
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "alumni"
    const angkatan = searchParams.get("angkatan")
    const fakultas = searchParams.get("fakultas")
    const status = searchParams.get("status")
    const verified = searchParams.get("verified")

    console.log("📊 Export parameters:", { type, angkatan, fakultas, status, verified })

    // Build filter
    const where: any = {}
    if (angkatan) where.angkatan = parseInt(angkatan)
    if (fakultas) where.fakultas = fakultas
    if (verified === "true") where.isVerified = true
    if (verified === "false") where.isVerified = false

    console.log("🔍 Where clause:", where)

    let csvContent = ""
    let filename = "export"

    if (type === "alumni") {
      const alumni = await db.alumni.findMany({
        where,
        include: {
          karier: { where: { isCurrent: true }, take: 1 },
        },
        orderBy: { nama: "asc" },
      })

      console.log("📊 Alumni data found:", alumni.length)

      const data = alumni.map((a) => ({
        nim: a.nim,
        nama: a.nama,
        email: a.email,
        noHp: a.noHp || "",
        angkatan: a.angkatan,
        fakultas: a.fakultas,
        prodi: a.prodi,
        kotaDomisili: a.kotaDomisili,
        provinsiDomisili: a.provinsiDomisili,
        isVerified: a.isVerified ? "Ya" : "Tidak",
        statusKarier: a.karier[0]?.status || "Belum mengisi",
        perusahaan: a.karier[0]?.namaPerusahaan || "",
        jabatan: a.karier[0]?.jabatan || "",
      }))

      csvContent = generateStandardCSV(data, [
        "NIM", "Nama", "Email", "No HP", "Angkatan", "Fakultas", "Program Studi",
        "Kota Domisili", "Provinsi Domisili", "Terverifikasi", "Status Karier", "Perusahaan", "Jabatan"
      ])
      filename = "data-alumni"
      
      // Log sample data for debugging
      console.log("📝 Sample CSV data (first 200 chars):", csvContent.substring(0, 200))
    } else if (type === "karier") {
      const karier = await db.karier.findMany({
        where: { isCurrent: true },
        include: { alumni: true },
        orderBy: { alumni: { nama: "asc" } },
      })

      const data = karier.map((k) => ({
        nim: k.alumni.nim,
        nama: k.alumni.nama,
        fakultas: k.alumni.fakultas || "",
        prodi: k.alumni.prodi || "",
        status: k.status,
        perusahaan: k.namaPerusahaan || "",
        jabatan: k.jabatan || "",
        sektor: k.sektorIndustri || "",
        kota: k.kotaKerja || "",
        provinsi: k.provinsiKerja || "",
        sesuaiBidang: k.isSesuaiBidang ? "Ya" : "Tidak",
      }))

      csvContent = generateStandardCSV(data, [
        "NIM", "Nama", "Fakultas", "Program Studi", "Status", "Perusahaan", "Jabatan", 
        "Sektor Industri", "Kota Kerja", "Provinsi Kerja", "Sesuai Bidang"
      ])
      filename = "data-karier"
    } else if (type === "lokasi") {
      const alumni = await db.alumni.findMany({
        where,
        select: {
          nama: true,
          kotaDomisili: true,
          provinsiDomisili: true,
          negaraDomisili: true,
        },
        orderBy: { provinsiDomisili: "asc" },
      })

      const data = alumni.map((a) => ({
        nama: a.nama,
        kota: a.kotaDomisili,
        provinsi: a.provinsiDomisili,
        negara: a.negaraDomisili,
      }))

      csvContent = generateStandardCSV(data, ["Nama", "Kota", "Provinsi", "Negara"])
      filename = "distribusi-lokasi"
    } else if (type === "akreditasi") {
      // Special format for accreditation
      const alumni = await db.alumni.findMany({
        where,
        include: {
          karier: { where: { isCurrent: true }, take: 1 },
        },
      })

      // Calculate statistics
      const totalAlumni = alumni.length
      const bekerja = alumni.filter((a) => a.karier[0]?.status === "BEKERJA").length
      const wirausaha = alumni.filter((a) => a.karier[0]?.status === "WIRAUSAHA").length
      const studiLanjut = alumni.filter((a) => a.karier[0]?.status === "STUDI_LANJUT").length
      const belumBekerja = alumni.filter((a) => a.karier[0]?.status === "BELUM_BEKERJA").length

      const data = [
        { keterangan: "Total Alumni", jumlah: totalAlumni },
        { keterangan: "Alumni Bekerja", jumlah: bekerja },
        { keterangan: "Alumni Wirausaha", jumlah: wirausaha },
        { keterangan: "Alumni Studi Lanjut", jumlah: studiLanjut },
        { keterangan: "Alumni Belum Bekerja", jumlah: belumBekerja },
        { keterangan: "Tingkat Keterserapan (%)", jumlah: Math.round(((bekerja + wirausaha) / totalAlumni) * 100) || 0 },
      ]

      csvContent = generateStandardCSV(data, ["Keterangan", "Jumlah/Persentase"])
      filename = "laporan-akreditasi"
    }

    // Return CSV with proper headers for Excel compatibility
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
