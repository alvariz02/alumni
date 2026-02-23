import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const alumni = await db.user.findMany({
      where: { role: "ALUMNI" },
      select: { email: true, name: true },
      take: 10,
    })

    return NextResponse.json({
      message: "Alumni accounts (password: password123)",
      alumni,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 })
  }
}
