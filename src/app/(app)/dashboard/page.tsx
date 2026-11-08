import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getClientQuestions, testMeta } from "@/tests";
import { testTypes } from "@/tests/types";
import { requireUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { formatDate, getUserResults, summarize } from "@/lib/results";
import { testTheme } from "@/lib/theme";

export async function generateMetadata() {
  const t = await getTranslations("nav");
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const user = await requireUser();
  const locale = await getLocale();
  const t = await getTranslations();
  const results = await getUserResults(user.id);
  const recent = results.slice(0, 5);
  const firstName = (user.name || user.email).split(" ")[0];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.greeting", { name: firstName })}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {testTypes.map((type) => {
          const meta = testMeta[type];
          const theme = testTheme[type];
          const last = results.find((r) => r.testType === type);
          const count = getClientQuestions(type, locale).length;
          return (
            <div key={type} className="card flex flex-col overflow-hidden">
              <div className={`bg-gradient-to-br ${theme.gradient} p-5 text-white`}>
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{meta.icon}</span>
                  {meta.timeLimit && (
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">⏱ {t("dashboard.timed")}</span>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-bold">{meta.title[locale]}</h2>
                <p className="mt-1 text-sm text-white/85">{meta.description[locale]}</p>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>📝 {t("dashboard.questions", { count })}</span>
                  <span>⏳ {t("dashboard.minutes", { count: meta.minutes })}</span>
                </div>
                {last && (
                  <Link href={`/result/${last.id}`} className={`rounded-xl ${theme.soft} p-3 text-sm hover:opacity-80`}>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.lastResult")}</div>
                    <div className={`font-semibold ${theme.text}`}>{summarize(last, locale)}</div>
                  </Link>
                )}
                <Link
                  href={`/test/${type}`}
                  className={`mt-auto rounded-xl ${theme.button} px-4 py-2.5 text-center font-semibold text-white transition`}
                >
                  {last ? t("dashboard.retake") : t("dashboard.start")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("dashboard.recent")}</h2>
          {results.length > 0 && (
            <Link href="/history" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              {t("dashboard.viewAll")} →
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="card p-6 text-center text-slate-500 dark:text-slate-400">{t("dashboard.noResults")}</p>
        ) : (
          <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/result/${r.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-2xl">{testMeta[r.testType].icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{summarize(r, locale)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {testMeta[r.testType].title[locale]} · {formatDate(r.createdAt, locale)}
                    </div>
                  </div>
                  <span className="text-slate-400">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
