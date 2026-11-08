export type Locale = "id" | "en";
export const locales: Locale[] = ["id", "en"];
export const defaultLocale: Locale = "id";

/** Teks dua bahasa. */
export type L = { id: string; en: string };

export type TestType = "iq" | "personality" | "eq" | "disc";
export const testTypes: TestType[] = ["iq", "personality", "eq", "disc"];

export function isTestType(v: string): v is TestType {
  return (testTypes as string[]).includes(v);
}

// ---------- Bentuk soal yang dikirim ke browser (tanpa kunci jawaban) ----------

export type ClientChoiceQuestion = {
  kind: "choice";
  id: string;
  category: string;
  prompt: string;
  /** Teks tambahan, mis. deret simbol yang ditampilkan besar. */
  display?: string;
  options: string[];
};

export type ClientLikertQuestion = {
  kind: "likert";
  id: string;
  prompt: string;
};

export type ClientDiscQuestion = {
  kind: "disc";
  id: string;
  options: { key: string; label: string }[];
};

export type ClientQuestion = ClientChoiceQuestion | ClientLikertQuestion | ClientDiscQuestion;

/** Jawaban: index opsi (choice), 1-5 (likert), atau {most,least} (disc). */
export type DiscAnswer = { most: string; least: string };
export type Answer = number | DiscAnswer;
export type Answers = Record<string, Answer>;
