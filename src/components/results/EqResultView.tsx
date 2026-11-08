import { getTranslations } from "next-intl/server";
import { RadarScoreChart } from "@/components/Charts";
import { eqAspectInfo, eqAspects, eqLevel, eqLevelDescriptions, eqLevelLabels, type EqResult } from "@/tests/eq";
import type { Locale } from "@/tests/types";

const levelColor = {
  high: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export async function EqResultView({ result, locale }: { result: EqResult; locale: Locale }) {
  const t = await getTranslations("result.eq");
  const sorted = [...eqAspects].sort((a, b) => result.aspects[a] - result.aspects[b]);
  const focus = sorted.slice(0, 2);
  return (
    <div className="space-y-6">
      <div className="card p-6 text-center sm:p-8">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("overall")}</div>
        <div className="mt-2 bg-gradient-to-br from-rose-500 to-pink-500 bg-clip-text text-7xl font-extrabold text-transparent">
          {result.overall}
          <span className="text-3xl">/100</span>
        </div>
        <div className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${levelColor[result.level]}`}>
          {eqLevelLabels[result.level][locale]}
        </div>
        <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-slate-300">{eqLevelDescriptions[result.level][locale]}</p>
      </div>

      <div className="card p-6">
        <h2 className="mb-2 font-semibold">{t("aspects")}</h2>
        <RadarScoreChart color="#f43f5e" data={eqAspects.map((a) => ({ label: eqAspectInfo[a].label[locale], value: result.aspects[a] }))} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {eqAspects.map((a) => {
            const lvl = eqLevel(result.aspects[a]);
            return (
              <div key={a} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{eqAspectInfo[a].label[locale]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelColor[lvl]}`}>{result.aspects[a]}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{eqAspectInfo[a].description[locale]}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-3 font-semibold">🌱 {t("tips")}</h2>
        <div className="space-y-3">
          {focus.map((a) => (
            <div key={a} className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
              <div className="text-xs font-semibold text-rose-600 uppercase dark:text-rose-300">
                {t("focus")}: {eqAspectInfo[a].label[locale]}
              </div>
              <p className="mt-1 text-slate-700 dark:text-slate-200">{eqAspectInfo[a].tip[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
