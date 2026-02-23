# KP Alumni Tracking System

Sistem pelacakan dan manajemen alumni untuk keperluan akreditasi dan tracer study.

## 🚀 Features

### 🎓 Alumni Management
- Registrasi alumni dengan NIM dan email
- Profil lengkap dengan data pribadi, pendidikan, dan karier
- Verifikasi alumni oleh admin
- Update data karier dan prestasi

### 📊 Analytics Dashboard
- Dashboard analytics untuk pimpinan
- Statistik keterserapan kerja
- Distribusi alumni per fakultas dan angkatan
- Export data untuk keperluan akreditasi

### 🏢 Admin Panel
- Manajemen data alumni
- Verifikasi registrasi alumni
- Export data (CSV/Excel)
- Monitoring statistik

### 🌐 Alumni Network
- Jaringan alumni
- Pencarian alumni
- Testimoni alumni
- Komunitas alumni

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ dengan App Router
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account (recommended)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd kp-alumni
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` ke `.env` dan konfigurasi:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/alumni_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Project Structure

```
kp-alumni/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin routes
│   │   ├── (analytics)/        # Analytics routes
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (dashboard)/       # Alumni dashboard routes
│   │   └── api/              # API routes
│   ├── components/            # Reusable components
│   ├── lib/                  # Utilities and configurations
│   ├── hooks/                # Custom React hooks
│   └── types/               # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seed data
├── public/                  # Static assets
└── docs/                   # Documentation
```

## 👥 User Roles

### 🎓 Alumni
- Registrasi dan update profil
- Input data karier dan prestasi
- Akses jaringan alumni
- Lihat statistik alumni

### 👨‍💼 Admin
- Verifikasi registrasi alumni
- Manajemen data alumni
- Export data untuk akreditasi
- Monitoring sistem

### 👔 Pimpinan
- Dashboard analytics
- Laporan keterserapan kerja
- Statistik akreditasi
- Export data laporan

## 📊 Database Schema

### Alumni
- Data pribadi (nama, NIM, email, kontak)
- Data pendidikan (fakultas, prodi, angkatan)
- Data karier (status, perusahaan, jabatan)
- Data prestasi dan testimoni

### Users
- Authentication untuk admin dan pimpinan
- Role-based access control

## 🔐 Authentication

Sistem menggunakan NextAuth.js dengan:
- **Credentials Provider**: Login dengan email + password/NIM
- **Session Management**: JWT-based sessions
- **Role-based Access**: Alumni, Admin, Pimpinan

## 📈 Analytics & Reporting

### Dashboard Analytics
- Total alumni dan verifikasi
- Tingkat keterserapan kerja
- Distribusi per fakultas dan angkatan
- Status karier dan industri

### Export Features
- Data alumni (CSV/Excel)
- Data karier dan prestasi
- Laporan akreditasi
- Distribusi geografis

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub repository
2. Connect ke Vercel
3. Konfigurasi environment variables
4. Deploy otomatis

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Project ini dilisensikan under MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 📞 Support

Untuk support dan pertanyaan:
- Create issue di GitHub repository
- Contact development team

## 🔄 Updates & Changelog

### v1.0.0 (Initial Release)
- ✅ Alumni registration dan profile management
- ✅ Admin panel dengan verifikasi
- ✅ Analytics dashboard
- ✅ Export features
- ✅ Authentication system
- ✅ Responsive design

---

**Dibuat dengan ❤️ untuk keperluan akreditasi dan tracer study alumni**