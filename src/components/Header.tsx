import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { logout } from "@/app/actions";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export async function Header({ user }: { user: { name: string; email: string; image: string | null } }) {
  const t = await getTranslations();
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-6">
          <Logo name={t("app.name")} />
          <nav className="hidden gap-4 text-sm font-medium text-slate-600 sm:flex dark:text-slate-300">
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white">
              {t("nav.dashboard")}
            </Link>
            <Link href="/history" className="hover:text-slate-900 dark:hover:text-white">
              {t("nav.history")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-sm font-semibold dark:bg-slate-700">
              {initial}
            </span>
          )}
          <form action={logout}>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">
              {t("nav.logout")}
            </button>
          </form>
        </div>
      </div>
      <nav className="flex gap-4 border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-600 sm:hidden dark:border-slate-800 dark:text-slate-300">
        <Link href="/dashboard">{t("nav.dashboard")}</Link>
        <Link href="/history">{t("nav.history")}</Link>
      </nav>
    </header>
  );
}
