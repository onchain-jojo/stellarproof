"use client";
import { REPO_URL } from "../config";
import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <p>StellarProof | {t("footer")}</p>
      <p className="mt-1">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {t("source")}
        </a>
      </p>
    </footer>
  );
}