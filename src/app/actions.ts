"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { auth, devLoginEnabled, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE } from "@/lib/locale";
import { sanitizeAnswers, scoreTest } from "@/tests";
import { isTestType, locales, type Locale } from "@/tests/types";

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInDev(formData: FormData) {
  if (!devLoginEnabled) return;
  try {
    await signIn("dev", { name: formData.get("name"), redirectTo: "/dashboard" });
  } catch (e) {
    // signIn melempar redirect saat berhasil; hanya tangani error autentikasi.
    if (e instanceof AuthError) return;
    throw e;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export type SubmitResult = { ok: true; id: string } | { ok: false; error: "unauthorized" | "invalid" };

export async function submitTest(type: string, answers: unknown, durationMs: number): Promise<SubmitResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!isTestType(type)) return { ok: false, error: "invalid" };

  const clean = sanitizeAnswers(type, answers);
  if (!clean) return { ok: false, error: "invalid" };

  const result = scoreTest(type, clean);
  const saved = await prisma.testResult.create({
    data: {
      userId,
      testType: type,
      answers: JSON.stringify(clean),
      result: JSON.stringify(result),
      durationMs: Number.isFinite(durationMs) ? Math.max(0, Math.round(durationMs)) : null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/history");
  return { ok: true, id: saved.id };
}
