# Vercel Deployment Guide

## 🚀 Step-by-Step Vercel Deployment

### 1. Connect GitHub Repository
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "Add New Project"
3. Pilih "Import Git Repository"
4. Connect GitHub account kamu
5. Pilih repository: `alvariz02/alumni`
6. Klik "Import"

### 2. Configure Build Settings

#### ✅ Build Configuration
Vercel akan otomatis detect Next.js project:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

#### ✅ Environment Variables
Setup environment variables di Vercel Dashboard:

**Required Variables:**
```
NEXTAUTH_SECRET=your-production-secret-key
DATABASE_URL=postgresql://postgres:password@host:5432/database
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Production Database Setup:**
- Gunakan Supabase production database
- Copy connection string dari Supabase dashboard
- Update `DATABASE_URL` dengan production credentials

### 3. Deploy Settings

#### ✅ Optimal Configuration
```json
{
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=0, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

#### ✅ Performance Settings
- **Region**: Singapore (sin1) untuk Indonesia
- **Function Duration**: 30s untuk API routes
- **Build Cache**: Optimize untuk Next.js

### 4. Custom Domain (Optional)

#### ✅ Domain Setup
1. Di Vercel Dashboard → Settings → Domains
2. Tambah custom domain: `alumni.university.ac.id`
3. Setup DNS records:
   ```
   Type: CNAME
   Name: alumni
   Value: cname.vercel-dns.com
   ```

#### ✅ SSL Certificate
- Otomatis setup oleh Vercel
- Gratis untuk semua custom domains
- Auto-renewal

### 5. Post-Deployment Checklist

#### ✅ Testing
- [ ] Homepage loads correctly
- [ ] Login/register berfungsi
- [ ] Dashboard accessible
- [ ] API endpoints respond
- [ ] Database connection works

#### ✅ Performance
- [ ] Page load time < 3s
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] API response time < 1s

#### ✅ Security
- [ ] HTTPS enabled
- [ ] Environment variables hidden
- [ ] API routes protected
- [ ] No console errors

### 6. Monitoring & Analytics

#### ✅ Vercel Analytics
- Real-time visitor analytics
- Performance metrics
- Error tracking
- Usage statistics

#### ✅ Custom Analytics (Optional)
```javascript
// Di _app.tsx atau layout
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 7. Environment Management

#### ✅ Production vs Development
```bash
# Production (Vercel)
NEXTAUTH_SECRET=prod-secret
DATABASE_URL=prod-database-url
NEXTAUTH_URL=https://your-app.vercel.app

# Development (Local)
NEXTAUTH_SECRET=dev-secret
DATABASE_URL=dev-database-url
NEXTAUTH_URL=http://localhost:3000
```

#### ✅ Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed production data (jika needed)
npx prisma db seed
```

### 8. Troubleshooting

#### ✅ Common Issues

**Build Errors:**
```bash
# Check build logs di Vercel Dashboard
# Pastikan environment variables benar
# Verify dependencies compatibility
```

**Database Connection:**
```bash
# Test database connection
npx prisma db pull

# Check environment variables
echo $DATABASE_URL
```

**API Timeouts:**
```bash
# Increase function duration di vercel.json
"functions": {
  "app/api/**/*.ts": {
    "maxDuration": 60
  }
}
```

#### ✅ Debug Mode
```javascript
// Di API routes untuk debugging
console.log('🔍 Debug info:', {
  timestamp: new Date().toISOString(),
  method: req.method,
  url: req.url,
  headers: req.headers
});
```

### 9. CI/CD Pipeline

#### ✅ GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

### 10. Performance Optimization

#### ✅ Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize imports
# Dynamic imports untuk large libraries
# Tree shaking enabled
```

#### ✅ Image Optimization
```javascript
// Di next.config.js
images: {
  domains: ['your-cdn.com'],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
}
```

#### ✅ Caching Strategy
```javascript
// Di API routes
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
    }
  });
}
```

---

## 🚀 Quick Deployment Commands

### Setup & Deploy
```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Test locally
npm start

# 4. Push to GitHub (auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main
```

### Environment Check
```bash
# Verify environment
node -e "console.log('NODE_ENV:', process.env.NODE_ENV)"
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')"
```

---

**Project siap untuk production deployment di Vercel!** 🚀

**Need help? Check Vercel documentation atau contact support.**
