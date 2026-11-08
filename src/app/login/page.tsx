import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth, devLoginEnabled, googleLoginEnabled } from "@/auth";
import { signInDev, signInWithGoogle } from "@/app/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { testMeta } from "@/tests";
import { testTypes } from "@/tests/types";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getTranslations("login");
  return { title: t("title") };
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  const t = await getTranslations();
  const locale = await getLocale();
  const features = t.raw("login.features") as string[];

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-2xl font-bold">{t("app.name")}</div>
        <div>
          <h2 className="max-w-md text-4xl leading-tight font-bold">{t("app.tagline")}</h2>
          <ul className="mt-8 space-y-3 text-white/90">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {testTypes.map((tt) => (
            <div key={tt} className="rounded-xl bg-white/10 p-3 text-center backdrop-blur">
              <div className="text-2xl">{testMeta[tt].icon}</div>
              <div className="mt-1 text-xs leading-tight">{testMeta[tt].title[locale]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between">
          <div className="lg:invisible">
            <Logo name={t("app.name")} href="/login" />
          </div>
          <LanguageSwitcher />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight">{t("login.title")}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{t("login.subtitle")}</p>

          <div className="mt-8 space-y-4">
            {googleLoginEnabled ? (
              <form action={signInWithGoogle}>
                <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  <GoogleIcon />
                  {t("login.google")}
                </button>
              </form>
            ) : (
              <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                {t("login.googleNotConfigured")}
              </p>
            )}

            {devLoginEnabled && (
              <>
                <div className="flex items-center gap-3 text-xs text-slate-400 uppercase">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  {t("login.or")}
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                <form action={signInDev} className="card space-y-3 border-dashed p-4">
                  <div>
                    <div className="text-sm font-semibold">🛠️ {t("login.devTitle")}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t("login.devHint")}</p>
                  </div>
                  <input
                    name="name"
                    required
                    maxLength={50}
                    placeholder={t("login.namePlaceholder")}
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700"
                  />
                  <button className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                    {t("login.devButton")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
