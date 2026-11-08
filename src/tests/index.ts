import { getDiscClientQuestions, scoreDisc, type DiscResult } from "./disc";
import { getEqClientQuestions, scoreEq, type EqResult } from "./eq";
import { getIqClientQuestions, IQ_TIME_LIMIT_SECONDS, scoreIq, type IqResult } from "./iq";
import { getPersonalityClientQuestions, scorePersonality, type PersonalityResult } from "./personality";
import type { Answers, ClientQuestion, L, Locale, TestType } from "./types";

export type TestMeta = {
  type: TestType;
  title: L;
  description: L;
  minutes: number;
  icon: string;
  /** Batas waktu dalam detik (hanya IQ). */
  timeLimit?: number;
  color: string;
};

export const testMeta: Record<TestType, TestMeta> = {
  iq: {
    type: "iq",
    title: { id: "Tes IQ", en: "IQ Test" },
    description: {
      id: "Ukur kemampuan penalaran numerik, verbal, logika, dan pola.",
      en: "Measure your numerical, verbal, logical and pattern reasoning.",
    },
    minutes: 25,
    timeLimit: IQ_TIME_LIMIT_SECONDS,
    icon: "🧠",
    color: "indigo",
  },
  personality: {
    type: "personality",
    title: { id: "Tes Kepribadian 16 Tipe", en: "16-Type Personality Test" },
    description: {
      id: "Temukan tipe kepribadianmu dari empat dimensi: E/I, S/N, T/F, J/P.",
      en: "Discover your personality type across four dimensions: E/I, S/N, T/F, J/P.",
    },
    minutes: 10,
    icon: "🧩",
    color: "violet",
  },
  eq: {
    type: "eq",
    title: { id: "Tes EQ", en: "EQ Test" },
    description: {
      id: "Ukur kecerdasan emosionalmu dalam 5 aspek utama.",
      en: "Measure your emotional intelligence across 5 key areas.",
    },
    minutes: 8,
    icon: "💗",
    color: "rose",
  },
  disc: {
    type: "disc",
    title: { id: "Tes Gaya Perilaku DISC", en: "DISC Behavior Style Test" },
    description: {
      id: "Kenali gaya perilaku dan cara kerjamu: Dominance, Influence, Steadiness, Conscientiousness.",
      en: "Understand your behavior and work style: Dominance, Influence, Steadiness, Conscientiousness.",
    },
    minutes: 8,
    icon: "🎯",
    color: "amber",
  },
};

export function getClientQuestions(type: TestType, locale: Locale): ClientQuestion[] {
  switch (type) {
    case "iq":
      return getIqClientQuestions(locale);
    case "personality":
      return getPersonalityClientQuestions(locale);
    case "eq":
      return getEqClientQuestions(locale);
    case "disc":
      return getDiscClientQuestions(locale);
  }
}

export type ResultByType = {
  iq: IqResult;
  personality: PersonalityResult;
  eq: EqResult;
  disc: DiscResult;
};
export type AnyResult = ResultByType[TestType];

/**
 * Bersihkan jawaban dari browser: hanya ambil id soal yang valid dengan bentuk jawaban yang benar.
 * Mengembalikan null bila soal wajib belum terjawab semua (kecuali IQ, yang boleh kosong saat waktu habis).
 */
export function sanitizeAnswers(type: TestType, input: unknown): Answers | null {
  if (typeof input !== "object" || input === null) return null;
  const src = input as Record<string, unknown>;
  const questions = getClientQuestions(type, "id");
  const out: Answers = {};
  for (const q of questions) {
    const a = src[q.id];
    if (q.kind === "choice") {
      if (Number.isInteger(a) && (a as number) >= 0 && (a as number) < q.options.length) out[q.id] = a as number;
    } else if (q.kind === "likert") {
      if (Number.isInteger(a) && (a as number) >= 1 && (a as number) <= 5) out[q.id] = a as number;
    } else {
      const keys = q.options.map((o) => o.key);
      const v = a as { most?: unknown; least?: unknown } | undefined;
      if (
        v &&
        typeof v.most === "string" &&
        typeof v.least === "string" &&
        v.most !== v.least &&
        keys.includes(v.most) &&
        keys.includes(v.least)
      ) {
        out[q.id] = { most: v.most, least: v.least };
      }
    }
  }
  if (type !== "iq" && Object.keys(out).length !== questions.length) return null;
  return out;
}

export function scoreTest(type: TestType, answers: Answers): AnyResult {
  switch (type) {
    case "iq":
      return scoreIq(answers);
    case "personality":
      return scorePersonality(answers);
    case "eq":
      return scoreEq(answers);
    case "disc":
      return scoreDisc(answers);
  }
}
