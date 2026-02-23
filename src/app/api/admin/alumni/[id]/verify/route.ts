import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { verify } = body

    const alumni = await db.alumni.update({
      where: { id },
      data: { isVerified: verify },
    })

    return NextResponse.json(alumni)
  } catch (error) {
    console.error("Error updating verification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
