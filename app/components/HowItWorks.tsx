const steps = [
  {
    n: "1",
    title: "Enter private inputs",
    body: "Your age and country code stay in your browser. They are never sent anywhere.",
    d: "M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z",
  },
  {
    n: "2",
    title: "Generate a ZK proof",
    body: "A zero-knowledge proof shows you meet the rules without revealing the values behind them.",
    d: "M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z",
  },
  {
    n: "3",
    title: "Verify on Stellar",
    body: "A Soroban smart contract checks the proof on-chain. Only pass or fail is public.",
    d: "M5 13l4 4L19 7",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <h2 className="text-center text-lg font-semibold tracking-tight">How it works</h2>
      <p className="mx-auto mt-1 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
        Prove a fact about yourself without handing over the data.
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
                Step {s.n}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
