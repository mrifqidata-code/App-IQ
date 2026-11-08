# MindTest: Aplikasi Tes IQ, Kepribadian, EQ, dan DISC

Aplikasi web interaktif untuk mengerjakan 4 jenis tes psikologi. Pengguna login dengan Google, memilih tes, lalu mendapat hasil lengkap dengan grafik. Semua hasil tersimpan di riwayat.

| Tes | Jumlah soal | Format | Hasil |
|---|---|---|---|
| 🧠 Tes IQ | 30 | Pilihan ganda, batas waktu 25 menit | Perkiraan skor IQ dan skor per kategori (numerik, verbal, logika, pola) |
| 🧩 Tes Kepribadian 16 Tipe | 48 | Skala setuju/tidak setuju (1–5) | Tipe 4 huruf (mis. INTJ), persentase tiap dimensi, kekuatan, bidang karier |
| 💗 Tes EQ | 35 | Skala 1–5 | Skor EQ 0–100, radar 5 aspek (model Goleman), saran pengembangan |
| 🎯 Tes Gaya Perilaku DISC | 24 | Pilih kata "paling" dan "paling tidak" | Gaya utama dan pendukung, grafik D/I/S/C, kekuatan, tantangan, tips kerja |

Fitur lain:
- Dua bahasa, Indonesia dan English, dengan tombol ganti bahasa di header
- Tampilan responsif untuk HP dan desktop, mendukung dark mode
- Pintasan keyboard: `1`–`5` untuk skala, `A`–`D` untuk pilihan ganda, `←`/`→` untuk pindah soal
- Skor dihitung di server, sehingga kunci jawaban IQ tidak pernah dikirim ke browser

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS 4
- [Auth.js / NextAuth v5](https://authjs.dev) dengan Google OAuth
- [Prisma](https://prisma.io) + PostgreSQL, dengan migrasi yang dijalankan otomatis setiap build
- [next-intl](https://next-intl.dev) untuk dua bahasa
- [Recharts](https://recharts.org) untuk grafik

## Deploy ke Vercel (langkah demi langkah)

Semua layanan di bawah punya paket gratis.

### 1. Import project ke Vercel
1. Login ke [vercel.com](https://vercel.com) memakai akun GitHub.
2. Klik **Add New… → Project**, lalu pilih repo **App-IQ** dan klik **Import**.
3. Framework akan terdeteksi otomatis sebagai Next.js. **Jangan klik Deploy dulu**: buka bagian **Environment Variables** dan isi:
   | Name | Value |
   |---|---|
   | `AUTH_SECRET` | string acak. Buat dengan `openssl rand -base64 32`, atau di https://generate-secret.vercel.app/32 |
4. Klik **Deploy**. Deploy pertama ini **akan gagal** karena database belum ada. Ini normal, lanjut ke langkah 2.

### 2. Buat database Postgres (Neon)
1. Di halaman project Vercel, buka tab **Storage → Create Database → Neon (Serverless Postgres)**.
2. Pilih region terdekat (mis. Singapore), lalu **Create** dan **Connect** ke project.
3. Vercel otomatis mengisi `DATABASE_URL` dan `DATABASE_URL_UNPOOLED`. Tidak perlu disalin manual.

> Kalau memakai Supabase atau Postgres lain, isi dua variabel itu sendiri. `DATABASE_URL` diisi connection string pooled (atau direct), dan `DATABASE_URL_UNPOOLED` diisi connection string direct.

### 3. Setup Login Google
1. Buka [Google Cloud Console](https://console.cloud.google.com/), lalu buat project baru.
2. **APIs & Services → OAuth consent screen**: pilih *External*, isi nama aplikasi dan email, lalu simpan. Klik **Publish app** agar semua akun Google bisa login, bukan hanya akun test.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - **Authorized JavaScript origins**: `https://NAMA-PROJECT.vercel.app` (dan `http://localhost:3000` untuk lokal)
   - **Authorized redirect URIs**: `https://NAMA-PROJECT.vercel.app/api/auth/callback/google` (dan `http://localhost:3000/api/auth/callback/google`)
4. Salin **Client ID** dan **Client Secret** ke Vercel di **Settings → Environment Variables**:
   | Name | Value |
   |---|---|
   | `AUTH_GOOGLE_ID` | `xxxx.apps.googleusercontent.com` |
   | `AUTH_GOOGLE_SECRET` | `GOCSPX-xxxx` |

### 4. Deploy ulang
Buka tab **Deployments**, klik **⋯** pada deployment terakhir, lalu pilih **Redeploy**. Saat build, tabel database dibuat otomatis (`prisma migrate deploy`).

Setelah selesai, buka `https://NAMA-PROJECT.vercel.app` dan login dengan Google 🎉

Setiap kali ada push ke branch production (`main`), Vercel otomatis deploy ulang.

### Masalah yang sering muncul
- **`Error 400: redirect_uri_mismatch` saat login Google**: redirect URI di Google Cloud Console harus **persis** `https://DOMAIN-KAMU/api/auth/callback/google`.
- **Halaman login menampilkan "Login Google belum dikonfigurasi"**: `AUTH_GOOGLE_ID` atau `AUTH_GOOGLE_SECRET` belum diisi, atau belum redeploy setelah mengisinya.
- **Build gagal dengan `Environment variable not found: DATABASE_URL`**: database belum dihubungkan (langkah 2).
- **Muncul error "Server error / Configuration"**: `AUTH_SECRET` belum diisi.

## Menjalankan di komputer sendiri

Butuh Node.js 20+ dan database Postgres. Ada dua cara mendapatkan database:
- **Pakai database Neon yang sama dengan Vercel** (paling mudah): jalankan `npx vercel link`, lalu `npx vercel env pull .env`.
- **Pakai Postgres lokal**: salin `.env.example` ke `.env`, lalu sesuaikan `DATABASE_URL` dan `DATABASE_URL_UNPOOLED`. Jika memakai Docker:
  ```bash
  docker run -d --name mindtest-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mindtest -p 5432:5432 postgres:16
  ```

Setelah itu:
```bash
npm install
npx auth secret        # mengisi AUTH_SECRET di .env (lewati jika memakai vercel env pull)
npm run db:migrate     # membuat tabel
npm run dev
```

Buka http://localhost:3000. Saat `npm run dev`, halaman login menampilkan **Dev mode**: cukup ketik nama untuk masuk tanpa Google. Dev mode **otomatis nonaktif di production**.

Jika mengubah `prisma/schema.prisma`, buat migrasi baru dengan `npm run db:migrate:new -- --name nama_perubahan`.

## Struktur project

```
messages/               Teks UI (id.json, en.json)
prisma/schema.prisma    Skema database (User, Account, TestResult, ...)
prisma/migrations/      File migrasi SQL (dijalankan otomatis saat build)
src/auth.ts             Konfigurasi login (Google + Dev mode)
src/tests/              Bank soal dan logika skoring tiap tes
  iq.ts  personality.ts  eq.ts  disc.ts  index.ts
src/app/
  login/                Halaman login
  (app)/dashboard/      Pilih tes dan hasil terbaru
  (app)/test/[type]/    Pengerjaan tes
  (app)/result/[id]/    Halaman hasil
  (app)/history/        Riwayat semua tes
  actions.ts            Server actions (submit tes, ganti bahasa, login/logout)
src/components/         TestRunner, grafik, tampilan hasil per tes
```

### Mengubah atau menambah soal

Semua soal ada di `src/tests/*.ts`, dengan teks dua bahasa (`{ id: "...", en: "..." }`).
- **IQ**: ubah `iqQuestions`. `answer` adalah index opsi yang benar (mulai dari 0).
- **Kepribadian**: ubah `itemsByPole`. Setiap kutub (E/I, S/N, T/F, J/P) berisi 6 pernyataan.
- **EQ**: ubah `raw`. Tandai `reverse: true` untuk pernyataan negatif.
- **DISC**: ubah `words`. Setiap dimensi butuh jumlah kata yang sama.

## Catatan penting

- Hasil tes bersifat **edukatif dan hiburan**, bukan diagnosis psikologis resmi.
- Skor IQ dihitung dari norma asumsi (rata-rata 18 dari 30 benar dianggap IQ 100, SD 15). Ini bukan hasil standardisasi resmi.
- Semua soal ditulis khusus untuk aplikasi ini. "MBTI" dan "DiSC" adalah merek dagang milik pemiliknya masing-masing. Aplikasi ini tidak berafiliasi dengan mereka, sehingga dipakai nama "Tes Kepribadian 16 Tipe" dan "Tes Gaya Perilaku DISC".
