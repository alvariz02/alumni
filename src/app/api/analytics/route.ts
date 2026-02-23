import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
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
    ] = await Promise.all([
      // Total alumni count
      db.alumni.count(),

      // Alumni by fakultas
      db.alumni.groupBy({
        by: ["fakultas"],
        _count: true,
      }),

      // Alumni by angkatan
      db.alumni.groupBy({
        by: ["angkatan"],
        _count: true,
        orderBy: { angkatan: "asc" },
      }),

      // Career by status
      db.karier.groupBy({
        by: ["status"],
        where: { isCurrent: true },
        _count: true,
      }),

      // Career by industry
      db.karier.groupBy({
        by: ["sektorIndustri"],
        where: { isCurrent: true, sektorIndustri: { not: null } },
        _count: true,
        orderBy: { _count: { sektorIndustri: "desc" } },
        take: 10,
      }),

      // Alumni by province
      db.alumni.groupBy({
        by: ["provinsiDomisili"],
        _count: true,
        orderBy: { _count: { provinsiDomisili: "desc" } },
        take: 10,
      }),

      // Salary ranges
      db.karier.groupBy({
        by: ["rentangGaji"],
        where: { isCurrent: true, rentangGaji: { not: null } },
        _count: true,
      }),

      // Field match
      db.karier.groupBy({
        by: ["isSesuaiBidang"],
        where: { isCurrent: true, isSesuaiBidang: { not: null } },
        _count: true,
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
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
