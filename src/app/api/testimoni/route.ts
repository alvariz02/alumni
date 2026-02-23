import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all testimonials (for demo purposes)
    const testimoni = await db.testimoni.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        alumni: {
          select: {
            nama: true,
            angkatan: true,
            jurusan: true,
          }
        }
      }
    })

    return NextResponse.json(testimoni)
  } catch (error) {
    console.error("Error fetching testimoni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { konten, alumniId } = body

    if (!konten || konten.trim() === "") {
      return NextResponse.json({ error: "Konten tidak boleh kosong" }, { status: 400 })
    }

    // Use provided alumniId or get first alumni for demo
    let targetAlumniId = alumniId
    if (!targetAlumniId) {
      const firstAlumni = await db.alumni.findFirst()
      if (!firstAlumni) {
        return NextResponse.json({ error: "No alumni found" }, { status: 404 })
      }
      targetAlumniId = firstAlumni.id
    }

    const testimoni = await db.testimoni.create({
      data: {
        alumniId: targetAlumniId,
        konten: konten.trim(),
        status: "PENDING",
      },
    })

    return NextResponse.json(testimoni)
  } catch (error) {
    console.error("Error creating testimoni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
