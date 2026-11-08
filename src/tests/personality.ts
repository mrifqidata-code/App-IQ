/**
 * Tes Kepribadian 16 Tipe (terinspirasi teori tipe psikologis Jung).
 * Seluruh pernyataan ditulis khusus untuk aplikasi ini. Ini BUKAN instrumen MBTI® resmi.
 */
import type { Answers, ClientLikertQuestion, L, Locale } from "./types";

export type Dim = "EI" | "SN" | "TF" | "JP";
export type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export const dims: Dim[] = ["EI", "SN", "TF", "JP"];

export const poleLabels: Record<Pole, L> = {
  E: { id: "Ekstrovert", en: "Extraversion" },
  I: { id: "Introvert", en: "Introversion" },
  S: { id: "Sensing", en: "Sensing" },
  N: { id: "Intuition", en: "Intuition" },
  T: { id: "Thinking", en: "Thinking" },
  F: { id: "Feeling", en: "Feeling" },
  J: { id: "Judging", en: "Judging" },
  P: { id: "Perceiving", en: "Perceiving" },
};

type Item = { pole: Pole; text: L };

const itemsByPole: Record<Pole, L[]> = {
  E: [
    { id: "Saya merasa bersemangat setelah menghabiskan waktu bersama banyak orang.", en: "I feel energized after spending time with a lot of people." },
    { id: "Saya mudah memulai percakapan dengan orang yang baru dikenal.", en: "I easily start conversations with people I've just met." },
    { id: "Saya lebih suka berpikir sambil membicarakan ide dengan orang lain.", en: "I prefer to think things through by talking them over with others." },
    { id: "Saya menikmati menjadi pusat perhatian di sebuah acara.", en: "I enjoy being the center of attention at events." },
    { id: "Saya memiliki lingkaran pertemanan yang luas.", en: "I have a wide circle of friends and acquaintances." },
    { id: "Di akhir pekan, saya lebih suka pergi keluar daripada di rumah saja.", en: "On weekends, I'd rather go out than stay at home." },
  ],
  I: [
    { id: "Saya butuh waktu sendiri untuk mengisi energi setelah bersosialisasi.", en: "I need time alone to recharge after socializing." },
    { id: "Saya lebih suka obrolan mendalam dengan satu orang daripada basa-basi dalam kelompok.", en: "I prefer a deep conversation with one person over small talk in a group." },
    { id: "Saya biasanya berpikir matang-matang sebelum berbicara.", en: "I usually think carefully before I speak." },
    { id: "Saya lebih nyaman bekerja dengan tenang secara mandiri.", en: "I feel more comfortable working quietly on my own." },
    { id: "Saya cenderung menyimpan perasaan dan pikiran untuk diri sendiri.", en: "I tend to keep my thoughts and feelings to myself." },
    { id: "Tempat yang ramai dan bising cepat membuat saya lelah.", en: "Crowded, noisy places tire me out quickly." },
  ],
  S: [
    { id: "Saya lebih fokus pada fakta dan detail daripada kemungkinan.", en: "I focus more on facts and details than on possibilities." },
    { id: "Saya lebih percaya pada pengalaman dan cara yang sudah terbukti daripada teori baru.", en: "I trust experience and proven methods more than new theories." },
    { id: "Saya lebih suka instruksi yang jelas dan bertahap.", en: "I prefer clear, step-by-step instructions." },
    { id: "Saya sering memperhatikan detail kecil yang terlewat oleh orang lain.", en: "I often notice small details that others miss." },
    { id: "Saya lebih tertarik pada apa yang nyata sekarang daripada apa yang mungkin terjadi nanti.", en: "I'm more interested in what is real now than in what might be later." },
    { id: "Saya lebih suka tugas praktis dengan hasil yang konkret.", en: "I prefer practical tasks with concrete results." },
  ],
  N: [
    { id: "Saya sering membayangkan berbagai kemungkinan dan ide di masa depan.", en: "I often imagine future possibilities and ideas." },
    { id: "Saya senang mendiskusikan teori dan konsep yang abstrak.", en: "I enjoy discussing abstract theories and concepts." },
    { id: "Saya cenderung melihat gambaran besar sebelum detailnya.", en: "I tend to see the big picture before the details." },
    { id: "Saya mudah bosan dengan rutinitas dan tugas yang berulang.", en: "I get bored easily with routine and repetitive tasks." },
    { id: "Saya sering menangkap makna tersirat di balik sesuatu.", en: "I often pick up on hidden meanings behind things." },
    { id: "Saya suka mencari cara baru, bahkan ketika cara lama masih berhasil.", en: "I like finding new ways of doing things, even when the old way still works." },
  ],
  T: [
    { id: "Saat mengambil keputusan, saya mengutamakan logika daripada perasaan.", en: "When making decisions, I put logic ahead of feelings." },
    { id: "Saya mudah memberi kritik jujur meskipun mungkin menyakitkan.", en: "I find it easy to give honest criticism, even if it might hurt." },
    { id: "Bagi saya, keadilan dan konsistensi lebih penting daripada menjaga suasana.", en: "To me, fairness and consistency matter more than keeping the peace." },
    { id: "Dalam perdebatan, saya fokus pada siapa yang benar, bukan perasaan orang lain.", en: "In a debate, I focus on who is right rather than on how people feel." },
    { id: "Saya menimbang untung-rugi secara objektif sebelum memutuskan.", en: "I weigh pros and cons objectively before deciding." },
    { id: "Menurut saya efisiensi lebih penting daripada membuat semua orang senang.", en: "I think efficiency is more important than keeping everyone happy." },
  ],
  F: [
    { id: "Saya mempertimbangkan dampak keputusan saya terhadap perasaan orang lain.", en: "I consider how my decisions will affect other people's feelings." },
    { id: "Saya mudah merasakan apa yang sedang dirasakan orang lain.", en: "I can easily sense what others are feeling." },
    { id: "Saya menghindari konflik demi menjaga hubungan tetap harmonis.", en: "I avoid conflict to keep relationships harmonious." },
    { id: "Saya mengambil keputusan berdasarkan nilai-nilai pribadi.", en: "I make decisions based on my personal values." },
    { id: "Saya sulit menolak ketika ada orang yang meminta bantuan.", en: "I find it hard to say no when someone asks for help." },
    { id: "Apresiasi dan dukungan lebih memotivasi saya daripada target.", en: "Appreciation and encouragement motivate me more than targets." },
  ],
  J: [
    { id: "Saya suka merencanakan sesuatu jauh-jauh hari.", en: "I like to plan things well in advance." },
    { id: "Saya merasa tidak nyaman jika rencana berubah mendadak.", en: "I feel uncomfortable when plans change suddenly." },
    { id: "Saya biasanya menyelesaikan tugas jauh sebelum tenggat waktu.", en: "I usually finish tasks well before the deadline." },
    { id: "Saya suka tempat kerja saya rapi dan teratur.", en: "I like my workspace to be neat and organized." },
    { id: "Saya suka membuat daftar tugas dan mengikutinya.", en: "I like making to-do lists and sticking to them." },
    { id: "Saya lebih suka cepat mengambil keputusan agar urusan segera tuntas.", en: "I prefer to decide quickly so matters are settled." },
  ],
  P: [
    { id: "Saya lebih suka membiarkan pilihan tetap terbuka daripada terikat pada satu rencana.", en: "I prefer to keep my options open rather than commit to one plan." },
    { id: "Saya sering bekerja dengan semangat penuh menjelang tenggat waktu.", en: "I often work in a burst of energy just before a deadline." },
    { id: "Saya menikmati spontanitas dan improvisasi.", en: "I enjoy spontaneity and improvising." },
    { id: "Saya mudah beradaptasi ketika sesuatu tidak berjalan sesuai rencana.", en: "I adapt easily when things don't go as planned." },
    { id: "Saya sering memulai hal baru sebelum menyelesaikan yang lama.", en: "I often start new things before finishing old ones." },
    { id: "Aturan dan jadwal yang ketat membuat saya merasa terkekang.", en: "Strict rules and schedules make me feel restricted." },
  ],
};

