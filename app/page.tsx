"use client";
import { useEffect, useState } from "react";
import History, { type Attempt } from "./components/History";
import { CONTRACT_ID, EXPLORER_URL } from "./config";
import { COUNTRIES, DEFAULT_ALLOWED, countryName } from "./countries";
import { useI18n } from "./i18n";
import { submitVerification } from "./lib/contract";
import CopyButton from "./components/CopyButton";
import Countdown from "./components/Countdown";
import { saveVerification } from "./lib/expiry";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600";

function Icon({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  shield: "M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z",
  check: "M5 13l4 4L19 7",
  lock: "M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z",
  x: "M6 6l12 12M18 6L6 18",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5",
};

export default function Home() {
  const { t } = useI18n();
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("254");
  const [minAge, setMinAge] = useState("18");
  const [allowed, setAllowed] = useState<number[]>(DEFAULT_ALLOWED);
  const [result, setResult] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sp-history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("sp-history");
    } catch {}
  };

  const toggleCountry = (code: number) => {
    setAllowed((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    setResult(null);
  };

  const minAgeNum = parseInt(minAge, 10) || 0;
  const policyValid = minAgeNum > 0 && allowed.length > 0;

  const verifyKYC = async () => {
    setLoading(true);
    setResult(null);

    // Simulate ZK proof generation (1.5 seconds)
    await new Promise((r) => setTimeout(r, 1500));

    const ageNum = parseInt(age, 10);
    const countryNum = parseInt(country, 10);

    // Demo check: replace with the real proof + contract call
    const isValid =
      Number.isFinite(ageNum) && ageNum >= minAgeNum && allowed.includes(countryNum);
    setTxHash(null);
    setTxError(null);
    if (isValid) {
      setSigning(true);
      try {
        const r = await submitVerification({
          minAge: minAgeNum,
          allowedCountry: countryNum,
          proofValid: true,
        });
        setTxHash(r.hash);
        saveVerification(r.address);
        window.dispatchEvent(new Event("sp-verified"));
      } catch (e) {
        setTxError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setSigning(false);
      }
    }
    setResult(isValid);
    const entry: Attempt = { t: Date.now(), ok: isValid, minAge: minAgeNum, codes: allowed.join(", ") };
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    try {
      localStorage.setItem("sp-history", JSON.stringify(next));
    } catch {}
    setLoading(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Icon d={ICONS.shield} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">StellarProof</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <h2 className="text-lg font-semibold">{t("verifyTitle")}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("verifySub")}</p>

          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("policy")}
              </p>
              <div>
                <label htmlFor="minAge" className="mb-1.5 block text-sm font-medium">
                  {t("minAge")}
                </label>
                <input
                  id="minAge"
                  type="number"
                  min="1"
                  value={minAge}
                  onChange={(e) => {
                    setMinAge(e.target.value);
                    setResult(null);
                  }}
                  className={inputClass}
                />
              </div>
              <div className="mt-4">
                <p className="mb-1.5 text-sm font-medium">{t("allowedCodes")}</p>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map((c) => {
                    const on = allowed.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleCountry(c.code)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          on
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
                        }`}
                      >
                        {c.name} ({c.code})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="age" className="mb-1.5 flex items-center justify-between text-sm font-medium">
                {t("yourAge")}
                <span className="inline-flex items-center gap-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                  <Icon d={ICONS.lock} className="h-3 w-3" /> {t("private")}
                </span>
              </label>
              <input
                id="age"
                type="number"
                min="0"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setResult(null);
                }}
                placeholder={t("agePh")}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="country" className="mb-1.5 flex items-center justify-between text-sm font-medium">
                {t("yourCountry")}
                <span className="inline-flex items-center gap-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                  <Icon d={ICONS.lock} className="h-3 w-3" /> {t("private")}
                </span>
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setResult(null);
                }}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={String(c.code)}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/50">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("requirements")}
              </p>
              <ul className="space-y-1.5 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Icon d={ICONS.check} className="h-4 w-4 text-indigo-500" />
                  <span>
                    {t("minAgeReq")}{" "}
                    <span className="font-medium text-gray-900 dark:text-white">{minAgeNum || "-"}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon d={ICONS.check} className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <span>
                    {t("allowedReq")}{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {allowed.length
                        ? allowed.map((c) => `${countryName(c)} (${c})`).join(", ")
                        : "-"}
                    </span>
                  </span>
                </li>
              </ul>
              <p className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <Icon d={ICONS.lock} className="h-3.5 w-3.5 shrink-0" />
                {t("neverRevealed")}
              </p>
            </div>

            <button
              onClick={verifyKYC}
              disabled={loading || !age || !policyValid}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? (signing ? t("signing") : t("generating")) : t("verifyBtn")}
            </button>

            <div aria-live="polite">
              {result !== null && (
                <div
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    result
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                      : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                      result ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    <Icon d={result ? ICONS.check : ICONS.x} className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-sm">
                    {result ? (
                      <>
                        <p className="font-semibold">{t("verified")}</p>
                        <p className="mt-0.5 opacity-80">{t("verifiedSub")}</p>
                        {txHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 font-medium underline underline-offset-2"
                          >
                            {t("viewTx")}
                            <Icon d={ICONS.external} className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {txError && (
                          <p className="mt-2 text-xs opacity-90">
                            {t("txFailed")}: {txError}
                          </p>
                        )}
                        <a
                          href={EXPLORER_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-medium underline underline-offset-2"
                        >
                          {t("viewContract")}
                          <Icon d={ICONS.external} className="h-3.5 w-3.5" />
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{t("failed")}</p>
                        <p className="mt-0.5 opacity-80">{t("failedSub")}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Countdown />
        <History attempts={history} onClear={clearHistory} />

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Stellar Testnet
          <span aria-hidden="true">|</span>
          <span className="font-mono" dir="ltr">
            {CONTRACT_ID.slice(0, 6)}...{CONTRACT_ID.slice(-4)}<CopyButton value={CONTRACT_ID} />
          </span>
        </p>
      </div>
    </main>
  );
}