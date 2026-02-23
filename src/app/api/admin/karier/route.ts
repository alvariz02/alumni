import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { CareerStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Admin karier endpoint called")
    
    // Try to get session from cookies first
    const session = await auth()
    console.log("🔍 API: Session data:", session)
    console.log("🔍 API: User role:", session?.user?.role)
    
    // If auth fails, try to get from cookies as fallback
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      console.log("❌ API: Unauthorized - Session:", session, "Role:", session?.user?.role)
      return NextResponse.json(
        { error: "Unauthorized - Admin access required", session: session?.user?.role },
        { status: 403 }
      )
    }

    console.log("✅ API: Admin authenticated, proceeding with query")

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status") as CareerStatus | "all" | null
    const search = searchParams.get("search") || ""

    let whereClause: any = {}
    
    if (status !== "all" && status !== null) {
      whereClause = { status }
    }

    // Add search condition if search parameter exists
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { alumni: { nama: { contains: search, mode: "insensitive" } } },
          { alumni: { nim: { contains: search, mode: "insensitive" } } },
          { namaPerusahaan: { contains: search, mode: "insensitive" } },
        ]
      }
    }

    // Get careers directly with alumni data
    const careers = await db.karier.findMany({
      where: whereClause,
      include: {
        alumni: {
          select: {
            id: true,
            nama: true,
            nim: true,
            fakultas: true,
            prodi: true,
            angkatan: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    // Transform data to match frontend format
    const transformedCareers = careers.map(career => ({
      id: career.id,
      alumniId: career.alumniId,
      alumni: {
        id: career.alumni.id,
        nama: career.alumni.nama,
        nim: career.alumni.nim,
        fakultas: career.alumni.fakultas,
        prodi: career.alumni.prodi,
        angkatan: career.alumni.angkatan,
      },
      status: career.status,
      namaPerusahaan: career.namaPerusahaan,
      jabatan: career.jabatan,
      lokasi: career.kotaKerja,
      gaji: career.rentangGaji,
      tanggalMulai: career.tanggalMulai?.toISOString().split('T')[0] || '',
      isCurrent: career.isCurrent,
      createdAt: career.createdAt.toISOString(),
    }))

    const total = await db.karier.count({ 
      where: whereClause
    })

    console.log("💼 Career API Response:", { careers: transformedCareers.length, total })

    return NextResponse.json({
      careers: transformedCareers,
      total,
      limit,
      offset,
      status,
    })
  } catch (error) {
    console.error("Error fetching careers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, careerId, data } = body

    if (action === "update") {
      const career = await db.karier.update({
        where: { id: careerId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          alumni: {
            select: {
              id: true,
              nama: true,
              nim: true,
              fakultas: true,
              prodi: true,
              angkatan: true,
            }
          }
        }
      })

      return NextResponse.json({
        message: "Career updated successfully",
        career
      })
    }

    if (action === "delete") {
      await db.karier.delete({
        where: { id: careerId }
      })

      return NextResponse.json({
        message: "Career deleted successfully"
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error managing career:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const careerId = searchParams.get("id")

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      )
    }

    await db.karier.delete({
      where: { id: careerId }
    })

    return NextResponse.json({
      message: "Career deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting career:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