const order: Pole[] = ["E", "S", "T", "J", "I", "N", "F", "P"];

/** 48 pernyataan, diselang-seling antar dimensi. */
export const personalityItems: (Item & { id: string })[] = Array.from({ length: 6 }).flatMap((_, i) =>
  order.map((pole) => ({ id: `${pole}${i + 1}`, pole, text: itemsByPole[pole][i] })),
);

export function getPersonalityClientQuestions(locale: Locale): ClientLikertQuestion[] {
  return personalityItems.map((it) => ({ kind: "likert", id: it.id, prompt: it.text[locale] }));
}

export type PersonalityResult = {
  type: string;
  /** Persentase ke huruf pertama tiap dimensi (E, S, T, J). 0-100. */
  percents: Record<Dim, number>;
};

export function scorePersonality(answers: Answers): PersonalityResult {
  const totals: Record<Dim, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const counts: Record<Dim, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const it of personalityItems) {
    const a = answers[it.id];
    if (typeof a !== "number") continue;
    const dim = dims.find((d) => d.includes(it.pole))!;
    const sign = dim[0] === it.pole ? 1 : -1;
    totals[dim] += sign * (a - 3); // -2..+2
    counts[dim] += 2;
  }
  const percents = {} as Record<Dim, number>;
  let type = "";
  for (const d of dims) {
    const p = counts[d] ? Math.round(50 + (totals[d] / counts[d]) * 50) : 50;
    percents[d] = p;
    type += p >= 50 ? d[0] : d[1];
  }
  return { type, percents };
}

