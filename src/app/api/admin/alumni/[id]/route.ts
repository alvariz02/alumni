import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete alumni (cascade will delete related records)
    await db.alumni.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Alumni berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting alumni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const alumni = await db.alumni.findUnique({
      where: { id },
      include: {
        karier: {
          where: { isCurrent: true },
          take: 1,
        },
      },
    })

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 })
    }

    return NextResponse.json(alumni)
  } catch (error) {
    console.error("Error fetching alumni:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
