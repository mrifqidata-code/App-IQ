import { getTranslations } from "next-intl/server";
import { dims, poleLabels, typeProfiles, type PersonalityResult, type Pole } from "@/tests/personality";
import type { Locale } from "@/tests/types";

export async function PersonalityResultView({ result, locale }: { result: PersonalityResult; locale: Locale }) {
  const t = await getTranslations("result.personality");
  const profile = typeProfiles[result.type];
  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 text-center text-white">
          <div className="text-sm font-medium text-white/80">{t("yourType")}</div>
          <div className="mt-2 text-6xl font-extrabold tracking-widest">{result.type}</div>
          {profile && <div className="mt-2 text-xl font-semibold">{profile.nickname[locale]}</div>}
        </div>
        {profile && <p className="p-6 text-center text-slate-600 dark:text-slate-300">{profile.description[locale]}</p>}
      </div>

      <div className="card p-6">
        <h2 className="mb-5 font-semibold">{t("dimensions")}</h2>
        <div className="space-y-5">
          {dims.map((d) => {
            const left = d[0] as Pole;
            const right = d[1] as Pole;
            const pLeft = result.percents[d];
            const pRight = 100 - pLeft;
            const leftWins = pLeft >= 50;
            return (
              <div key={d}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className={leftWins ? "font-semibold text-violet-600 dark:text-violet-300" : "text-slate-500 dark:text-slate-400"}>
                    {left} · {poleLabels[left][locale]} {pLeft}%
                  </span>
                  <span className={!leftWins ? "font-semibold text-violet-600 dark:text-violet-300" : "text-slate-500 dark:text-slate-400"}>
                    {pRight}% {poleLabels[right][locale]} · {right}
                  </span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  {leftWins ? (
                    <div className="absolute inset-y-0 right-1/2 rounded-l-full bg-gradient-to-l from-violet-500 to-fuchsia-500" style={{ width: `${pLeft - 50}%` }} />
                  ) : (
                    <div className="absolute inset-y-0 left-1/2 rounded-r-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${pRight - 50}%` }} />
                  )}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white dark:bg-slate-950" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {profile && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">💪 {t("strengths")}</h2>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {profile.strengths.map((s) => (
                <li key={s.en} className="flex gap-2">
                  <span className="text-violet-500">✓</span>
                  {s[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">💼 {t("careers")}</h2>
            <p className="text-slate-600 dark:text-slate-300">{profile.careers[locale]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
