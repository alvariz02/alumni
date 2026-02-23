import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

// Use the PrismaClient from lib/db.ts which has the fallback DATABASE_URL
import { db } from "../src/lib/db"

const prisma = db

const fakultasList = [
  { fakultas: "Fakultas Ekonomi", prodi: ["Akuntansi", "ADM", "Manajemen", "Ekonomi Pembangunan"] },
  { fakultas: "Fakultas ilmu sosial dan ilmu politik", prodi: ["Ilmu Politik", "Sosiologi", "Ilmu Administrasi Negara", "Hubungan Internasional"] },
  { fakultas: "Fakultas Keguruan dan Ilmu Pendidikan", prodi: ["PGSD", "PGPAUD", "Pendidikan Bahasa Inggris", "Pendidikan Matematika", "Bimbingan Konseling"] },
  { fakultas: "Fakultas Matematika dan Ilmu Pengetahuan Alam", prodi: ["Matematika", "Fisika", "Kimia", "Biologi", "Teknologi Hasil Pertanian"] },
  { fakultas: "Fakultas Perikanan dan Ilmu kelautan", prodi: ["Ilmu Kelautan", "Perikanan", "Budidaya Perairan", "Teknologi Hasil Perikanan"] },
  { fakultas: "Fakultas Teknik", prodi: ["Teknik Informatika", "Teknik Sipil", "Teknik Industri", "Teknik Lingkungan", "Teknik Elektro", "Teknik Mesin"] },
]

const provinsiList = [
  { provinsi: "DKI Jakarta", kota: ["Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Jakarta Timur"] },
  { provinsi: "Jawa Barat", kota: ["Bandung", "Bekasi", "Bogor", "Depok", "Cimahi"] },
  { provinsi: "Jawa Tengah", kota: ["Semarang", "Solo", "Yogyakarta", "Pekalongan"] },
  { provinsi: "Jawa Timur", kota: ["Surabaya", "Malang", "Sidoarjo", "Gresik"] },
  { provinsi: "Banten", kota: ["Tangerang", "Serang", "Cilegon"] },
  { provinsi: "Bali", kota: ["Denpasar", "Badung", "Gianyar"] },
  { provinsi: "Sumatera Utara", kota: ["Medan", "Binjai", "Deli Serdang"] },
  { provinsi: "Sulawesi Selatan", kota: ["Makassar", "Gowa", "Takalar"] },
]

const statusKarier = ["BEKERJA", "WIRAUSAHA", "STUDI_LANJUT", "BELUM_BEKERJA"] as const
const industriList = [
  "Teknologi Informasi",
  "Keuangan & Perbankan",
  "Manufaktur",
  "Kesehatan",
  "Pendidikan",
  "E-Commerce",
  "Konsultan",
  "Media & Komunikasi",
]

const salaryRanges = ["< 3 Juta", "3 - 5 Juta", "5 - 10 Juta", "10 - 15 Juta", "15 - 25 Juta", "> 25 Juta"]

const indonesianFirstNames = [
  "Ahmad", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gunawan", "Hani", "Indra", "Joko",
  "Kartika", "Lina", "Muhammad", "Nadia", "Oscar", "Putri", "Rizki", "Siti", "Taufik", "Ulfa",
  "Vina", "Wahyu", "Yudi", "Zahra", "Andi", "Bayu", "Cahya", "Dian", "Eka", "Fajar",
]

const indonesianLastNames = [
  "Pratama", "Saputra", "Wijaya", "Kusuma", "Hidayat", "Rahayu", "Santoso", "Hartono",
  "Susanto", "Wibowo", "Setiawan", "Nugroho", "Suryadi", "Putra", "Dewantara", "Permana",
  "Ramadhan", "Fauzan", "Ardiansyah", "Purnama", "Nugraha", "Saputri", "Handayani", "Lestari",
  "Anggraini", "Permata", "Sari", "Wulandari", "Rahmawati", "Kusumawati",
]

