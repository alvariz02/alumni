import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const testimoni = await db.testimoni.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        alumni: {
          select: {
            id: true,
            nama: true,
            email: true,
            angkatan: true,
            jurusan: true,
          }
        }
      }
    })

    return NextResponse.json(testimoni)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
