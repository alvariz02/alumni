import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get counts in parallel for better performance
    const [
      totalAlumni,
      alumniWithCareer,
      alumniWithAchievements
    ] = await Promise.all([
      db.alumni.count(),
      db.alumni.count({
        where: {
          karier: {
            some: {}
          }
        }
      }),
      db.alumni.count({
        where: {
          prestasi: {
            some: {}
          }
        }
      })
    ])

    // Calculate profile completion percentage
    const profileCompletion = totalAlumni > 0 ? Math.round((alumniWithCareer / totalAlumni) * 100) : 0

    const stats = {
      totalAlumni,
      alumniWithCareer,
      alumniWithAchievements,
      profileCompletion,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
