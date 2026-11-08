import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { testMeta } from "@/tests";
import { isTestType, testTypes } from "@/tests/types";
import { requireUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { formatDate, getUserResults, summarize } from "@/lib/results";
import { testTheme } from "@/lib/theme";

export async function generateMetadata() {
  const t = await getTranslations("history");
  return { title: t("title") };
}

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const user = await requireUser();
  const locale = await getLocale();
  const t = await getTranslations("history");
  const { type } = await searchParams;
  const filter = type && isTestType(type) ? type : undefined;
  const results = await getUserResults(user.id, { type: filter });

  const tab = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/history" className={tab(!filter)}>
          {t("all")}
        </Link>
        {testTypes.map((tt) => (
          <Link key={tt} href={`/history?type=${tt}`} className={tab(filter === tt)}>
            {testMeta[tt].icon} {testMeta[tt].title[locale]}
          </Link>
        ))}
      </div>
      {results.length === 0 ? (
        <p className="card p-8 text-center text-slate-500 dark:text-slate-400">{t("empty")}</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">{t("test")}</th>
                <th className="px-4 py-3 font-medium">{t("result")}</th>
                <th className="px-4 py-3 font-medium">{t("date")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {testMeta[r.testType].icon} {testMeta[r.testType].title[locale]}
                  </td>
                  <td className={`px-4 py-3 font-semibold ${testTheme[r.testType].text}`}>{summarize(r, locale)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{formatDate(r.createdAt, locale)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/result/${r.id}`} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                      {t("view")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
