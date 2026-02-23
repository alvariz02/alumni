import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      alumniId?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    alumniId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    alumniId?: string
  }
}
