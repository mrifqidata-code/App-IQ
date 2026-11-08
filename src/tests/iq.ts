import type { Answers, ClientChoiceQuestion, L, Locale } from "./types";

export const IQ_TIME_LIMIT_SECONDS = 25 * 60;

export type IqCategory = "numerical" | "verbal" | "logical" | "pattern";

export const iqCategoryLabels: Record<IqCategory, L> = {
  numerical: { id: "Numerik", en: "Numerical" },
  verbal: { id: "Verbal", en: "Verbal" },
  logical: { id: "Logika", en: "Logical" },
  pattern: { id: "Pola", en: "Pattern" },
};

type IqQuestion = {
  id: string;
  category: IqCategory;
  prompt: L;
  display?: string;
  options: (string | L)[];
  /** Index opsi yang benar. Tidak pernah dikirim ke browser. */
  answer: number;
};

const seq: L = { id: "Angka berapa yang melanjutkan deret ini?", en: "Which number continues the sequence?" };
const nextPattern: L = { id: "Apa yang melanjutkan pola ini?", en: "What comes next in the pattern?" };
const oddOne: L = { id: "Mana yang tidak termasuk kelompoknya?", en: "Which one does not belong?" };

export const iqQuestions: IqQuestion[] = [
  // ---------- Numerik ----------
  { id: "n1", category: "numerical", prompt: seq, display: "2, 4, 8, 16, ?", options: ["24", "30", "32", "36"], answer: 2 },
  { id: "n2", category: "numerical", prompt: seq, display: "3, 6, 11, 18, 27, ?", options: ["36", "38", "40", "34"], answer: 1 },
  { id: "n3", category: "numerical", prompt: seq, display: "1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "15"], answer: 2 },
  { id: "n4", category: "numerical", prompt: seq, display: "81, 27, 9, 3, ?", options: ["0", "1", "1.5", "2"], answer: 1 },
  { id: "n5", category: "numerical", prompt: seq, display: "2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], answer: 1 },
  {
    id: "n6",
    category: "numerical",
    prompt: {
      id: "Setelah diskon 20%, harga sebuah kemeja menjadi Rp80.000. Berapa harga awalnya?",
      en: "After a 20% discount, a shirt costs $80. What was the original price?",
    },
    options: [
      { id: "Rp96.000", en: "$96" },
      { id: "Rp100.000", en: "$100" },
      { id: "Rp64.000", en: "$64" },
      { id: "Rp120.000", en: "$120" },
    ],
    answer: 1,
  },
  {
    id: "n7",
    category: "numerical",
    prompt: {
      id: "5 pekerja dapat membangun sebuah tembok dalam 12 hari. Berapa hari yang dibutuhkan 10 pekerja dengan kecepatan yang sama?",
      en: "5 workers can build a wall in 12 days. How many days would 10 workers take at the same rate?",
    },
    options: ["24", "6", "8", "10"],
    answer: 1,
  },
  { id: "n8", category: "numerical", prompt: seq, display: "7, 10, 8, 11, 9, 12, ?", options: ["10", "13", "11", "14"], answer: 0 },

  // ---------- Verbal ----------
  {
    id: "v1",
    category: "verbal",
    prompt: { id: "Buku : Membaca = Garpu : ?", en: "Book : Read = Fork : ?" },
    options: [
      { id: "Makan", en: "Eat" },
      { id: "Dapur", en: "Kitchen" },
      { id: "Sendok", en: "Spoon" },
      { id: "Piring", en: "Plate" },
    ],
    answer: 0,
  },
  {
    id: "v2",
    category: "verbal",
    prompt: oddOne,
    options: [
      { id: "Apel", en: "Apple" },
      { id: "Pisang", en: "Banana" },
      { id: "Wortel", en: "Carrot" },
      { id: "Mangga", en: "Mango" },
    ],
    answer: 2,
  },
  {
    id: "v3",
    category: "verbal",
    prompt: { id: "Lawan kata dari \"Optimis\" adalah…", en: "The opposite of \"Optimistic\" is…" },
    options: [
      { id: "Realistis", en: "Realistic" },
      { id: "Pesimis", en: "Pessimistic" },
      { id: "Idealis", en: "Idealistic" },
      { id: "Antusias", en: "Enthusiastic" },
    ],
    answer: 1,
  },
  {
    id: "v4",
    category: "verbal",
    prompt: { id: "Panas : Dingin = Tinggi : ?", en: "Hot : Cold = High : ?" },
    options: [
      { id: "Besar", en: "Big" },
      { id: "Rendah", en: "Low" },
      { id: "Panjang", en: "Long" },
      { id: "Jauh", en: "Far" },
    ],
    answer: 1,
  },
  {
    id: "v5",
    category: "verbal",
    prompt: oddOne,
    options: [
      { id: "Merah", en: "Red" },
      { id: "Biru", en: "Blue" },
      { id: "Hijau", en: "Green" },
      { id: "Bulat", en: "Round" },
    ],
    answer: 3,
  },
  {
    id: "v6",
    category: "verbal",
    prompt: { id: "Dokter : Rumah sakit = Guru : ?", en: "Doctor : Hospital = Teacher : ?" },
    options: [
      { id: "Murid", en: "Student" },
      { id: "Buku", en: "Book" },
      { id: "Sekolah", en: "School" },
      { id: "Pelajaran", en: "Lesson" },
    ],
    answer: 2,
  },
  {
    id: "v7",
    category: "verbal",
    prompt: { id: "Sinonim dari \"Gigih\" adalah…", en: "A synonym of \"Persistent\" is…" },
    options: [
      { id: "Malas", en: "Lazy" },
      { id: "Tekun", en: "Tenacious" },
      { id: "Cerdas", en: "Clever" },
      { id: "Ramah", en: "Friendly" },
    ],
    answer: 1,
  },
  {
    id: "v8",
    category: "verbal",
    prompt: oddOne,
    options: [
      { id: "Segitiga", en: "Triangle" },
      { id: "Persegi", en: "Square" },
      { id: "Lingkaran", en: "Circle" },
      { id: "Kubus", en: "Cube" },
    ],
    answer: 3,
  },

  // ---------- Logika ----------
  {
    id: "l1",
    category: "logical",
    prompt: {
      id: "Semua mawar adalah bunga. Sebagian bunga cepat layu. Maka…",
      en: "All roses are flowers. Some flowers wither quickly. Therefore…",
    },
    options: [
      { id: "Semua mawar cepat layu", en: "All roses wither quickly" },
      { id: "Sebagian mawar cepat layu", en: "Some roses wither quickly" },
      { id: "Tidak dapat dipastikan", en: "It cannot be determined" },
      { id: "Tidak ada mawar yang cepat layu", en: "No roses wither quickly" },
    ],
    answer: 2,
  },
  {
    id: "l2",
    category: "logical",
    prompt: {
      id: "Andi lebih tinggi dari Budi. Budi lebih tinggi dari Citra. Siapa yang paling pendek?",
      en: "Andi is taller than Budi. Budi is taller than Citra. Who is the shortest?",
    },
    options: ["Andi", "Budi", "Citra", { id: "Tidak dapat dipastikan", en: "It cannot be determined" }],
    answer: 2,
  },
  {
    id: "l3",
    category: "logical",
    prompt: {
      id: "Jika hujan, jalanan basah. Jalanan tidak basah. Maka…",
      en: "If it rains, the road gets wet. The road is not wet. Therefore…",
    },
    options: [
      { id: "Sedang hujan", en: "It is raining" },
      { id: "Tidak sedang hujan", en: "It is not raining" },
      { id: "Jalanan kering karena matahari", en: "The road is dry because of the sun" },
      { id: "Tidak dapat dipastikan", en: "It cannot be determined" },
    ],
    answer: 1,
  },
  {
    id: "l4",
    category: "logical",
    prompt: {
      id: "Hari ini hari Rabu. Hari apakah 10 hari lagi?",
      en: "Today is Wednesday. What day will it be 10 days from now?",
    },
    options: [
      { id: "Jumat", en: "Friday" },
      { id: "Sabtu", en: "Saturday" },
      { id: "Minggu", en: "Sunday" },
      { id: "Senin", en: "Monday" },
    ],
    answer: 1,
  },
  {
    id: "l5",
    category: "logical",
    prompt: {
      id: "Dalam sebuah lomba lari, kamu menyalip pelari di posisi ke-2. Sekarang kamu di posisi ke berapa?",
      en: "In a race, you overtake the runner in 2nd place. What position are you in now?",
    },
    options: [
      { id: "Pertama", en: "First" },
      { id: "Kedua", en: "Second" },
      { id: "Ketiga", en: "Third" },
      { id: "Tidak dapat dipastikan", en: "It cannot be determined" },
    ],
    answer: 1,
  },
  {
    id: "l6",
    category: "logical",
    prompt: {
      id: "5 orang saling berjabat tangan, masing-masing tepat satu kali dengan setiap orang lainnya. Berapa total jabat tangan?",
      en: "5 people each shake hands exactly once with every other person. How many handshakes are there in total?",
    },
    options: ["10", "20", "25", "15"],
    answer: 0,
  },
  {
    id: "l7",
    category: "logical",
    prompt: {
      id: "Umur ayah 4 kali umur anaknya. 20 tahun lagi, umur ayah menjadi 2 kali umur anaknya. Berapa umur anak sekarang?",
      en: "A father is 4 times as old as his son. In 20 years, he will be twice as old as his son. How old is the son now?",
    },
    options: ["5", "10", "15", "20"],
    answer: 1,
  },

  // ---------- Pola ----------
  { id: "p1", category: "pattern", prompt: nextPattern, display: "▲  ■  ●  ▲  ■  ●  ▲  ?", options: ["▲", "■", "●", "◆"], answer: 1 },
  { id: "p2", category: "pattern", prompt: nextPattern, display: "A  C  E  G  ?", options: ["H", "I", "J", "K"], answer: 1 },
  { id: "p3", category: "pattern", prompt: nextPattern, display: "Z  X  V  T  ?", options: ["S", "R", "Q", "P"], answer: 1 },
  { id: "p4", category: "pattern", prompt: nextPattern, display: "↑  →  ↓  ←  ?", options: ["↑", "→", "↓", "←"], answer: 0 },
  { id: "p5", category: "pattern", prompt: nextPattern, display: "↑  ↗  →  ↘  ?", options: ["↓", "←", "↙", "↑"], answer: 0 },
  { id: "p6", category: "pattern", prompt: nextPattern, display: "2A  4C  6E  8G  ?", options: ["10H", "10I", "9I", "12I"], answer: 1 },
  { id: "p7", category: "pattern", prompt: nextPattern, display: "AZ  BY  CX  ?", options: ["DV", "DW", "EW", "DX"], answer: 1 },
];

const t = (v: string | L, locale: Locale) => (typeof v === "string" ? v : v[locale]);

export function getIqClientQuestions(locale: Locale): ClientChoiceQuestion[] {
  return iqQuestions.map((q) => ({
    kind: "choice",
    id: q.id,
    category: t(iqCategoryLabels[q.category], locale),
    prompt: q.prompt[locale],
    display: q.display,
    options: q.options.map((o) => t(o, locale)),
  }));
}

export type IqResult = {
  correct: number;
  total: number;
  iq: number;
  band: IqBand;
  categories: Record<IqCategory, { correct: number; total: number }>;
};

export type IqBand = "very_high" | "high" | "above_average" | "average" | "below_average" | "low";

export const iqBandLabels: Record<IqBand, L> = {
  very_high: { id: "Sangat Superior", en: "Very Superior" },
  high: { id: "Superior", en: "Superior" },
  above_average: { id: "Di Atas Rata-rata", en: "Above Average" },
  average: { id: "Rata-rata", en: "Average" },
  below_average: { id: "Di Bawah Rata-rata", en: "Below Average" },
  low: { id: "Rendah", en: "Low" },
};

export const iqBandDescriptions: Record<IqBand, L> = {
  very_high: {
    id: "Kemampuan penalaranmu sangat menonjol. Kamu cepat menangkap pola dan hubungan yang rumit.",
    en: "Your reasoning ability stands out strongly. You quickly grasp complex patterns and relationships.",
  },
  high: {
    id: "Kemampuan penalaranmu tinggi. Kamu mampu memecahkan sebagian besar soal dengan tepat.",
    en: "Your reasoning ability is high. You solved most problems correctly.",
  },
  above_average: {
    id: "Kemampuan penalaranmu di atas rata-rata. Masih ada ruang untuk mengasah beberapa kategori.",
    en: "Your reasoning ability is above average, with room to sharpen a few categories.",
  },
  average: {
    id: "Kemampuan penalaranmu berada di kisaran rata-rata, seperti sebagian besar orang.",
    en: "Your reasoning ability is in the average range, like most people.",
  },
  below_average: {
    id: "Skormu di bawah rata-rata pada tes ini. Kelelahan, waktu, dan konsentrasi juga berpengaruh, jadi coba ulangi saat lebih segar.",
    en: "Your score is below average on this test. Fatigue, time pressure and focus also matter, so try again when you feel fresh.",
  },
  low: {
    id: "Skormu rendah pada tes ini. Hasil tes singkat seperti ini sangat dipengaruhi kondisi saat mengerjakan, jadi jangan berkecil hati.",
    en: "Your score is low on this test. Short tests like this are strongly affected by your condition at the time, so don't be discouraged.",
  },
};

/**
 * Perkiraan skor IQ dari jumlah jawaban benar.
 * Norma yang dipakai (rata-rata 18 benar, SD 5) adalah asumsi untuk tes informal ini,
 * bukan hasil standardisasi resmi.
 */
const NORM_MEAN = 18;
const NORM_SD = 5;

export function scoreIq(answers: Answers): IqResult {
  const categories = {
    numerical: { correct: 0, total: 0 },
    verbal: { correct: 0, total: 0 },
    logical: { correct: 0, total: 0 },
    pattern: { correct: 0, total: 0 },
  } satisfies IqResult["categories"];
  let correct = 0;
  for (const q of iqQuestions) {
    categories[q.category].total++;
    if (answers[q.id] === q.answer) {
      correct++;
      categories[q.category].correct++;
    }
  }
  const raw = 100 + (15 * (correct - NORM_MEAN)) / NORM_SD;
  const iq = Math.round(Math.min(145, Math.max(55, raw)));
  const band: IqBand =
    iq >= 130 ? "very_high" : iq >= 120 ? "high" : iq >= 110 ? "above_average" : iq >= 90 ? "average" : iq >= 80 ? "below_average" : "low";
  return { correct, total: iqQuestions.length, iq, band, categories };
}
