import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/tests/types";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (fromCookie && (locales as string[]).includes(fromCookie)) return fromCookie as Locale;
  // Belum memilih bahasa: pakai bahasa browser bila Inggris, selain itu Indonesia.
  const accept = (await headers()).get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("en") ? "en" : defaultLocale;
}
