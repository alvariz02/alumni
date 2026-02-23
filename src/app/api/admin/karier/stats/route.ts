import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "PIMPINAN")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    // Get career statistics
    const careerStats = await db.karier.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    const stats = {
      totalCareers: 0,
      employedAlumni: 0,
      entrepreneurshipAlumni: 0,
      furtherStudyAlumni: 0,
      unemployedAlumni: 0,
    }

    careerStats.forEach(stat => {
      stats.totalCareers += stat._count.id
      switch (stat.status) {
        case 'BEKERJA':
          stats.employedAlumni = stat._count.id
          break
        case 'WIRAUSAHA':
          stats.entrepreneurshipAlumni = stat._count.id
          break
        case 'STUDI_LANJUT':
          stats.furtherStudyAlumni = stat._count.id
          break
        case 'BELUM_BEKERJA':
          stats.unemployedAlumni = stat._count.id
          break
      }
    })

    // Get top companies
    const topCompanies = await db.karier.groupBy({
      by: ['namaPerusahaan'],
      where: {
        namaPerusahaan: {
          not: null
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get career by fakultas
    const careerByFakultas = await db.alumni.findMany({
      select: {
        fakultas: true,
        karier: {
          select: {
            status: true
          }
        }
      }
    })

    const fakultasStats = careerByFakultas.reduce((acc, alumni) => {
      const fakultas = alumni.fakultas
      if (!acc[fakultas]) {
        acc[fakultas] = {
          fakultas,
          total: 0,
          employed: 0
        }
      }
      acc[fakultas].total += 1
      if (alumni.karier.length > 0) {
        acc[fakultas].employed += 1
      }
      return acc
    }, {} as Record<string, any>)

    // Get salary range statistics (using rentangGaji instead of gaji)
    const salaryStats = await db.karier.aggregate({
      where: {
        rentangGaji: {
          not: null
        }
      },
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      ...stats,
      averageSalary: 0, // Since we're using rentangGaji (salary range) instead of exact gaji
      topCompanies: topCompanies.map(company => ({
        name: company.namaPerusahaan || 'Unknown',
        count: company._count.id
      })),
      careerByFakultas: Object.values(fakultasStats)
    })
  } catch (error) {
    console.error("Error fetching career stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
