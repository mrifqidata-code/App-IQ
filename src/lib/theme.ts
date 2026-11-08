import type { TestType } from "@/tests/types";

/** Kelas Tailwind per tes (ditulis lengkap agar terdeteksi Tailwind). */
export const testTheme: Record<TestType, { gradient: string; soft: string; text: string; ring: string; button: string; hex: string }> = {
  iq: {
    gradient: "from-indigo-500 to-blue-500",
    soft: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-300",
    ring: "ring-indigo-500",
    button: "bg-indigo-600 hover:bg-indigo-700",
    hex: "#6366f1",
  },
  personality: {
    gradient: "from-violet-500 to-fuchsia-500",
    soft: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-300",
    ring: "ring-violet-500",
    button: "bg-violet-600 hover:bg-violet-700",
    hex: "#8b5cf6",
  },
  eq: {
    gradient: "from-rose-500 to-pink-500",
    soft: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-300",
    ring: "ring-rose-500",
    button: "bg-rose-600 hover:bg-rose-700",
    hex: "#f43f5e",
  },
  disc: {
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-300",
    ring: "ring-amber-500",
    button: "bg-amber-600 hover:bg-amber-700",
    hex: "#f59e0b",
  },
};
