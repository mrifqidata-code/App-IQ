/**
 * Tes Kecerdasan Emosional (EQ), 5 aspek berdasarkan model Goleman.
 * Pernyataan ditulis khusus untuk aplikasi ini.
 */
import type { Answers, ClientLikertQuestion, L, Locale } from "./types";

export type EqAspect = "selfAwareness" | "selfRegulation" | "motivation" | "empathy" | "socialSkills";
export const eqAspects: EqAspect[] = ["selfAwareness", "selfRegulation", "motivation", "empathy", "socialSkills"];

export const eqAspectInfo: Record<EqAspect, { label: L; description: L; tip: L }> = {
  selfAwareness: {
    label: { id: "Kesadaran Diri", en: "Self-Awareness" },
    description: {
      id: "Kemampuan mengenali emosi, kekuatan, dan kelemahan diri sendiri.",
      en: "The ability to recognize your own emotions, strengths and weaknesses.",
    },
    tip: {
      id: "Coba menulis jurnal singkat setiap hari: apa yang kamu rasakan dan apa pemicunya.",
      en: "Try keeping a short daily journal: what you felt and what triggered it.",
    },
  },
  selfRegulation: {
    label: { id: "Pengendalian Diri", en: "Self-Regulation" },
    description: {
      id: "Kemampuan mengelola emosi dan dorongan agar tetap tenang dan terkendali.",
      en: "The ability to manage emotions and impulses so you stay calm and in control.",
    },
    tip: {
      id: "Saat emosi memuncak, beri jeda: tarik napas dalam 4 detik, tahan 4 detik, hembuskan 4 detik sebelum merespons.",
      en: "When emotions run high, pause: breathe in for 4 seconds, hold for 4, breathe out for 4 before responding.",
    },
  },
  motivation: {
    label: { id: "Motivasi Diri", en: "Motivation" },
    description: {
      id: "Dorongan dari dalam untuk mencapai tujuan dan bangkit dari kegagalan.",
      en: "The inner drive to reach goals and bounce back from setbacks.",
    },
    tip: {
      id: "Pecah tujuan besar menjadi target mingguan kecil dan rayakan setiap kemajuan.",
      en: "Break big goals into small weekly targets and celebrate each bit of progress.",
    },
  },
  empathy: {
    label: { id: "Empati", en: "Empathy" },
    description: {
      id: "Kemampuan memahami perasaan dan sudut pandang orang lain.",
      en: "The ability to understand other people's feelings and perspectives.",
    },
    tip: {
      id: "Latih mendengarkan aktif: dengarkan sampai selesai, lalu ulangi inti cerita orang lain sebelum memberi pendapat.",
      en: "Practice active listening: hear people out, then restate their main point before giving your view.",
    },
  },
  socialSkills: {
    label: { id: "Keterampilan Sosial", en: "Social Skills" },
    description: {
      id: "Kemampuan membangun hubungan, bekerja sama, dan menyelesaikan konflik.",
      en: "The ability to build relationships, cooperate and resolve conflict.",
    },
    tip: {
      id: "Saat konflik, fokus pada masalah, bukan orangnya, dan cari solusi yang menguntungkan kedua pihak.",
      en: "In a conflict, focus on the problem rather than the person, and look for a solution that works for both sides.",
    },
  },
};

type EqItem = { id: string; aspect: EqAspect; reverse?: boolean; text: L };

