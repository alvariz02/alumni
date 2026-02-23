import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Admin prestasi endpoint called")
    
    const session = await auth()
    console.log("🔍 API: Session data:", session)
    console.log("🔍 API: User role:", session?.user?.role)
    
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      console.log("❌ API: Unauthorized - Session:", session, "Role:", session?.user?.role)
      return NextResponse.json(
        { error: "Unauthorized - Admin access required", session: session?.user?.role },
        { status: 403 }
      )
    }

    console.log("✅ API: Admin authenticated, fetching prestasi data")

    const prestasi = await db.prestasi.findMany({
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
      orderBy: { id: "desc" }
    })

    console.log("📊 API: Prestasi data fetched:", { count: prestasi.length })

    return NextResponse.json({
      prestasi,
    })
  } catch (error) {
    console.error("❌ Error fetching prestasi:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🔍 API: Admin prestasi DELETE endpoint called")
    
    const session = await auth()
    console.log("🔍 API: Session data:", session)
    console.log("🔍 API: User role:", session?.user?.role)
    
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      console.log("❌ API: Unauthorized - Session:", session, "Role:", session?.user?.role)
      return NextResponse.json(
        { error: "Unauthorized - Admin access required", session: session?.user?.role },
        { status: 403 }
      )
    }

    console.log("✅ API: Admin authenticated, processing DELETE request")

    const body = await request.json()
    console.log("🔍 API: Request body:", body)
    const { prestasiId } = body

    if (!prestasiId) {
      console.log("❌ API: Missing prestasiId")
      return NextResponse.json(
        { error: "Missing prestasiId" },
        { status: 400 }
      )
    }

    console.log("🔍 API: Deleting prestasi:", prestasiId)
    const prestasi = await db.prestasi.delete({
      where: { id: prestasiId },
      select: {
        id: true,
        judul: true,
        tahun: true,
        alumni: {
          select: {
            nama: true,
            nim: true,
          }
        }
      }
    })

    console.log("✅ API: Prestasi deleted:", prestasi)
    return NextResponse.json({
      message: "Prestasi deleted successfully",
      prestasi
    })
  } catch (error) {
    console.error("❌ Error in DELETE prestasi:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
