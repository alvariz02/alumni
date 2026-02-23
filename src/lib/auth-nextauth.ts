import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"

export const authOptions = {
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

        // For alumni login with NIM
        if (credentials.nim) {
          const alumni = await db.alumni.findUnique({
            where: { email: credentials.email }
          })

          if (alumni && alumni.nim === credentials.nim) {
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
          where: { email: credentials.email }
        })

        if (user && user.role !== "ALUMNI") {
          // Simple password check for demo
          const validPasswords = {
            "admin@univ.ac.id": "admin123",
            "rektor@univ.ac.id": "pimpinan123"
          }

          if (validPasswords[credentials.email] === credentials.password) {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.alumniId = user.alumniId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
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
}

export default NextAuth(authOptions)
