import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all alumni with basic info only (for performance)
    const alumni = await db.alumni.findMany({
      select: {
        id: true,
        nim: true,
        nama: true,
        email: true,
        angkatan: true,
        jurusan: true,
        prodi: true,
        kotaDomisili: true,
        provinsiDomisili: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(alumni)
  } catch (error) {
    console.error('Error fetching alumni:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alumni data' },
      { status: 500 }
    )
  }
}
