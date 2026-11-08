"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/app/actions";
import type { Locale } from "@/tests/types";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [pending, start] = useTransition();
  const options: { value: Locale; label: string }[] = [
    { value: "id", label: "ID" },
    { value: "en", label: "EN" },
  ];
  return (
    <div
      className={`inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900 ${pending ? "opacity-60" : ""}`}
      role="group"
      aria-label="Language"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={pending}
          aria-pressed={locale === o.value}
          onClick={() => start(() => setLocale(o.value))}
          className={`rounded-full px-3 py-1 transition ${
            locale === o.value
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
