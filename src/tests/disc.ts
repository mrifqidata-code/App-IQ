/**
 * Tes Gaya Perilaku DISC (berdasarkan teori William Moulton Marston).
 * Daftar kata ditulis khusus untuk aplikasi ini. Ini BUKAN asesmen DiSC® resmi.
 */
import type { Answers, ClientDiscQuestion, DiscAnswer, L, Locale } from "./types";

export type DiscKey = "D" | "I" | "S" | "C";
export const discKeys: DiscKey[] = ["D", "I", "S", "C"];

const words: Record<DiscKey, L[]> = {
  D: [
    { id: "Tegas", en: "Decisive" },
    { id: "Berani", en: "Bold" },
    { id: "Kompetitif", en: "Competitive" },
    { id: "Asertif", en: "Assertive" },
    { id: "Lugas", en: "Direct" },
    { id: "Ambisius", en: "Ambitious" },
    { id: "Pantang menyerah", en: "Determined" },
    { id: "Suka tantangan", en: "Adventurous" },
    { id: "Mandiri", en: "Independent" },
    { id: "Berorientasi hasil", en: "Results-driven" },
    { id: "Gigih", en: "Persistent" },
    { id: "Berkemauan keras", en: "Strong-willed" },
    { id: "Berani ambil risiko", en: "Risk-taking" },
    { id: "Suka memimpin", en: "Takes charge" },
    { id: "Cepat bertindak", en: "Quick to act" },
    { id: "Blak-blakan", en: "Outspoken" },
    { id: "Tak kenal takut", en: "Fearless" },
    { id: "Menuntut", en: "Demanding" },
    { id: "Tidak sabaran", en: "Impatient" },
    { id: "Pelopor", en: "Pioneering" },
    { id: "Yakin diri", en: "Self-assured" },
    { id: "Keras kepala", en: "Stubborn" },
    { id: "Kuat", en: "Forceful" },
    { id: "Ingin menang", en: "Driven to win" },
  ],
  I: [
    { id: "Ramah", en: "Friendly" },
    { id: "Antusias", en: "Enthusiastic" },
    { id: "Ekspresif", en: "Expressive" },
    { id: "Optimis", en: "Optimistic" },
    { id: "Persuasif", en: "Persuasive" },
    { id: "Ceria", en: "Cheerful" },
    { id: "Mudah bergaul", en: "Sociable" },
    { id: "Spontan", en: "Spontaneous" },
    { id: "Karismatik", en: "Charismatic" },
    { id: "Inspiratif", en: "Inspiring" },
    { id: "Humoris", en: "Humorous" },
    { id: "Banyak bicara", en: "Talkative" },
    { id: "Meyakinkan", en: "Convincing" },
    { id: "Lincah", en: "Lively" },
    { id: "Penuh semangat", en: "Energetic" },
    { id: "Suka bersenang-senang", en: "Fun-loving" },
    { id: "Populer", en: "Popular" },
    { id: "Supel", en: "Outgoing" },
    { id: "Dramatis", en: "Dramatic" },
    { id: "Impulsif", en: "Impulsive" },
    { id: "Menghibur", en: "Entertaining" },
    { id: "Terbuka", en: "Open" },
    { id: "Mudah percaya", en: "Trusting" },
    { id: "Pandai bicara", en: "Articulate" },
  ],
  S: [
    { id: "Sabar", en: "Patient" },
    { id: "Tenang", en: "Calm" },
    { id: "Setia", en: "Loyal" },
    { id: "Pendengar yang baik", en: "Good listener" },
    { id: "Stabil", en: "Steady" },
    { id: "Suportif", en: "Supportive" },
    { id: "Akomodatif", en: "Accommodating" },
    { id: "Konsisten", en: "Consistent" },
    { id: "Cinta damai", en: "Peaceful" },
    { id: "Rendah hati", en: "Humble" },
    { id: "Kooperatif", en: "Cooperative" },
    { id: "Santai", en: "Easygoing" },
    { id: "Penuh pengertian", en: "Understanding" },
    { id: "Bisa diandalkan", en: "Dependable" },
    { id: "Lembut", en: "Gentle" },
    { id: "Toleran", en: "Tolerant" },
    { id: "Baik hati", en: "Kind" },
    { id: "Suka menolong", en: "Helpful" },
    { id: "Mudah puas", en: "Content" },
    { id: "Menghindari konflik", en: "Avoids conflict" },
    { id: "Pemaaf", en: "Forgiving" },
    { id: "Rukun", en: "Harmonious" },
    { id: "Suka rutinitas", en: "Likes routine" },
    { id: "Tulus", en: "Sincere" },
  ],
  C: [
    { id: "Teliti", en: "Meticulous" },
    { id: "Akurat", en: "Accurate" },
    { id: "Analitis", en: "Analytical" },
    { id: "Sistematis", en: "Systematic" },
    { id: "Perfeksionis", en: "Perfectionist" },
    { id: "Logis", en: "Logical" },
    { id: "Hati-hati", en: "Cautious" },
    { id: "Disiplin", en: "Disciplined" },
    { id: "Rapi", en: "Orderly" },
    { id: "Memperhatikan detail", en: "Detail-oriented" },
    { id: "Taat aturan", en: "Rule-following" },
    { id: "Kritis", en: "Critical thinker" },
    { id: "Objektif", en: "Objective" },
    { id: "Tepat waktu", en: "Punctual" },
    { id: "Terstruktur", en: "Structured" },
    { id: "Cermat", en: "Precise" },
    { id: "Skeptis", en: "Skeptical" },
    { id: "Pendiam", en: "Reserved" },
    { id: "Formal", en: "Formal" },
    { id: "Diplomatis", en: "Diplomatic" },
    { id: "Berstandar tinggi", en: "High standards" },
    { id: "Ingin tahu", en: "Inquisitive" },
    { id: "Metodis", en: "Methodical" },
    { id: "Patuh", en: "Compliant" },
  ],
};

