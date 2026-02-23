import { NextRequest, NextResponse } from "next/server"
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

    // Check if user is admin - reject access
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
      select: { role: true }
    })

    if (user && user.role !== "ALUMNI") {
      return NextResponse.json(
        { error: 'Access denied. This API is for alumni only.' },
        { status: 403 }
      )
    }

    // Get career data based on logged-in user's email
    const karier = await db.karier.findMany({
      where: {
        alumni: {
          email: session.user.email || ""
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        alumni: {
          select: { nama: true, nim: true }
        }
      }
    })

    return NextResponse.json(karier)
  } catch (error) {
    console.error("Error fetching karier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin - reject access
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
      select: { role: true }
    })

    if (user && user.role !== "ALUMNI") {
      return NextResponse.json(
        { error: 'Access denied. This API is for alumni only.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      status,
      namaPerusahaan,
      jabatan,
      sektorIndustri,
      kotaKerja,
      provinsiKerja,
      negaraKerja,
      rentangGaji,
      isSesuaiBidang,
      tanggalMulai,
    } = body

    // Get alumni data based on logged-in user's email
    const alumni = await db.alumni.findUnique({
      where: { email: session.user.email || "" }
    })

    if (!alumni) {
      return NextResponse.json(
        { error: 'Alumni data not found' },
        { status: 404 }
      )
    }

    // Mark all previous careers as not current
    await db.karier.updateMany({
      where: { alumniId: alumni.id, isCurrent: true },
      data: { isCurrent: false },
    })

    // Create new career record
    const karier = await db.karier.create({
      data: {
        alumniId: alumni.id,
        status,
        namaPerusahaan,
        jabatan,
        sektorIndustri,
        kotaKerja,
        provinsiKerja,
        negaraKerja: negaraKerja || "Indonesia",
        rentangGaji,
        isSesuaiBidang,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : null,
        isCurrent: true,
      },
    })

    return NextResponse.json(karier)
  } catch (error) {
    console.error("Error creating karier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
