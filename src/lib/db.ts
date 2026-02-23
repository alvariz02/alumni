import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://postgres:alumniunipaskeren@db.qosnfemixppvsdgigppu.supabase.co:5432/postgres"
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db