import { getTranslations } from "next-intl/server";
import { DiscBarChart } from "@/components/Charts";
import { discKeys, discProfiles, type DiscResult } from "@/tests/disc";
import type { Locale } from "@/tests/types";

const badge: Record<string, string> = {
  D: "from-red-500 to-rose-500",
  I: "from-amber-400 to-orange-500",
  S: "from-emerald-500 to-teal-500",
  C: "from-blue-500 to-indigo-500",
};

export async function DiscResultView({ result, locale }: { result: DiscResult; locale: Locale }) {
  const t = await getTranslations("result.disc");
  const p = discProfiles[result.primary];
  const s = discProfiles[result.secondary];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="card flex items-center gap-5 p-6">
          <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${badge[result.primary]} text-4xl font-extrabold text-white`}>
            {result.primary}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t("primary")}</div>
            <div className="text-xl font-bold">{p.name[locale]}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{p.tagline[locale]}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${badge[result.secondary]} text-xl font-bold text-white`}>
            {result.secondary}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t("secondary")}</div>
            <div className="font-semibold">{s.name[locale]}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-3 font-semibold">{t("profile")}</h2>
        <DiscBarChart data={discKeys.map((k) => ({ key: k, label: discProfiles[k].name[locale], value: result.intensity[k] }))} />
        <p className="mt-4 text-slate-600 dark:text-slate-300">{p.description[locale]}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-3 font-semibold">💪 {t("strengths")}</h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            {p.strengths.map((x) => (
              <li key={x.en} className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                {x[locale]}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="mb-3 font-semibold">⚠️ {t("challenges")}</h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            {p.challenges.map((x) => (
              <li key={x.en} className="flex gap-2">
                <span className="text-amber-500">•</span>
                {x[locale]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card bg-amber-50 p-6 dark:bg-amber-950/30">
        <h2 className="mb-2 font-semibold">💡 {t("workTips")}</h2>
        <p className="text-slate-700 dark:text-slate-200">{p.workTips[locale]}</p>
      </div>
    </div>
  );
}
