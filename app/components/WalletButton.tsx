"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";
import { useI18n } from "../i18n";
import { isVerifiedOnChain } from "../lib/status";

const short = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

export default function WalletButton() {
  const { t } = useI18n();
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  const loadNetwork = useCallback(async () => {
    try {
      const n = await getNetwork();
      if (!n.error) setNetwork(n.network);
    } catch {}
  }, []);

  const checkStatus = useCallback(async (addr: string) => {
    try {
      setVerified(await isVerifiedOnChain(addr));
    } catch {
      setVerified(null);
    }
  }, []);

  // Reconnect silently if the site was already approved in Freighter
  useEffect(() => {
    (async () => {
      try {
        const c = await isConnected();
        if (!c.isConnected) return;
        const a = await isAllowed();
        if (!a.isAllowed) return;
        const addr = await getAddress();
        if (!addr.error && addr.address) {
          setAddress(addr.address);
          loadNetwork();
          checkStatus(addr.address);
        }
      } catch {}
    })();
  }, [loadNetwork, checkStatus]);

  // Refresh the badge right after a successful on-chain verification
  useEffect(() => {
    if (!address) return;
    const handler = () => checkStatus(address);
    window.addEventListener("sp-verified", handler);
    return () => window.removeEventListener("sp-verified", handler);
  }, [address, checkStatus]);

  async function connect() {
    setBusy(true);
    setError(null);
    try {
      const c = await isConnected();
      if (!c.isConnected) {
        setError("Freighter not found. Install it from freighter.app");
        return;
      }
      const res = await requestAccess();
      if (res.error || !res.address) {
        setError("Connection was declined");
        return;
      }
      setAddress(res.address);
      await loadNetwork();
      checkStatus(res.address);
    } catch {
      setError("Could not reach Freighter");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    setAddress(null);
    setNetwork(null);
    setVerified(null);
  }

  if (!address) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="hidden text-xs text-rose-600 dark:text-rose-400 sm:inline">{error}</span>}
        <button
          onClick={connect}
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {busy ? t("connecting") : t("connect")}
        </button>
      </div>
    );
  }

  const wrongNetwork = network !== null && network !== "TESTNET";

  return (
    <div className="flex items-center gap-2">
      {wrongNetwork && (
        <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          Switch to Testnet
        </span>
      )}
      {verified !== null && (
        <span
          className={`hidden items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase sm:inline-flex ${
            verified
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${verified ? "bg-emerald-500" : "bg-gray-400"}`} />
          {verified ? t("onchainYes") : t("onchainNo")}
        </span>
      )}
      <button
        onClick={disconnect}
        title="Click to disconnect"
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-mono text-xs text-gray-900 transition hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {short(address)}
      </button>
    </div>
  );
}