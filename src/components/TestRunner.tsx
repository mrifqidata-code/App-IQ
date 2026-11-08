"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { submitTest } from "@/app/actions";
import type { Answer, Answers, ClientQuestion, DiscAnswer, TestType } from "@/tests/types";

type Props = {
  type: TestType;
  title: string;
  icon: string;
  questions: ClientQuestion[];
  timeLimit?: number;
  theme: { gradient: string; button: string; text: string; soft: string; ring: string };
};

function isAnswered(q: ClientQuestion, a: Answer | undefined) {
  if (a === undefined) return false;
  if (q.kind === "disc") {
    const d = a as Partial<DiscAnswer>;
    return Boolean(d.most && d.least);
  }
  return true;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TestRunner({ type, title, icon, questions, timeLimit, theme }: Props) {
  const t = useTranslations("test");
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [timeUp, setTimeUp] = useState(false);
  const startedAt = useRef<number>(0);
  const [remaining, setRemaining] = useState(timeLimit ?? 0);
  const submittedRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = questions.length;
  const q = questions[index];
  const answeredCount = questions.filter((qq) => isAnswered(qq, answers[qq.id])).length;

  const doSubmit = useCallback(
    (final: Answers) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setError(null);
      startSubmit(async () => {
        const res = await submitTest(type, final, Date.now() - startedAt.current);
        if (res.ok) {
          router.push(`/result/${res.id}`);
        } else {
          submittedRef.current = false;
          if (res.error === "unauthorized") router.push("/login");
          else setError(t("error"));
        }
      });
    },
    [router, t, type],
  );

  // Timer (khusus tes berwaktu)
  const answersRef = useRef(answers);
  answersRef.current = answers;
  useEffect(() => {
    if (!started || !timeLimit) return;
    const deadline = startedAt.current + timeLimit * 1000;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setTimeUp(true);
        doSubmit(answersRef.current as Answers);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [started, timeLimit, doSubmit]);

  // Peringatan saat menutup tab di tengah tes
  useEffect(() => {
    if (!started) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (!submittedRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [started]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const go = useCallback(
    (i: number) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setIndex(Math.max(0, Math.min(total - 1, i)));
    },
    [total],
  );

  const setAnswer = useCallback(
    (value: Answer, autoAdvance: boolean) => {
      setAnswers((prev) => ({ ...prev, [q.id]: value }));
      if (autoAdvance && index < total - 1) {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => setIndex((i) => Math.min(total - 1, i + 1)), 280);
      }
    },
    [q, index, total],
  );

  // Pintasan keyboard: 1-5 untuk skala, A-D untuk pilihan ganda, panah untuk navigasi
  useEffect(() => {
    if (!started || submitting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (q.kind === "likert" && /^[1-5]$/.test(e.key)) setAnswer(Number(e.key), true);
      else if (q.kind === "choice") {
        const i = "abcdefgh".indexOf(e.key.toLowerCase());
        if (i >= 0 && i < q.options.length) setAnswer(i, true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, submitting, q, index, go, setAnswer]);

  const handleSubmit = () => {
    const missing = total - answeredCount;
    if (missing > 0) {
      if (!timeLimit) {
        setError(t("mustAnswerAll", { count: missing }));
        const firstMissing = questions.findIndex((qq) => !isAnswered(qq, answers[qq.id]));
        if (firstMissing >= 0) go(firstMissing);
        return;
      }
      if (!window.confirm(t("confirmUnanswered", { count: missing }))) return;
    }
    doSubmit(answers as Answers);
  };

  const quit = () => {
    if (answeredCount === 0 || window.confirm(t("quitConfirm"))) {
      submittedRef.current = true; // matikan peringatan beforeunload
      router.push("/dashboard");
    }
  };

  // ---------- Layar intro ----------
  if (!started) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card overflow-hidden">
          <div className={`bg-gradient-to-br ${theme.gradient} p-8 text-center text-white`}>
            <div className="text-5xl">{icon}</div>
            <h1 className="mt-3 text-2xl font-bold">{title}</h1>
          </div>
          <div className="space-y-4 p-6 text-slate-600 dark:text-slate-300">
            {timeLimit ? (
              <p>{t("intro.iq", { minutes: Math.round(timeLimit / 60), count: total })}</p>
            ) : (
              <p>{t("intro.honest")}</p>
            )}
            <p>{t("intro.navigate")}</p>
            <button
              onClick={() => {
                startedAt.current = Date.now();
                setStarted(true);
              }}
              className={`w-full rounded-xl ${theme.button} px-4 py-3 font-semibold text-white transition`}
            >
              {t("intro.start")} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((index + 1) / total) * 100;
  const lowTime = timeLimit && remaining <= 60;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Bar atas */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <button onClick={quit} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
          ✕ {t("quit")}
        </button>
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {t("progress", { current: index + 1, total })}
        </span>
        {timeLimit ? (
          <span
            className={`rounded-full px-3 py-1 font-mono font-semibold tabular-nums ${
              lowTime ? "animate-pulse bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : `${theme.soft} ${theme.text}`
            }`}
            aria-label={t("timeLeft")}
          >
            ⏱ {formatTime(remaining)}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">{t("answered", { count: answeredCount })}</span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-300`} style={{ width: `${progress}%` }} />
      </div>

      {/* Soal */}
      <div className="card p-6 sm:p-8" key={q.id}>
        {q.kind === "choice" && <ChoiceView q={q} value={answers[q.id] as number | undefined} onChange={(v) => setAnswer(v, true)} theme={theme} />}
        {q.kind === "likert" && (
          <LikertView prompt={q.prompt} hint={t("likertHint")} labels={t.raw("likert") as string[]} value={answers[q.id] as number | undefined} onChange={(v) => setAnswer(v, true)} theme={theme} />
        )}
        {q.kind === "disc" && (
          <DiscView
            q={q}
            value={(answers[q.id] as Partial<DiscAnswer> | undefined) ?? {}}
            instruction={t("discInstruction")}
            mostLabel={t("most")}
            leastLabel={t("least")}
            onChange={(v) => setAnswer(v as DiscAnswer, Boolean(v.most && v.least))}
          />
        )}
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
      {timeUp && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">{t("timeUp")}</p>}

      {/* Navigasi */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0 || submitting}
          className="rounded-xl px-4 py-2.5 font-medium text-slate-600 ring-1 ring-slate-300 transition hover:bg-white disabled:opacity-40 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-900"
        >
          ← {t("prev")}
        </button>
        {index < total - 1 ? (
          <button
            onClick={() => go(index + 1)}
            disabled={submitting}
            className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {t("next")} →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`rounded-xl ${theme.button} px-5 py-2.5 font-semibold text-white transition disabled:opacity-60`}
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        )}
      </div>

      {/* Peta soal */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
        {questions.map((qq, i) => {
          const done = isAnswered(qq, answers[qq.id]);
          return (
            <button
              key={qq.id}
              onClick={() => go(i)}
              aria-label={`${i + 1}`}
              className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                i === index
                  ? `ring-2 ${theme.ring} ring-offset-1 dark:ring-offset-slate-950`
                  : ""
              } ${done ? `bg-gradient-to-br ${theme.gradient} text-white` : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Theme = Props["theme"];

function ChoiceView({
  q,
  value,
  onChange,
  theme,
}: {
  q: Extract<ClientQuestion, { kind: "choice" }>;
  value: number | undefined;
  onChange: (v: number) => void;
  theme: Theme;
}) {
  return (
    <div>
      <span className={`inline-block rounded-full ${theme.soft} ${theme.text} px-2.5 py-0.5 text-xs font-semibold`}>{q.category}</span>
      <h2 className="mt-3 text-lg font-semibold sm:text-xl">{q.prompt}</h2>
      {q.display && (
        <div className="mt-5 rounded-xl bg-slate-100 px-4 py-6 text-center font-mono text-2xl font-semibold tracking-wider break-words sm:text-3xl dark:bg-slate-800">
          {q.display}
        </div>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const selected = value === i;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                selected
                  ? `border-transparent bg-gradient-to-br ${theme.gradient} text-white shadow-md`
                  : "border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                  selected ? "bg-white/25" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}
              >
                {"ABCDEFGH"[i]}
              </span>
              <span className="text-lg font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LikertView({
  prompt,
  hint,
  labels,
  value,
  onChange,
  theme,
}: {
  prompt: string;
  hint: string;
  labels: string[];
  value: number | undefined;
  onChange: (v: number) => void;
  theme: Theme;
}) {
  const sizes = ["h-12 w-12", "h-10 w-10", "h-8 w-8", "h-10 w-10", "h-12 w-12"];
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      <h2 className="mt-2 text-xl leading-snug font-semibold sm:text-2xl">{prompt}</h2>
      <div className="mt-8 flex items-start justify-between gap-1 sm:gap-3">
        {labels.map((label, i) => {
          const v = i + 1;
          const selected = value === v;
          return (
            <button key={v} onClick={() => onChange(v)} className="group flex flex-1 flex-col items-center gap-2" aria-pressed={selected}>
              <span className="grid h-12 place-items-center">
                <span
                  className={`${sizes[i]} rounded-full border-2 transition ${
                    selected
                      ? `border-transparent bg-gradient-to-br ${theme.gradient} shadow-md`
                      : "border-slate-300 group-hover:border-slate-500 dark:border-slate-600"
                  }`}
                />
              </span>
              <span className={`text-center text-[11px] leading-tight sm:text-xs ${selected ? `font-semibold ${theme.text}` : "text-slate-500 dark:text-slate-400"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiscView({
  q,
  value,
  instruction,
  mostLabel,
  leastLabel,
  onChange,
}: {
  q: Extract<ClientQuestion, { kind: "disc" }>;
  value: Partial<DiscAnswer>;
  instruction: string;
  mostLabel: string;
  leastLabel: string;
  onChange: (v: Partial<DiscAnswer>) => void;
}) {
  const pick = (field: "most" | "least", key: string) => {
    const other = field === "most" ? "least" : "most";
    const next = { ...value, [field]: key };
    if (next[other] === key) delete next[other];
    onChange(next);
  };
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{instruction}</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2">
        <span />
        <span className="w-20 text-center text-xs font-semibold text-emerald-600 uppercase dark:text-emerald-400">{mostLabel}</span>
        <span className="w-20 text-center text-xs font-semibold text-red-500 uppercase dark:text-red-400">{leastLabel}</span>
        {q.options.map((o) => {
          const isMost = value.most === o.key;
          const isLeast = value.least === o.key;
          return (
            <div key={o.key} className="contents">
              <span
                className={`rounded-xl border-2 px-4 py-3 text-lg font-medium transition ${
                  isMost
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                    : isLeast
                      ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                      : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {o.label}
              </span>
              <button
                onClick={() => pick("most", o.key)}
                aria-pressed={isMost}
                aria-label={`${mostLabel}: ${o.label}`}
                className={`mx-auto grid h-11 w-11 place-items-center rounded-full border-2 text-lg transition ${
                  isMost ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-emerald-400 dark:border-slate-600"
                }`}
              >
                ＋
              </button>
              <button
                onClick={() => pick("least", o.key)}
                aria-pressed={isLeast}
                aria-label={`${leastLabel}: ${o.label}`}
                className={`mx-auto grid h-11 w-11 place-items-center rounded-full border-2 text-lg transition ${
                  isLeast ? "border-red-500 bg-red-500 text-white" : "border-slate-300 text-transparent hover:border-red-400 dark:border-slate-600"
                }`}
              >
                －
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