// Urutan opsi diacak (tetap) agar polanya tidak mudah ditebak.
const orders: DiscKey[][] = [
  ["D", "I", "S", "C"],
  ["S", "C", "D", "I"],
  ["I", "D", "C", "S"],
  ["C", "S", "I", "D"],
  ["I", "S", "D", "C"],
  ["D", "C", "I", "S"],
];

export const discGroups = words.D.map((_, i) => ({
  id: `g${i + 1}`,
  options: orders[i % orders.length].map((key) => ({ key, label: words[key][i] })),
}));

export function getDiscClientQuestions(locale: Locale): ClientDiscQuestion[] {
  return discGroups.map((g) => ({
    kind: "disc",
    id: g.id,
    options: g.options.map((o) => ({ key: o.key, label: o.label[locale] })),
  }));
}

export type DiscResult = {
  /** Selisih "paling" dikurangi "paling tidak" per dimensi (-24..24). */
  net: Record<DiscKey, number>;
  /** Skala 0-100 untuk grafik. */
  intensity: Record<DiscKey, number>;
  primary: DiscKey;
  secondary: DiscKey;
};

function isDiscAnswer(a: unknown): a is DiscAnswer {
  return typeof a === "object" && a !== null && "most" in a && "least" in a;
}

export function scoreDisc(answers: Answers): DiscResult {
  const net: Record<DiscKey, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (const g of discGroups) {
    const a = answers[g.id];
    if (!isDiscAnswer(a) || a.most === a.least) continue;
    if (discKeys.includes(a.most as DiscKey)) net[a.most as DiscKey]++;
    if (discKeys.includes(a.least as DiscKey)) net[a.least as DiscKey]--;
  }
  const n = discGroups.length;
  const intensity = {} as Record<DiscKey, number>;
  for (const k of discKeys) intensity[k] = Math.round(((net[k] + n) / (2 * n)) * 100);
  const sorted = [...discKeys].sort((a, b) => net[b] - net[a]);
  return { net, intensity, primary: sorted[0], secondary: sorted[1] };
}

