import { getTranslations } from "next-intl/server";
import { iqBandDescriptions, iqBandLabels, iqCategoryLabels, type IqCategory, type IqResult } from "@/tests/iq";
import type { Locale } from "@/tests/types";

export async function IqResultView({ result, locale }: { result: IqResult; locale: Locale }) {
  const t = await getTranslations("result.iq");
  // Posisi skor pada skala 55-145 untuk indikator
  const pos = ((result.iq - 55) / 90) * 100;
  return (
    <div className="space-y-6">
      <div className="card p-6 text-center sm:p-8">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("score")}</div>
        <div className="mt-2 bg-gradient-to-br from-indigo-500 to-blue-500 bg-clip-text text-7xl font-extrabold text-transparent">{result.iq}</div>
        <div className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {iqBandLabels[result.band][locale]}
        </div>
        <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-slate-300">{iqBandDescriptions[result.band][locale]}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("correct", { correct: result.correct, total: result.total })}</p>

        <div className="mx-auto mt-8 max-w-lg">
          <div className="relative h-3 rounded-full bg-gradient-to-r from-slate-300 via-indigo-300 to-indigo-600 dark:from-slate-700 dark:via-indigo-800 dark:to-indigo-400">
            <div
              className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-indigo-600 shadow dark:border-slate-900"
              style={{ left: `${pos}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>55</span>
            <span>70</span>
            <span>85</span>
            <span>100</span>
            <span>115</span>
            <span>130</span>
            <span>145</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold">{t("byCategory")}</h2>
        <div className="space-y-4">
          {(Object.keys(result.categories) as IqCategory[]).map((c) => {
            const { correct, total } = result.categories[c];
            const pct = total ? Math.round((correct / total) * 100) : 0;
            return (
              <div key={c}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{iqCategoryLabels[c][locale]}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {correct}/{total} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">{t("note")}</p>
      </div>
    </div>
  );
}
