import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "s/EmkpSSkNh1pndx3rA/4y110fXlRg/shkLRGn5oJZQ=",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        nim: { label: "NIM", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string
        const nim = credentials.nim as string

        // For alumni login with NIM
        if (nim) {
          const alumni = await db.alumni.findUnique({
            where: { email }
          })

          if (alumni && alumni.nim === nim) {
            return {
              id: alumni.id,
              email: alumni.email,
              name: alumni.nama,
              role: "ALUMNI",
              alumniId: alumni.id
            }
          }
          return null
        }

        // For admin login
        const user = await db.user.findUnique({
          where: { email }
        })

        if (user && user.role !== "ALUMNI") {
          // Simple password check for demo
          const validPasswords: Record<string, string> = {
            "admin@univ.ac.id": "admin123",
            "rektor@univ.ac.id": "pimpinan123"
          }

          if (validPasswords[email] === password) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.alumniId = user.alumniId
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.alumniId = token.alumniId as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
})
