import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure we avoid prepared statement name conflicts in pooled environments
// by disabling the driver's statement cache via `statement_cache_size=0` when not present.
const defaultUrl = "postgresql://postgres:alumniunipaskeren@db.qosnfemixppvsdgigppu.supabase.co:5432/postgres"
let dbUrl = process.env.DATABASE_URL || defaultUrl

if (!/statement_cache_size=/i.test(dbUrl)) {
  const sep = dbUrl.includes('?') ? '&' : '?'
  dbUrl = `${dbUrl}${sep}statement_cache_size=0`
  console.log('Applied statement_cache_size=0 to DATABASE_URL to avoid prepared statement conflicts')
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db