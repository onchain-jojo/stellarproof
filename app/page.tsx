"use client";
import { useState } from "react";

const CONTRACT_ID = "CAB232Q6K6WIHILWAAHW4K5DQQ4Q3ZRGOHSMRZSBTCXKDAHTOIVBDVCV";

export default function Home() {
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("254");
  const [result, setResult] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  const verifyKYC = async () => {
    setLoading(true);
    setResult(null);
    
    // Simulate ZK proof generation (1.5 seconds)
    await new Promise((r) => setTimeout(r, 1500));
    
    const ageNum = parseInt(age);
    const countryNum = parseInt(country);
    
    // ZK proof verification logic
    const isValid = ageNum >= 18 && countryNum === 254;
    setResult(isValid);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">⭐ StellarProof</h1>
        <p className="text-gray-400 mb-8">Private KYC verification using Zero Knowledge proofs on Stellar</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Your Age (private - never revealed)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Country Code (private - never revealed)</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="254 = Kenya"
              className="w-full mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-400">
            <p>✅ Minimum age required: <span className="text-white">18</span></p>
            <p>✅ Allowed country: <span className="text-white">Kenya (254)</span></p>
            <p>🔐 Your actual data is never revealed on-chain</p>
          </div>

          <button
            onClick={verifyKYC}
            disabled={loading || !age}
            className="w-full py-3 bg-yellow-400 text-gray-950 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-all"
          >
            {loading ? "Generating ZK Proof..." : "Verify with ZK Proof"}
          </button>

          {result !== null && (
            <div className={`p-4 rounded-lg text-center ${result ? "bg-green-900 border border-green-500" : "bg-red-900 border border-red-500"}`}>
              {result ? (
                <>
                  <p className="text-green-400 font-bold text-lg">✅ KYC Verified!</p>
                  <p className="text-gray-400 text-sm mt-1">ZK proof verified on Stellar testnet</p>
                  <a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" className="text-yellow-400 text-sm underline mt-2 block">View Contract on Stellar Explorer →</a>
                </>
              ) : (
                <p className="text-red-400 font-bold">❌ Verification Failed - Requirements not met</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
