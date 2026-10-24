"use client";

import { useEffect, useState } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";

const short = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadNetwork() {
    try {
      const n = await getNetwork();
      if (!n.error) setNetwork(n.network);
    } catch {}
  }

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
        }
      } catch {}
    })();
  }, []);

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
    } catch {
      setError("Could not reach Freighter");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    setAddress(null);
    setNetwork(null);
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
          {busy ? "Connecting..." : "Connect wallet"}
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
