import ThemeToggle from "./ThemeToggle";
import WalletButton from "./WalletButton";
import { EXPLORER_URL, REPO_URL } from "../config";

const linkClass =
  "text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight">StellarProof</span>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Testnet
          </span>
        </div>
        <nav className="flex items-center gap-5">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            GitHub
          </a>
          <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Contract
          </a>
          <WalletButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

