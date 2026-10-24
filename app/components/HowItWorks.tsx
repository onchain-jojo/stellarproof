"use client";
import { useI18n, type Key } from "../i18n";

const steps: { n: string; title: Key; body: Key; d: string }[] = [
  {
    n: "1",
    title: "s1t",
    body: "s1b",
    d: "M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z",
  },
  {
    n: "2",
    title: "s2t",
    body: "s2b",
    d: "M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z",
  },
  {
    n: "3",
    title: "s3t",
    body: "s3b",
    d: "M5 13l4 4L19 7",
  },
];

export default function HowItWorks() {
  const { t } = useI18n();
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <h2 className="text-center text-lg font-semibold tracking-tight">{t("hiwTitle")}</h2>
      <p className="mx-auto mt-1 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
        {t("hiwSub")}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d={s.d} />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("step")} {s.n}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{t(s.title)}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t(s.body)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}