function generateNIM(angkatan: number, index: number): string {
  return `${angkatan}${String(index).padStart(4, "0")}`
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName(): string {
  return `${randomElement(indonesianFirstNames)} ${randomElement(indonesianLastNames)}`
}

let usedEmails = new Set<string>()

function generateUniqueEmail(nama: string, nim: string): string {
  let baseEmail = `${nama.toLowerCase().replace(/ /g, ".")}@alumni.univ.ac.id`
  let email = baseEmail
  let counter = 1
  while (usedEmails.has(email)) {
    email = `${nama.toLowerCase().replace(/ /g, ".")}${counter}@alumni.univ.ac.id`
    counter++
  }
  usedEmails.add(email)
  return email
}

async function main() {
  console.log("Starting seed...")

  // Clean existing data to avoid conflicts
  console.log('🧹 Cleaning existing data...')
  await prisma.karier.deleteMany({})
  await prisma.prestasi.deleteMany({})
  await prisma.testimoni.deleteMany({})
  await prisma.user.deleteMany({
    where: { role: { in: ['ALUMNI', 'ADMIN', 'PIMPINAN'] } }
  })
  await prisma.alumni.deleteMany({})

  // Create admin user
  console.log("Creating admin user...")
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@univ.ac.id" },
    update: {},
    create: {
      email: "admin@univ.ac.id",
      name: "Admin Universitas",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("Created admin user:", admin.email)

  // Create pimpinan user
  console.log("Creating pimpinan user...")
  const pimpinanPassword = await hash("pimpinan123", 12)
  const pimpinan = await prisma.user.upsert({
    where: { email: "rektor@univ.ac.id" },
    update: {},
    create: {
      email: "rektor@univ.ac.id",
      name: "Rektor Universitas",
      password: pimpinanPassword,
      role: "PIMPINAN",
    },
  })
  console.log("Created pimpinan user:", pimpinan.email)

  // Create sample alumni
  const angkatanList = [2018, 2019, 2020, 2021, 2022, 2023]
  let alumniCount = 0

  for (const angkatan of angkatanList) {
    for (let i = 0; i < 10; i++) { // 10 alumni per angkatan
      const fakultasData = randomElement(fakultasList)
      const prodi = randomElement(fakultasData.prodi)
      const lokasiData = randomElement(provinsiList)
      const kota = randomElement(lokasiData.kota)
      const nama = randomName()
      const nim = generateNIM(angkatan, i + 1)
      const email = generateUniqueEmail(nama, nim)

      // Create alumni (using upsert to handle duplicates)
      const alumni = await prisma.alumni.upsert({
        where: { nim },
        update: {
          nama,
          email,
          angkatan,
          fakultas: fakultasData.fakultas,
          prodi,
          kotaDomisili: kota,
          provinsiDomisili: lokasiData.provinsi,
          negaraDomisili: "Indonesia",
          isVerified: Math.random() > 0.3, // 70% verified
        },
        create: {
          nim,
          nama,
          email,
          angkatan,
          fakultas: fakultasData.fakultas,
          prodi,
          kotaDomisili: kota,
          provinsiDomisili: lokasiData.provinsi,
          negaraDomisili: "Indonesia",
          isVerified: Math.random() > 0.3, // 70% verified
        },
      })

      // Create user account for alumni (using upsert to handle duplicates)
      const alumniPassword = await hash("password123", 12)
      await prisma.user.upsert({
        where: { email },
        update: {
          name: nama,
          password: alumniPassword,
          role: "ALUMNI",
        },
        create: {
          email,
          name: nama,
          password: alumniPassword,
          role: "ALUMNI",
        },
      })

      // Create career data
      const status = randomElement(statusKarier)
      let namaPerusahaan = null
      let jabatan = null
      let sektorIndustri = null
      let rentangGaji = null

      if (status === "BEKERJA") {
        namaPerusahaan = `PT ${randomElement(indonesianLastNames)} ${randomElement(["Indonesia", "Nusantara", "Sejahtera"])}`
        jabatan = randomElement(["Staff", "Senior Staff", "Supervisor", "Manager", "Senior Manager"])
        sektorIndustri = randomElement(industriList)
        rentangGaji = randomElement(salaryRanges)
      } else if (status === "WIRAUSAHA") {
        namaPerusahaan = `${randomElement(indonesianFirstNames)} ${randomElement(["Store", "Shop", "Enterprise", "Digital"])}`
        jabatan = randomElement(["Founder", "CEO", "Owner", "Director"])
        sektorIndustri = randomElement(industriList)
        rentangGaji = randomElement(salaryRanges)
      }

      await prisma.karier.create({
        data: {
          alumniId: alumni.id,
          status,
          namaPerusahaan,
          jabatan,
          sektorIndustri,
          kotaKerja: kota,
          provinsiKerja: lokasiData.provinsi,
          negaraKerja: "Indonesia",
          rentangGaji,
          isSesuaiBidang: Math.random() > 0.3,
          tanggalMulai: new Date(angkatan + 1, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          isCurrent: true,
        },
      })

      alumniCount++
    }
  }

  console.log(`Created ${alumniCount} alumni with career data`)

  // Create sample testimonials
  const allAlumni = await prisma.alumni.findMany()
  const testimoniContents = [
    "Pendidikan di universitas ini sangat membantu dalam mempersiapkan karier saya. Dosen-dosen sangat kompeten dan materi yang diajarkan relevan dengan kebutuhan industri.",
    "Pengalaman belajar yang luar biasa! Banyak kesempatan untuk mengembangkan soft skill dan hard skill secara seimbang.",
    "Jaringan alumni yang kuat membantu saya dalam mencari pekerjaan pertama. Terima kasih universitas!",
    "Kurikulum yang up-to-date dengan perkembangan teknologi terkini sangat membantu dalam berkarier di bidang IT.",
    "Sangat bangga menjadi bagian dari almamater ini. Ilmu yang didapat sangat aplikatif di dunia kerja.",
  ]

  for (let i = 0; i < 10; i++) {
    const randomAlumni = randomElement(allAlumni)
    await prisma.testimoni.create({
      data: {
        alumniId: randomAlumni.id,
        konten: randomElement(testimoniContents),
        status: randomElement(["PENDING", "APPROVED", "REJECTED"] as const),
      },
    })
  }
  console.log("Created sample testimonials")

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
