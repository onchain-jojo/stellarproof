"use client";
import { useEffect, useState } from "react";
import { isAllowed, getAddress } from "@stellar/freighter-api";
import { useI18n } from "../i18n";
import { getVerifiedAt, VALIDITY_DAYS, WARN_DAYS } from "../lib/expiry";

const DAY = 86400000;

export default function Countdown() {
  const { t } = useI18n();
  const [address, setAddress] = useState<string | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  async function load() {
    try {
      const a = await isAllowed();
      if (!a.isAllowed) return;
      const r = await getAddress();
      if (r.error || !r.address) return;
      setAddress(r.address);
      setVerifiedAt(getVerifiedAt(r.address));
    } catch {}
  }

  useEffect(() => {
    load();
    const onVerified = () => load();
    window.addEventListener("sp-verified", onVerified);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.removeEventListener("sp-verified", onVerified);
      clearInterval(tick);
    };
  }, []);

  if (!address || !verifiedAt) return null;

  const remaining = verifiedAt + VALIDITY_DAYS * DAY - now;
  const expired = remaining <= 0;
  const warn = !expired && remaining < WARN_DAYS * DAY;

  const d = Math.floor(remaining / DAY);
  const h = Math.floor((remaining % DAY) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  const tone = expired
    ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
    : warn
      ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
      : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white";

  return (
    <section className={`mt-6 rounded-2xl border p-5 shadow-sm ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {expired ? t("expired") : warn ? t("expiringSoon") : t("expiresIn")}
      </p>
      {!expired && (
        <p className="mt-1 font-mono text-2xl font-semibold" dir="ltr">
          {d}d {String(h).padStart(2, "0")}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
        </p>
      )}
      {expired && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          {t("renew")}
        </button>
      )}
      <p className="mt-2 text-xs opacity-70">{t("expiryNote")}</p>
    </section>
  );
}