const raw: Record<EqAspect, { text: L; reverse?: boolean }[]> = {
  selfAwareness: [
    { text: { id: "Saya bisa menyebutkan dengan tepat emosi yang sedang saya rasakan.", en: "I can name exactly which emotion I'm feeling." } },
    { text: { id: "Saya tahu situasi apa saja yang membuat saya mudah stres.", en: "I know which situations tend to stress me out." } },
    { text: { id: "Saya memahami kekuatan dan kelemahan saya sendiri.", en: "I understand my own strengths and weaknesses." } },
    { text: { id: "Saya menyadari bagaimana suasana hati saya memengaruhi perilaku saya.", en: "I'm aware of how my mood affects my behavior." } },
    { text: { id: "Saya terbuka menerima masukan tentang diri saya.", en: "I'm open to feedback about myself." } },
    { reverse: true, text: { id: "Saya sering bingung mengapa saya tiba-tiba merasa kesal.", en: "I'm often confused about why I suddenly feel upset." } },
    { reverse: true, text: { id: "Orang lain sering lebih dulu menyadari perubahan emosi saya daripada saya sendiri.", en: "Others often notice my mood changes before I do." } },
  ],
  selfRegulation: [
    { text: { id: "Saya bisa tetap tenang dalam situasi yang menegangkan.", en: "I can stay calm in tense situations." } },
    { text: { id: "Saya berpikir dulu sebelum bereaksi ketika marah.", en: "I think before reacting when I'm angry." } },
    { text: { id: "Saya mampu menunda kesenangan demi tujuan jangka panjang.", en: "I can delay gratification for long-term goals." } },
    { text: { id: "Saya bisa cepat pulih dari suasana hati yang buruk.", en: "I recover quickly from a bad mood." } },
    { text: { id: "Saya tetap bisa berpikir jernih saat berada di bawah tekanan.", en: "I can still think clearly when under pressure." } },
    { reverse: true, text: { id: "Saya sering mengatakan hal yang kemudian saya sesali saat emosi.", en: "I often say things I later regret when I'm emotional." } },
    { reverse: true, text: { id: "Hal kecil bisa dengan mudah merusak suasana hati saya seharian.", en: "Small things can easily ruin my mood for the whole day." } },
  ],
  motivation: [
    { text: { id: "Saya tetap berusaha meskipun menghadapi kegagalan.", en: "I keep trying even when I face failure." } },
    { text: { id: "Saya menetapkan tujuan yang menantang bagi diri sendiri.", en: "I set challenging goals for myself." } },
    { text: { id: "Saya bisa memotivasi diri tanpa menunggu dorongan dari orang lain.", en: "I can motivate myself without waiting for others to push me." } },
    { text: { id: "Saya melihat kesulitan sebagai kesempatan untuk belajar.", en: "I see difficulties as opportunities to learn." } },
    { text: { id: "Saya optimis tentang masa depan saya.", en: "I'm optimistic about my future." } },
    { reverse: true, text: { id: "Saya mudah menyerah ketika sesuatu terasa sulit.", en: "I give up easily when something feels hard." } },
    { reverse: true, text: { id: "Saya sering menunda pekerjaan penting sampai menit terakhir.", en: "I often put off important work until the last minute." } },
  ],
  empathy: [
    { text: { id: "Saya bisa merasakan ketika seseorang sedang sedih meskipun ia tidak mengatakannya.", en: "I can tell when someone is sad even if they don't say so." } },
    { text: { id: "Saya berusaha memahami sudut pandang orang lain sebelum menilai.", en: "I try to understand others' points of view before judging." } },
    { text: { id: "Saya mendengarkan dengan sungguh-sungguh saat orang lain bercerita.", en: "I listen carefully when others share their stories." } },
    { text: { id: "Saya memperhatikan bahasa tubuh dan nada bicara orang lain.", en: "I pay attention to other people's body language and tone." } },
    { text: { id: "Saya ikut senang ketika orang lain berhasil.", en: "I feel genuinely happy when others succeed." } },
    { reverse: true, text: { id: "Saya sulit memahami mengapa orang lain bisa begitu emosional.", en: "I find it hard to understand why others get so emotional." } },
    { reverse: true, text: { id: "Saya sering tidak sadar bahwa ucapan saya menyinggung orang lain.", en: "I often don't realize that what I said offended someone." } },
  ],
  socialSkills: [
    { text: { id: "Saya mudah membangun hubungan baik dengan orang baru.", en: "I easily build good relationships with new people." } },
    { text: { id: "Saya bisa menengahi konflik antara dua pihak.", en: "I can mediate conflicts between two parties." } },
    { text: { id: "Saya nyaman bekerja sama dalam tim.", en: "I'm comfortable working as part of a team." } },
    { text: { id: "Saya bisa menyampaikan pendapat yang berbeda tanpa menyinggung.", en: "I can express a different opinion without offending anyone." } },
    { text: { id: "Orang lain sering meminta saran atau bantuan saya.", en: "People often come to me for advice or help." } },
    { reverse: true, text: { id: "Saya lebih memilih menghindar daripada membicarakan masalah dengan orang lain.", en: "I'd rather avoid people than talk through a problem with them." } },
    { reverse: true, text: { id: "Saya kesulitan menjaga hubungan pertemanan dalam jangka panjang.", en: "I struggle to maintain friendships over the long term." } },
  ],
};

/** 35 pernyataan, diselang-seling antar aspek. */
export const eqItems: EqItem[] = Array.from({ length: 7 }).flatMap((_, i) =>
  eqAspects.map((aspect) => ({ id: `${aspect}${i + 1}`, aspect, ...raw[aspect][i] })),
);

export function getEqClientQuestions(locale: Locale): ClientLikertQuestion[] {
  return eqItems.map((it) => ({ kind: "likert", id: it.id, prompt: it.text[locale] }));
}

export type EqLevel = "high" | "medium" | "low";
export type EqResult = { overall: number; level: EqLevel; aspects: Record<EqAspect, number> };

export const eqLevelLabels: Record<EqLevel, L> = {
  high: { id: "Tinggi", en: "High" },
  medium: { id: "Sedang", en: "Moderate" },
  low: { id: "Perlu Dikembangkan", en: "Needs Development" },
};

export const eqLevelDescriptions: Record<EqLevel, L> = {
  high: {
    id: "Kamu umumnya mampu mengenali dan mengelola emosi dengan baik, serta membangun hubungan yang sehat dengan orang lain.",
    en: "You are generally good at recognizing and managing emotions, and at building healthy relationships with others.",
  },
  medium: {
    id: "Kecerdasan emosionalmu cukup baik. Ada beberapa aspek yang bisa kamu latih agar semakin kuat.",
    en: "Your emotional intelligence is fairly solid. A few aspects could be practiced to make it even stronger.",
  },
  low: {
    id: "Beberapa aspek emosional masih bisa banyak dikembangkan. Kabar baiknya, EQ bisa dilatih seiring waktu.",
    en: "Several emotional skills have plenty of room to grow. The good news: EQ can be trained over time.",
  },
};

export function eqLevel(score: number): EqLevel {
  return score >= 75 ? "high" : score >= 50 ? "medium" : "low";
}

export function scoreEq(answers: Answers): EqResult {
  const sums = {} as Record<EqAspect, { sum: number; n: number }>;
  for (const a of eqAspects) sums[a] = { sum: 0, n: 0 };
  for (const it of eqItems) {
    const a = answers[it.id];
    if (typeof a !== "number") continue;
    sums[it.aspect].sum += it.reverse ? 6 - a : a;
    sums[it.aspect].n++;
  }
  const aspects = {} as Record<EqAspect, number>;
  for (const a of eqAspects) {
    const { sum, n } = sums[a];
    aspects[a] = n ? Math.round(((sum / n - 1) / 4) * 100) : 0;
  }
  const overall = Math.round(eqAspects.reduce((s, a) => s + aspects[a], 0) / eqAspects.length);
  return { overall, level: eqLevel(overall), aspects };
}
