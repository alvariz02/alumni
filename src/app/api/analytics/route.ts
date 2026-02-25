 import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fakultas = searchParams.get("fakultas")
    const angkatan = searchParams.get("angkatan")

    // Build where clause for alumni filters
    const alumniWhere = {
      ...(fakultas && fakultas !== "all" ? { fakultas } : {}),
      ...(angkatan && angkatan !== "all" ? { angkatan: parseInt(angkatan) } : {}),
    }

    // Get alumni IDs that match the filter (for career queries)
    const filteredAlumni = await db.alumni.findMany({
      where: alumniWhere,
      select: { id: true },
    })
    const filteredAlumniIds = filteredAlumni.map((a) => a.id)

    // Get all analytics data in parallel
    const [
      totalAlumni,
      alumniByFakultas,
      alumniByAngkatan,
      careerByStatus,
      careerByIndustry,
      alumniByProvince,
      salaryRanges,
      fieldMatch,
      allFakultas,
      allAngkatan,
    ] = await Promise.all([
      // Total alumni count (filtered)
      filteredAlumniIds.length > 0 
        ? db.alumni.count({ where: { id: { in: filteredAlumniIds } } })
        : db.alumni.count(),

      // Alumni by fakultas (filtered)
      filteredAlumniIds.length > 0
        ? db.alumni.groupBy({
            by: ["fakultas"],
            where: { id: { in: filteredAlumniIds } },
            _count: true,
          })
        : db.alumni.groupBy({
            by: ["fakultas"],
            _count: true,
          }),

      // Alumni by angkatan (filtered)
      filteredAlumniIds.length > 0
        ? db.alumni.groupBy({
            by: ["angkatan"],
            where: { id: { in: filteredAlumniIds } },
            _count: true,
            orderBy: { angkatan: "asc" },
          })
        : db.alumni.groupBy({
            by: ["angkatan"],
            _count: true,
            orderBy: { angkatan: "asc" },
          }),

      // Career by status (filtered by alumni)
      filteredAlumniIds.length > 0
        ? db.karier.groupBy({
            by: ["status"],
            where: { 
              isCurrent: true,
              alumniId: { in: filteredAlumniIds }
            },
            _count: true,
          })
        : db.karier.groupBy({
            by: ["status"],
            where: { isCurrent: true },
            _count: true,
          }),

      // Career by industry (filtered by alumni)
      filteredAlumniIds.length > 0
        ? db.karier.groupBy({
            by: ["sektorIndustri"],
            where: { 
              isCurrent: true, 
              sektorIndustri: { not: null },
              alumniId: { in: filteredAlumniIds }
            },
            _count: true,
            orderBy: { _count: { sektorIndustri: "desc" } },
            take: 10,
          })
        : db.karier.groupBy({
            by: ["sektorIndustri"],
            where: { isCurrent: true, sektorIndustri: { not: null } },
            _count: true,
            orderBy: { _count: { sektorIndustri: "desc" } },
            take: 10,
          }),

      // Alumni by province (filtered)
      filteredAlumniIds.length > 0
        ? db.alumni.groupBy({
            by: ["provinsiDomisili"],
            where: { id: { in: filteredAlumniIds } },
            _count: true,
            orderBy: { _count: { provinsiDomisili: "desc" } },
            take: 10,
          })
        : db.alumni.groupBy({
            by: ["provinsiDomisili"],
            _count: true,
            orderBy: { _count: { provinsiDomisili: "desc" } },
            take: 10,
          }),

      // Salary ranges (filtered by alumni)
      filteredAlumniIds.length > 0
        ? db.karier.groupBy({
            by: ["rentangGaji"],
            where: { 
              isCurrent: true, 
              rentangGaji: { not: null },
              alumniId: { in: filteredAlumniIds }
            },
            _count: true,
          })
        : db.karier.groupBy({
            by: ["rentangGaji"],
            where: { isCurrent: true, rentangGaji: { not: null } },
            _count: true,
          }),

      // Field match (filtered by alumni)
      filteredAlumniIds.length > 0
        ? db.karier.groupBy({
            by: ["isSesuaiBidang"],
            where: { 
              isCurrent: true, 
              isSesuaiBidang: { not: null },
              alumniId: { in: filteredAlumniIds }
            },
            _count: true,
          })
        : db.karier.groupBy({
            by: ["isSesuaiBidang"],
            where: { isCurrent: true, isSesuaiBidang: { not: null } },
            _count: true,
          }),

      // Get all unique fakultas for filter dropdown
      db.alumni.findMany({
        select: { fakultas: true },
        distinct: ["fakultas"],
        orderBy: { fakultas: "asc" },
      }),

      // Get all unique angkatan for filter dropdown
      db.alumni.findMany({
        select: { angkatan: true },
        distinct: ["angkatan"],
        orderBy: { angkatan: "desc" },
      }),
    ])

    // Calculate employment rate
    const employed = careerByStatus.find((c) => c.status === "BEKERJA")?._count || 0
    const entrepreneurship = careerByStatus.find((c) => c.status === "WIRAUSAHA")?._count || 0
    const furtherStudy = careerByStatus.find((c) => c.status === "STUDI_LANJUT")?._count || 0
    const unemployed = careerByStatus.find((c) => c.status === "BELUM_BEKERJA")?._count || 0
    const totalWithCareer = employed + entrepreneurship + furtherStudy + unemployed

    const employmentRate = totalWithCareer > 0 
      ? Math.round(((employed + entrepreneurship) / totalWithCareer) * 100) 
      : 0

    const fieldMatchRate = fieldMatch.length > 0
      ? Math.round(
          ((fieldMatch.find((f) => f.isSesuaiBidang === true)?._count || 0) /
            fieldMatch.reduce((sum, f) => sum + f._count, 0)) *
            100
        )
      : 0

    return NextResponse.json({
      summary: {
        totalAlumni,
        employmentRate,
        fieldMatchRate,
        employedAlumni: employed,
        entrepreneurshipAlumni: entrepreneurship,
        furtherStudyAlumni: furtherStudy,
        unemployedAlumni: unemployed,
      },
      alumniByFakultas: alumniByFakultas.map((j) => ({
        fakultas: j.fakultas,
        count: j._count,
      })),
      alumniByAngkatan: alumniByAngkatan.map((a) => ({
        angkatan: a.angkatan,
        count: a._count,
      })),
      careerByStatus: careerByStatus.map((c) => ({
        status: c.status,
        count: c._count,
      })),
      careerByIndustry: careerByIndustry.map((i) => ({
        industry: i.sektorIndustri,
        count: i._count,
      })),
      alumniByProvince: alumniByProvince.map((p) => ({
        province: p.provinsiDomisili,
        count: p._count,
      })),
      salaryRanges: salaryRanges.map((s) => ({
        range: s.rentangGaji,
        count: s._count,
      })),
      filterOptions: {
        fakultas: allFakultas.map((f) => f.fakultas),
        angkatan: allAngkatan.map((a) => a.angkatan),
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
