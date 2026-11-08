import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DiscResultView } from "@/components/results/DiscResultView";
import { EqResultView } from "@/components/results/EqResultView";
import { IqResultView } from "@/components/results/IqResultView";
import { PersonalityResultView } from "@/components/results/PersonalityResultView";
import { testMeta, type ResultByType } from "@/tests";
import { requireUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { formatDate, getUserResult } from "@/lib/results";
import { testTheme } from "@/lib/theme";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const r = await getUserResult(user.id, id);
  if (!r) notFound();
  const locale = await getLocale();
  const t = await getTranslations("result");
  const meta = testMeta[r.testType];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className={`text-sm font-semibold ${testTheme[r.testType].text}`}>
            {meta.icon} {meta.title[locale]}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{t("takenAt", { date: formatDate(r.createdAt, locale) })}</div>
        </div>
      </div>

      {r.testType === "iq" && <IqResultView result={r.result as ResultByType["iq"]} locale={locale} />}
      {r.testType === "personality" && <PersonalityResultView result={r.result as ResultByType["personality"]} locale={locale} />}
      {r.testType === "eq" && <EqResultView result={r.result as ResultByType["eq"]} locale={locale} />}
      {r.testType === "disc" && <DiscResultView result={r.result as ResultByType["disc"]} locale={locale} />}

      <p className="rounded-xl border border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">ℹ️ {t("disclaimer")}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/test/${r.testType}`}
          className={`flex-1 rounded-xl ${testTheme[r.testType].button} px-4 py-3 text-center font-semibold text-white transition`}
        >
          ↻ {t("retake")}
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 rounded-xl px-4 py-3 text-center font-semibold ring-1 ring-slate-300 transition hover:bg-white dark:ring-slate-700 dark:hover:bg-slate-900"
        >
          {t("backDashboard")}
        </Link>
      </div>
    </div>
  );
}
