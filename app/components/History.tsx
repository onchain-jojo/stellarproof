"use client";
import { useI18n } from "../i18n";

export type Attempt = { t: number; ok: boolean; minAge: number; codes: string };

export default function History({
  attempts,
  onClear,
}: {
  attempts: Attempt[];
  onClear: () => void;
}) {
  const { t } = useI18n();
  if (attempts.length === 0) return null;
  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{t("recent")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("recentSub")}</p>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-medium text-gray-500 underline underline-offset-2 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {t("clear")}
        </button>
      </div>
      <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
        {attempts.map((a) => (
          <li key={a.t} className="flex items-center justify-between gap-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${a.ok ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className="font-medium">{a.ok ? t("ok") : t("fail")}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {a.minAge}+ | {a.codes}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(a.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}