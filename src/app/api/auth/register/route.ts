import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const registerSchema = z.object({
  nim: z.string().min(5, "NIM minimal 5 karakter"),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  angkatan: z.number().min(2000).max(new Date().getFullYear()),
  fakultas: z.string().min(1, "Fakultas wajib diisi"),
  prodi: z.string().min(1, "Program studi wajib diisi"),
  noHp: z.string().optional(),
  kotaDomisili: z.string().optional(),
  provinsiDomisili: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Register endpoint called")
    const body = await request.json()
    console.log("📝 Request body:", { ...body, password: "***" })
    
    const validatedData = registerSchema.parse(body)
    console.log("✅ Validation passed for:", validatedData.email)

    // Check if NIM already exists
    console.log("🔍 Checking NIM:", validatedData.nim)
    const existingNIM = await db.alumni.findUnique({
      where: { nim: validatedData.nim },
    })

    if (existingNIM) {
      return NextResponse.json(
        { error: "NIM sudah terdaftar" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.alumni.findUnique({
      where: { email: validatedData.email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Check if user with this email exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar sebagai pengguna" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create alumni and user in transaction
    const alumni = await db.alumni.create({
      data: {
        nim: validatedData.nim,
        nama: validatedData.nama,
        email: validatedData.email,
        angkatan: validatedData.angkatan,
        fakultas: validatedData.fakultas,
        prodi: validatedData.prodi,
        noHp: validatedData.noHp,
        kotaDomisili: validatedData.kotaDomisili || "Jakarta",
        provinsiDomisili: validatedData.provinsiDomisili || "DKI Jakarta",
      },
    })

    // Create user account
    await db.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.nama,
        password: hashedPassword,
        role: "ALUMNI",
        alumniId: alumni.id,
      },
    })

    return NextResponse.json({
      message: "Registrasi berhasil",
      alumni: {
        id: alumni.id,
        nama: alumni.nama,
        email: alumni.email,
      },
    })
  } catch (error: any) {
    console.error("❌ Registration error:", error)
    console.error("Error name:", error?.name)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    console.error("Full error:", JSON.stringify(error, null, 2))
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validasi gagal" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    )
  }
}