export type TypeProfile = { nickname: L; description: L; strengths: L[]; careers: L };

export const typeProfiles: Record<string, TypeProfile> = {
  INTJ: {
    nickname: { id: "Ahli Strategi", en: "The Strategist" },
    description: {
      id: "Pemikir mandiri yang visioner. Kamu suka menyusun rencana jangka panjang dan terus menyempurnakan sistem agar lebih efektif.",
      en: "An independent, visionary thinker. You like building long-term plans and constantly refining systems to make them more effective.",
    },
    strengths: [
      { id: "Berpikir strategis", en: "Strategic thinking" },
      { id: "Mandiri dan tegas", en: "Independent and decisive" },
      { id: "Standar kualitas tinggi", en: "High standards" },
    ],
    careers: { id: "Perencana strategi, ilmuwan, arsitek sistem, analis", en: "Strategist, scientist, systems architect, analyst" },
  },
  INTP: {
    nickname: { id: "Pemikir", en: "The Thinker" },
    description: {
      id: "Penasaran dan analitis. Kamu senang membongkar cara kerja sesuatu dan menemukan penjelasan yang paling logis.",
      en: "Curious and analytical. You love taking ideas apart to see how they work and finding the most logical explanation.",
    },
    strengths: [
      { id: "Analisis mendalam", en: "Deep analysis" },
      { id: "Kreatif dalam ide", en: "Inventive with ideas" },
      { id: "Objektif", en: "Objective" },
    ],
    careers: { id: "Peneliti, programmer, data scientist, filsuf", en: "Researcher, programmer, data scientist, philosopher" },
  },
  ENTJ: {
    nickname: { id: "Pemimpin Visioner", en: "The Visionary Leader" },
    description: {
      id: "Tegas dan berorientasi pada tujuan. Kamu alami mengambil kendali, mengorganisasi orang, dan mendorong hasil.",
      en: "Decisive and goal-driven. You naturally take charge, organize people and push for results.",
    },
    strengths: [
      { id: "Kepemimpinan", en: "Leadership" },
      { id: "Efisien", en: "Efficient" },
      { id: "Percaya diri", en: "Confident" },
    ],
    careers: { id: "Eksekutif, manajer proyek, konsultan, wirausaha", en: "Executive, project manager, consultant, entrepreneur" },
  },
  ENTP: {
    nickname: { id: "Inovator", en: "The Innovator" },
    description: {
      id: "Cerdas, cepat berpikir, dan suka tantangan intelektual. Kamu senang berdebat dan melahirkan ide-ide baru.",
      en: "Quick-witted and fond of intellectual challenges. You enjoy debate and generating fresh ideas.",
    },
    strengths: [
      { id: "Inovatif", en: "Innovative" },
      { id: "Pandai berargumen", en: "Persuasive" },
      { id: "Mudah beradaptasi", en: "Adaptable" },
    ],
    careers: { id: "Wirausaha, pemasar, pengacara, desainer produk", en: "Entrepreneur, marketer, lawyer, product designer" },
  },
  INFJ: {
    nickname: { id: "Penasihat", en: "The Counselor" },
    description: {
      id: "Tenang, berwawasan, dan idealis. Kamu peka memahami orang lain dan ingin membuat perubahan yang bermakna.",
      en: "Quiet, insightful and idealistic. You understand people deeply and want to make a meaningful difference.",
    },
    strengths: [
      { id: "Empati mendalam", en: "Deep empathy" },
      { id: "Visioner", en: "Visionary" },
      { id: "Berprinsip", en: "Principled" },
    ],
    careers: { id: "Psikolog, konselor, penulis, aktivis sosial", en: "Psychologist, counselor, writer, social advocate" },
  },
  INFP: {
    nickname: { id: "Idealis", en: "The Idealist" },
    description: {
      id: "Lembut, kreatif, dan dipandu nilai-nilai pribadi. Kamu mencari makna dan keaslian dalam hidup.",
      en: "Gentle, creative and guided by personal values. You look for meaning and authenticity in life.",
    },
    strengths: [
      { id: "Kreatif", en: "Creative" },
      { id: "Tulus", en: "Sincere" },
      { id: "Berpikiran terbuka", en: "Open-minded" },
    ],
    careers: { id: "Penulis, desainer, konselor, pekerja sosial", en: "Writer, designer, counselor, social worker" },
  },
  ENFJ: {
    nickname: { id: "Mentor", en: "The Mentor" },
    description: {
      id: "Hangat dan karismatik. Kamu senang membimbing dan menginspirasi orang lain untuk berkembang.",
      en: "Warm and charismatic. You enjoy guiding and inspiring others to grow.",
    },
    strengths: [
      { id: "Komunikasi", en: "Communication" },
      { id: "Inspiratif", en: "Inspiring" },
      { id: "Peduli", en: "Caring" },
    ],
    careers: { id: "Guru, pelatih, HR, pemimpin komunitas", en: "Teacher, coach, HR, community leader" },
  },
  ENFP: {
    nickname: { id: "Inspirator", en: "The Inspirer" },
    description: {
      id: "Antusias, imajinatif, dan mudah bergaul. Kamu melihat potensi di mana-mana dan menularkan semangat.",
      en: "Enthusiastic, imaginative and sociable. You see potential everywhere and your energy is contagious.",
    },
    strengths: [
      { id: "Antusias", en: "Enthusiastic" },
      { id: "Kreatif", en: "Creative" },
      { id: "Mudah bergaul", en: "Sociable" },
    ],
    careers: { id: "Kreator konten, jurnalis, pemasar, konsultan", en: "Content creator, journalist, marketer, consultant" },
  },
  ISTJ: {
    nickname: { id: "Pelaksana Andal", en: "The Dependable Organizer" },
    description: {
      id: "Bertanggung jawab, teliti, dan bisa diandalkan. Kamu menghargai aturan, ketertiban, dan menepati janji.",
      en: "Responsible, thorough and reliable. You value rules, order and keeping your word.",
    },
    strengths: [
      { id: "Teliti", en: "Thorough" },
      { id: "Dapat diandalkan", en: "Reliable" },
      { id: "Disiplin", en: "Disciplined" },
    ],
    careers: { id: "Akuntan, auditor, administrator, insinyur", en: "Accountant, auditor, administrator, engineer" },
  },
  ISFJ: {
    nickname: { id: "Pelindung", en: "The Nurturer" },
    description: {
      id: "Setia, sabar, dan penuh perhatian. Kamu senang membantu orang lain secara nyata dan sering bekerja di balik layar.",
      en: "Loyal, patient and attentive. You like helping others in practical ways, often behind the scenes.",
    },
    strengths: [
      { id: "Suportif", en: "Supportive" },
      { id: "Setia", en: "Loyal" },
      { id: "Memperhatikan detail", en: "Detail-oriented" },
    ],
    careers: { id: "Perawat, guru, staf administrasi, layanan pelanggan", en: "Nurse, teacher, administrative staff, customer service" },
  },
  ESTJ: {
    nickname: { id: "Pengatur", en: "The Supervisor" },
    description: {
      id: "Praktis, terorganisasi, dan lugas. Kamu pandai mengatur orang dan sumber daya agar pekerjaan selesai.",
      en: "Practical, organized and straightforward. You're good at managing people and resources to get the job done.",
    },
    strengths: [
      { id: "Terorganisasi", en: "Organized" },
      { id: "Tegas", en: "Decisive" },
      { id: "Bertanggung jawab", en: "Responsible" },
    ],
    careers: { id: "Manajer operasional, polisi/militer, manajer bank", en: "Operations manager, law enforcement, bank manager" },
  },
  ESFJ: {
    nickname: { id: "Perekat Sosial", en: "The Caregiver" },
    description: {
      id: "Ramah, kooperatif, dan peduli pada keharmonisan. Kamu senang memastikan semua orang merasa diterima.",
      en: "Friendly, cooperative and focused on harmony. You like making sure everyone feels welcome.",
    },
    strengths: [
      { id: "Hangat", en: "Warm" },
      { id: "Kooperatif", en: "Cooperative" },
      { id: "Bertanggung jawab", en: "Dutiful" },
    ],
    careers: { id: "Event organizer, perawat, HR, penjualan", en: "Event organizer, nurse, HR, sales" },
  },
  ISTP: {
    nickname: { id: "Pengrajin", en: "The Craftsperson" },
    description: {
      id: "Tenang, praktis, dan suka mencoba langsung. Kamu jago memecahkan masalah teknis secara spontan.",
      en: "Calm, practical and hands-on. You're great at solving technical problems on the spot.",
    },
    strengths: [
      { id: "Pemecah masalah", en: "Problem solver" },
      { id: "Tenang di bawah tekanan", en: "Calm under pressure" },
      { id: "Terampil secara teknis", en: "Technically skilled" },
    ],
    careers: { id: "Teknisi, mekanik, pilot, insinyur lapangan", en: "Technician, mechanic, pilot, field engineer" },
  },
  ISFP: {
    nickname: { id: "Seniman", en: "The Artist" },
    description: {
      id: "Lembut, peka, dan menikmati saat ini. Kamu mengekspresikan diri lewat tindakan dan karya, bukan kata-kata.",
      en: "Gentle, sensitive and present-focused. You express yourself through actions and creations rather than words.",
    },
    strengths: [
      { id: "Estetis", en: "Aesthetic sense" },
      { id: "Fleksibel", en: "Flexible" },
      { id: "Rendah hati", en: "Humble" },
    ],
    careers: { id: "Desainer, fotografer, musisi, chef", en: "Designer, photographer, musician, chef" },
  },
  ESTP: {
    nickname: { id: "Pelaku Aksi", en: "The Doer" },
    description: {
      id: "Energik, berani, dan berorientasi tindakan. Kamu suka tantangan nyata dan cepat membaca situasi.",
      en: "Energetic, bold and action-oriented. You love real-world challenges and read situations quickly.",
    },
    strengths: [
      { id: "Berani", en: "Bold" },
      { id: "Cepat bertindak", en: "Quick to act" },
      { id: "Persuasif", en: "Persuasive" },
    ],
    careers: { id: "Sales, wirausaha, atlet, paramedis", en: "Sales, entrepreneur, athlete, paramedic" },
  },
  ESFP: {
    nickname: { id: "Penghibur", en: "The Performer" },
    description: {
      id: "Ceria, spontan, dan menyenangkan. Kamu membawa keceriaan dan senang menikmati hidup bersama orang lain.",
      en: "Cheerful, spontaneous and fun. You bring joy to others and love enjoying life together.",
    },
    strengths: [
      { id: "Menyenangkan", en: "Fun-loving" },
      { id: "Ekspresif", en: "Expressive" },
      { id: "Praktis", en: "Practical" },
    ],
    careers: { id: "Entertainer, MC, pemandu wisata, hospitality", en: "Entertainer, host, tour guide, hospitality" },
  },
};
