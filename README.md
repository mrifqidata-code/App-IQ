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
- [Prisma](https://prisma.io): SQLite untuk development, Postgres untuk production
- [next-intl](https://next-intl.dev) untuk dua bahasa
- [Recharts](https://recharts.org) untuk grafik

## Menjalankan di komputer sendiri

Butuh Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env
npx auth secret        # mengisi AUTH_SECRET di .env (atau isi manual: openssl rand -base64 32)
npm run db:push        # membuat database SQLite (prisma/dev.db)
npm run dev
```

Buka http://localhost:3000.

Saat `npm run dev`, halaman login menampilkan **Dev mode**: cukup ketik nama untuk masuk tanpa Google. Dev mode **otomatis nonaktif di production**.

## Setup Login Google

1. Buka [Google Cloud Console](https://console.cloud.google.com/), lalu buat project baru (atau pilih yang sudah ada).
2. Masuk ke **APIs & Services → OAuth consent screen**. Pilih *External*, isi nama aplikasi dan email, lalu simpan.
3. Masuk ke **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - **Authorized JavaScript origins**: `http://localhost:3000` (tambahkan juga domain production, mis. `https://mindtest.vercel.app`)
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google` (dan `https://DOMAIN-KAMU/api/auth/callback/google`)
4. Salin **Client ID** dan **Client Secret** ke `.env`:
   ```
   AUTH_GOOGLE_ID="xxxx.apps.googleusercontent.com"
   AUTH_GOOGLE_SECRET="xxxx"
   ```
5. Restart `npm run dev`. Tombol **Masuk dengan Google** akan muncul.

## Deploy ke Vercel

SQLite tidak bisa dipakai di Vercel, jadi production memakai Postgres, misalnya dari [Neon](https://neon.tech) atau [Supabase](https://supabase.com) (keduanya punya paket gratis).

1. Buat database Postgres dan salin connection string-nya.
2. Di `prisma/schema.prisma`, ubah `provider = "sqlite"` menjadi `provider = "postgresql"`.
3. Push ke GitHub, lalu import repo di [Vercel](https://vercel.com/new).
4. Isi Environment Variables di Vercel: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
5. Buat tabel di database production (cukup sekali, dari komputer sendiri):
   ```bash
   DATABASE_URL="postgres://..." npx prisma db push
   ```
6. Tambahkan domain Vercel ke *Authorized origins* dan *redirect URIs* di Google Cloud Console (langkah 3 di atas).

## Struktur project

```
messages/               Teks UI (id.json, en.json)
prisma/schema.prisma    Skema database (User, Account, TestResult, ...)
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
