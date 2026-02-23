import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all alumni with public or alumni-only visibility
    const alumni = await db.alumni.findMany({
      where: {
        OR: [
          { profileVisibility: "PUBLIC" },
          { profileVisibility: "ALUMNI_ONLY" },
        ],
      },
      select: {
        id: true,
        nama: true,
        angkatan: true,
        fakultas: true,
        prodi: true,
        noHp: true,
        kotaDomisili: true,
        provinsiDomisili: true,
        avatarUrl: true,
        linkedinUrl: true,
        profileVisibility: true,
        karier: {
          where: { isCurrent: true },
          select: {
            status: true,
            namaPerusahaan: true,
            jabatan: true,
          },
          take: 1,
        },
      },
      orderBy: { nama: "asc" },
    })

    // Transform data
    const result = alumni.map((a) => ({
      ...a,
      karier: a.karier[0] || null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching alumni network:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
