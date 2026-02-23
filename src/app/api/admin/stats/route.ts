import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin or pimpinan
    // For now, we'll allow any authenticated user to access admin stats
    // In production, you should check the user's role

    const [
      totalAlumni,
      verifiedAlumni,
      unverifiedAlumni,
      careerStats,
      pendingTestimonials,
    ] = await Promise.all([
      db.alumni.count(),
      db.alumni.count({ where: { isVerified: true } }),
      db.alumni.count({ where: { isVerified: false } }),
      db.karier.groupBy({
        by: ["status"],
        where: { isCurrent: true },
        _count: true,
      }),
      db.testimoni.count({ where: { status: "PENDING" } }),
    ])

    const employedAlumni = careerStats.find((c) => c.status === "BEKERJA")?._count || 0
    const entrepreneurshipAlumni = careerStats.find((c) => c.status === "WIRAUSAHA")?._count || 0
    const furtherStudyAlumni = careerStats.find((c) => c.status === "STUDI_LANJUT")?._count || 0
    const unemployedAlumni = careerStats.find((c) => c.status === "BELUM_BEKERJA")?._count || 0

    return NextResponse.json({
      totalAlumni,
      verifiedAlumni,
      unverifiedAlumni,
      employedAlumni,
      entrepreneurshipAlumni,
      furtherStudyAlumni,
      unemployedAlumni,
      pendingTestimonials,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
