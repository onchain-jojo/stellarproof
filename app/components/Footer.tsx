import { REPO_URL } from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <p>StellarProof | Privacy-preserving KYC on Stellar | Testnet demo</p>
      <p className="mt-1">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          Source on GitHub
        </a>
      </p>
    </footer>
  );
}
