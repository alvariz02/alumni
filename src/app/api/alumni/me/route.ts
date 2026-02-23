import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    console.log('Session:', session)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated', session },
        { status: 401 }
      )
    }

    // Check if user is admin (no alumni data)
    const alumni = await db.alumni.findUnique({
      where: { email: session.user.email || "" },
      include: {
        karier: {
          orderBy: { createdAt: 'desc' }
        },
        prestasi: {
          orderBy: { tahun: 'desc' }
        },
        testimoni: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // If alumni data found, return alumni data
    if (alumni) {
      return NextResponse.json(alumni)
    }

    // If no alumni data, check if user is admin
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        alumniId: true
      }
    })

    if (user && user.role !== "ALUMNI") {
      // Return user data for admin/pimpinan
      return NextResponse.json({
        id: user.id,
        email: user.email,
        nama: user.name,
        role: user.role,
        isAdmin: true,
        karier: [],
        prestasi: [],
        testimoni: []
      })
    }

    // If neither alumni nor admin user found
    return NextResponse.json(
      { error: 'User data not found', email: session.user.email },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nama, noHp, linkedinUrl, kotaDomisili, provinsiDomisili, profileVisibility } = body

    // Get alumni data based on logged-in user's email
    const alumni = await db.alumni.findUnique({
      where: { email: session.user.email || "" }
    })

    if (!alumni) {
      return NextResponse.json({ error: "Alumni data not found" }, { status: 404 })
    }

    const updatedAlumni = await db.alumni.update({
      where: { id: alumni.id },
      data: {
        nama,
        noHp,
        linkedinUrl,
        kotaDomisili,
        provinsiDomisili,
        profileVisibility,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedAlumni)
  } catch (error) {
    console.error("Error updating alumni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
