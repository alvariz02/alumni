import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Admin dashboard endpoint called")
    
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

    console.log("✅ API: Admin authenticated, fetching dashboard stats")

    // Get overall statistics
    const totalAlumni = await db.alumni.count()
    const verifiedAlumni = await db.alumni.count({ where: { isVerified: true } })
    
    // Get career statistics
    const careerStats = await db.karier.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    let employedAlumni = 0
    let entrepreneurshipAlumni = 0
    let furtherStudyAlumni = 0
    let unemployedAlumni = 0

    careerStats.forEach(stat => {
      switch (stat.status) {
        case 'BEKERJA':
          employedAlumni = stat._count.id
          break
        case 'WIRAUSAHA':
          entrepreneurshipAlumni = stat._count.id
          break
        case 'STUDI_LANJUT':
          furtherStudyAlumni = stat._count.id
          break
        case 'BELUM_BEKERJA':
          unemployedAlumni = stat._count.id
          break
      }
    })

    // Get recent alumni (last 10)
    const recentAlumni = await db.alumni.findMany({
      select: {
        id: true,
        nim: true,
        nama: true,
        email: true,
        fakultas: true,
        prodi: true,
        angkatan: true,
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
      take: 10
    })

    const recentAlumniWithCareer = recentAlumni.map((a) => ({
      ...a,
      karier: a.karier[0] || null,
    }))

    const stats = {
      totalAlumni,
      verifiedAlumni,
      employedAlumni,
      entrepreneurshipAlumni,
      furtherStudyAlumni,
      unemployedAlumni,
    }

    console.log("📊 API: Dashboard stats fetched:", stats)
    console.log("👥 API: Recent alumni fetched:", recentAlumniWithCareer.length)

    return NextResponse.json({
      stats,
      recentAlumni: recentAlumniWithCareer,
    })
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
