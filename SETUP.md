# GitHub Setup Instructions

## 🚀 Step-by-Step GitHub Setup

### 1. Create GitHub Repository
1. Buka [GitHub](https://github.com)
2. Klik "New repository"
3. Beri nama: `kp-alumni`
4. Pilih "Public" atau "Private"
5. Jangan centang "Add a README file" (karena sudah ada)
6. Klik "Create repository"

### 2. Connect Local Repository ke GitHub

Setelah membuat repository di GitHub, GitHub akan menampilkan commands. Gunakan command berikut:

```bash
# Add remote repository (ganti dengan username dan repository kamu)
git remote add origin https://github.com/USERNAME/kp-alumni.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### 3. Environment Variables untuk Production

Jika deploy ke Vercel atau platform lain, setup environment variables:

#### Required Environment Variables:
```env
# Database
DATABASE_URL="postgresql://postgres:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-production-anon-key"
```

### 4. Deployment Options

#### Vercel (Recommended)
1. Hubungkan GitHub repository ke Vercel
2. Setup environment variables di Vercel dashboard
3. Auto-deploy setiap push ke main branch

#### Manual Deployment
```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## 🔧 Git Commands yang Berguna

### Status dan Logs
```bash
git status                    # Lihat status files
git log --oneline            # Lihat commit history
```

### Branch Management
```bash
git branch                   # Lihat semua branches
git checkout -b feature-name # Buat branch baru
git checkout main            # Pindah ke main branch
```

### Sync dengan GitHub
```bash
git pull origin main          # Pull changes dari GitHub
git push origin main          # Push changes ke GitHub
```

### Commit Best Practices
```bash
# Add semua changes
git add .

# Commit dengan message yang jelas
git commit -m "feat: Add new feature"
git commit -m "fix: Resolve authentication issue"
git commit -m "docs: Update README"
```

## 📋 Pre-Deployment Checklist

### ✅ Security Check
- [ ] Environment variables tidak di-commit (.env di .gitignore)
- [ ] API keys aman
- [ ] Database credentials tidak exposed

### ✅ Code Quality
- [ ] Tidak ada console.log di production
- [ ] Error handling sudah proper
- [ ] TypeScript types sudah benar

### ✅ Performance
- [ ] Images sudah optimized
- [ ] Bundle size sudah reasonable
- [ ] Loading states sudah implement

### ✅ Testing
- [ ] Authentication flow berfungsi
- [ ] API endpoints berfungsi
- [ ] Database queries berfungsi

## 🚨 Troubleshooting

### Push Errors
```bash
# Jika ada error saat push
git push -f origin main  # Force push (hati-hati!)

# Atau reset dan push ulang
git reset --soft HEAD~1
git push origin main
```

### Merge Conflicts
```bash
# Pull changes dulu
git pull origin main

# Resolve conflicts manually
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### Environment Issues
```bash
# Cek environment variables
echo $DATABASE_URL
echo $NEXTAUTH_SECRET

# Restart development server
npm run dev
```

---

**Siap untuk deployment! 🚀**
