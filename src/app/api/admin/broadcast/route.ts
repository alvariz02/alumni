import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, content, target, jurusan, angkatan } = body

    // Build filter
    let where: any = {}
    
    if (target === "jurusan" && jurusan) {
      where.jurusan = jurusan
    } else if (target === "angkatan" && angkatan) {
      where.angkatan = parseInt(angkatan)
    } else if (target === "unverified") {
      where.isVerified = false
    }

    // Get alumni emails
    const alumni = await db.alumni.findMany({
      where,
      select: { email: true, nama: true },
    })

    // In production, integrate with Resend or SendGrid
    // For now, just log and return success
    console.log(`Broadcast email to ${alumni.length} alumni`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${content}`)

    // TODO: Integrate with actual email service
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'admin@univ.ac.id',
    //   to: alumni.map(a => a.email),
    //   subject: subject,
    //   html: content.replace(/{nama}/g, 'Alumni'),
    // })

    return NextResponse.json({
      sent: alumni.length,
      message: `Email berhasil dikirim ke ${alumni.length} alumni`,
    })
  } catch (error) {
    console.error("Error sending broadcast:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
