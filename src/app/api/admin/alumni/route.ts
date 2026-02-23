import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Admin alumni endpoint called")
    
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

    console.log("✅ API: Admin authenticated, proceeding with query")

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const filter = searchParams.get("filter") || "all"
    const search = searchParams.get("search") || ""
    const fakultas = searchParams.get("fakultas") || ""
    const prodi = searchParams.get("prodi") || ""

    console.log("🔍 API: Query params:", { limit, offset, filter, search, fakultas, prodi })

    let whereClause: any = {}
    
    if (filter === "verified") {
      whereClause = { isVerified: true }
    } else if (filter === "unverified") {
      whereClause = { isVerified: false }
    }

    // Add search condition if search parameter exists
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { nama: { contains: search, mode: "insensitive" } },
          { nim: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      }
    }

    // Add fakultas filter
    if (fakultas && fakultas !== "all") {
      whereClause = {
        ...whereClause,
        fakultas: { contains: fakultas, mode: "insensitive" }
      }
    }

    // Add prodi filter
    if (prodi && prodi !== "all") {
      whereClause = {
        ...whereClause,
        prodi: { contains: prodi, mode: "insensitive" }
      }
    }

    console.log("🔍 API: Where clause:", JSON.stringify(whereClause, null, 2))

    const alumni = await db.alumni.findMany({
      where: whereClause,
      select: {
        id: true,
        nim: true,
        nama: true,
        email: true,
        angkatan: true,
        fakultas: true,
        prodi: true,
        noHp: true,
        kotaDomisili: true,
        isVerified: true,
        createdAt: true,
        karier: {
          where: { isCurrent: true },
          select: {
            status: true,
            namaPerusahaan: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 50), // Maximum 50 items per request
      skip: offset,
    })

    console.log("👥 API: Raw alumni data:", alumni.map(a => ({
      id: a.id,
      nama: a.nama,
      fakultas: a.fakultas,
      prodi: a.prodi,
      noHp: a.noHp
    })))

    const result = alumni.map((a) => ({
      ...a,
      karier: a.karier[0] || null,
    }))

    const total = await db.alumni.count({ where: whereClause })

    console.log("👥 API: Alumni data fetched:", { 
      requested: limit, 
      returned: result.length, 
      total,
      offset,
      queryTime: Date.now()
    })

    return NextResponse.json({
      alumni: result,
      total,
      limit,
      offset,
      filter,
      search,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error("❌ Error fetching alumni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 API: Admin alumni POST endpoint called")
    
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

    console.log("✅ API: Admin authenticated, processing POST request")

    const body = await request.json()
    console.log("🔍 API: Request body:", body)
    const { action, alumniId } = body

    if (action === "verify") {
      console.log("🔍 API: Verifying alumni:", alumniId)
      const alumni = await db.alumni.update({
        where: { id: alumniId },
        data: { isVerified: true },
        select: {
          id: true,
          nama: true,
          nim: true,
          email: true,
          isVerified: true,
        }
      })

      console.log("✅ API: Alumni verified:", alumni)
      return NextResponse.json({
        message: "Alumni verified successfully",
        alumni
      })
    }

    if (action === "unverify") {
      console.log("🔍 API: Unverifying alumni:", alumniId)
      const alumni = await db.alumni.update({
        where: { id: alumniId },
        data: { isVerified: false },
        select: {
          id: true,
          nama: true,
          nim: true,
          email: true,
          isVerified: true,
        }
      })

      console.log("✅ API: Alumni unverified:", alumni)
      return NextResponse.json({
        message: "Alumni unverified successfully",
        alumni
      })
    }

    if (action === "delete") {
      console.log("🔍 API: Deleting alumni:", alumniId)
      const alumni = await db.alumni.delete({
        where: { id: alumniId },
        select: {
          id: true,
          nama: true,
          nim: true,
          email: true,
          fakultas: true,
          angkatan: true,
          isVerified: true,
        }
      })

      return NextResponse.json({
        message: "Alumni updated successfully",
        alumni
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error managing alumni:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🔍 API: Admin alumni DELETE endpoint called")
    
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
    const { alumniId } = body

    if (!alumniId) {
      console.log("❌ API: Missing alumniId")
      return NextResponse.json(
        { error: "Missing alumniId" },
        { status: 400 }
      )
    }

    console.log("🔍 API: Deleting alumni:", alumniId)
    const alumni = await db.alumni.delete({
      where: { id: alumniId },
      select: {
        id: true,
        nama: true,
        nim: true,
        email: true,
        fakultas: true,
        angkatan: true,
        isVerified: true,
      }
    })

    console.log("✅ API: Alumni deleted:", alumni)
    return NextResponse.json({
      message: "Alumni deleted successfully",
      alumni
    })
  } catch (error) {
    console.error("❌ Error in DELETE alumni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