export const discProfiles: Record<DiscKey, { name: L; tagline: L; description: L; strengths: L[]; challenges: L[]; workTips: L }> = {
  D: {
    name: { id: "Dominance (Dominan)", en: "Dominance" },
    tagline: { id: "Langsung, tegas, berorientasi hasil", en: "Direct, decisive, results-oriented" },
    description: {
      id: "Kamu fokus pada hasil, menyukai tantangan, dan cepat mengambil keputusan. Kamu nyaman memegang kendali dan mendorong perubahan.",
      en: "You focus on results, enjoy challenges and make decisions quickly. You're comfortable taking control and driving change.",
    },
    strengths: [
      { id: "Cepat mengambil keputusan", en: "Makes decisions fast" },
      { id: "Berani menghadapi tantangan", en: "Takes on challenges" },
      { id: "Mendorong tim mencapai target", en: "Pushes the team toward goals" },
    ],
    challenges: [
      { id: "Bisa terkesan kurang sabar", en: "Can come across as impatient" },
      { id: "Kadang mengabaikan perasaan orang lain", en: "May overlook others' feelings" },
    ],
    workTips: {
      id: "Berikan ruang bagi orang lain untuk berpendapat dan luangkan waktu mendengarkan sebelum memutuskan.",
      en: "Give others room to share their views and take time to listen before deciding.",
    },
  },
  I: {
    name: { id: "Influence (Pengaruh)", en: "Influence" },
    tagline: { id: "Antusias, optimis, suka bersosialisasi", en: "Enthusiastic, optimistic, social" },
    description: {
      id: "Kamu energik, ekspresif, dan pandai memengaruhi orang lain. Kamu senang bekerja dengan orang dan membangun suasana positif.",
      en: "You're energetic, expressive and good at influencing others. You enjoy working with people and creating a positive atmosphere.",
    },
    strengths: [
      { id: "Membangun jaringan dan relasi", en: "Builds networks and relationships" },
      { id: "Memotivasi dan menginspirasi", en: "Motivates and inspires" },
      { id: "Komunikatif", en: "Communicative" },
    ],
    challenges: [
      { id: "Kurang memperhatikan detail", en: "May miss details" },
      { id: "Bisa terlalu optimis terhadap rencana", en: "Can be overly optimistic about plans" },
    ],
    workTips: {
      id: "Gunakan daftar tugas atau pengingat agar ide-ide besarmu terlaksana sampai tuntas.",
      en: "Use checklists or reminders so your big ideas get carried through to the end.",
    },
  },
  S: {
    name: { id: "Steadiness (Stabil)", en: "Steadiness" },
    tagline: { id: "Sabar, setia, suportif", en: "Patient, loyal, supportive" },
    description: {
      id: "Kamu tenang, dapat diandalkan, dan menghargai kerja sama. Kamu menciptakan lingkungan yang stabil dan harmonis.",
      en: "You're calm, dependable and value cooperation. You create a stable, harmonious environment.",
    },
    strengths: [
      { id: "Pendengar yang baik", en: "Good listener" },
      { id: "Konsisten dan dapat diandalkan", en: "Consistent and reliable" },
      { id: "Pemain tim yang kuat", en: "Strong team player" },
    ],
    challenges: [
      { id: "Kurang nyaman dengan perubahan mendadak", en: "Uncomfortable with sudden change" },
      { id: "Sulit berkata tidak", en: "Finds it hard to say no" },
    ],
    workTips: {
      id: "Latih menyampaikan pendapat dan kebutuhanmu secara terbuka, termasuk saat tidak setuju.",
      en: "Practice voicing your opinions and needs openly, including when you disagree.",
    },
  },
  C: {
    name: { id: "Conscientiousness (Cermat)", en: "Conscientiousness" },
    tagline: { id: "Analitis, teliti, sistematis", en: "Analytical, precise, systematic" },
    description: {
      id: "Kamu mengutamakan kualitas, ketepatan, dan data. Kamu bekerja secara terstruktur dan menyukai standar yang jelas.",
      en: "You prioritize quality, accuracy and data. You work in a structured way and like clear standards.",
    },
    strengths: [
      { id: "Teliti dan akurat", en: "Thorough and accurate" },
      { id: "Analisis yang kuat", en: "Strong analysis" },
      { id: "Menjaga kualitas", en: "Upholds quality" },
    ],
    challenges: [
      { id: "Bisa terlalu perfeksionis", en: "Can be too perfectionistic" },
      { id: "Lambat memutuskan jika data belum lengkap", en: "Slow to decide without complete data" },
    ],
    workTips: {
      id: "Tetapkan batas waktu untuk analisis, lalu ambil keputusan dengan data yang cukup, bukan sempurna.",
      en: "Set a time limit for analysis, then decide with enough data rather than perfect data.",
    },
  },
};
