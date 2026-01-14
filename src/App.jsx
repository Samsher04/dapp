import React, { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [step, setStep] = useState(1);
  const [wallet, setWallet] = useState(null);
  const [scamLog, setScamLog] = useState([]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    const balance = await provider.getBalance(address);

    setWallet({
      address,
      shortAddr: address.slice(0, 6) + "..." + address.slice(-4),
      balance: ethers.utils.formatEther(balance),
      provider,
    });

    setScamLog((p) => [...p, `✅ Wallet Connected: ${address.slice(0, 10)}...`]);
    setStep(2);
  };

  const simulateScam = async () => {
    const logs = [];
    logs.push(`🔍 Address detected: ${wallet.shortAddr}`);
    setScamLog([...logs]);
    await sleep(800);

    logs.push(`💰 Balance scanned: ${wallet.balance} ETH`);
    setScamLog([...logs]);
    await sleep(800);

    logs.push(`⚡ Fake approval request generated`);
    logs.push(`📝 approve(scammer, UNLIMITED)`);
    logs.push(`🚨 Wallet drained`);
    setScamLog([...logs]);

    setStep(3);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const resetDemo = () => {
    setStep(1);
    setWallet(null);
    setScamLog([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          🔐 Crypto Scam Awareness Demo
        </h1>
        <p className="text-center text-zinc-400 mb-6">
          Educational demo — no real funds are transferred
        </p>

        {/* Steps */}
        <div className="flex justify-between mb-8 text-sm">
          {["Connect", "Analyze", "Scam"].map((s, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-2 rounded-lg mx-1 ${
                step === i + 1 ? "bg-blue-600" : "bg-zinc-800"
              }`}
            >
              Step {i + 1}: {s}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="text-center space-y-4">
            <p className="text-zinc-300">
              Connect your wallet to see what information scammers can access.
            </p>

            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition"
            >
              Connect MetaMask
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && wallet && (
          <div className="space-y-6">
            <div className="bg-black rounded-xl p-4 border border-zinc-800">
              <p>
                <span className="text-zinc-400">Address:</span>{" "}
                {wallet.shortAddr}
              </p>
              <p>
                <span className="text-zinc-400">Balance:</span>{" "}
                {wallet.balance} ETH
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-900/30 p-3 rounded-lg">✅ Address</div>
              <div className="bg-green-900/30 p-3 rounded-lg">✅ Balance</div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                ✅ Tx History
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                ❌ Private Key
              </div>
            </div>

            <button
              onClick={simulateScam}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition"
            >
              Simulate Scam
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-black rounded-xl p-4 border border-red-800 font-mono text-sm max-h-60 overflow-y-auto">
              {scamLog.map((l, i) => (
                <div key={i} className="py-1">
                  {l}
                </div>
              ))}
            </div>

            <div className="bg-red-900/30 rounded-xl p-4">
              <p>💸 Funds Lost: {wallet?.balance} ETH</p>
              <p>⏱ Time: seconds</p>
              <p>❌ Recovery: Impossible</p>
            </div>

            <button
              onClick={resetDemo}
              className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl transition"
            >
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
