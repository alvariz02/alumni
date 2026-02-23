import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "secret"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password diperlukan" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { alumni: true },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      )
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      )
    }

    // Create a JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        alumniId: user.alumniId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        alumniId: user.alumniId,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
