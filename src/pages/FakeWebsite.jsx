import React, { useState, useEffect } from 'react'
import { Globe, AlertTriangle, Shield, Lock, ExternalLink, Check, X, Wallet } from 'lucide-react'
import Web3Service from '../utils/web3'

export default function FakeWebsite() {
  const [step, setStep] = useState(1)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [transactionPending, setTransactionPending] = useState(false)
  const [showScamReveal, setShowScamReveal] = useState(false)
  const [showRealTransaction, setShowRealTransaction] = useState(false)
  const [transactionResult, setTransactionResult] = useState(null)

  // Check if wallet is already connected
  useEffect(() => {
    if (Web3Service.isConnected) {
      setWalletConnected(true)
      setWalletAddress(Web3Service.address)
      updateBalance()
    }
  }, [])

  const updateBalance = async () => {
    if (Web3Service.isConnected) {
      const bal = await Web3Service.getBalance()
      setBalance(parseFloat(bal).toFixed(4))
    }
  }

  const connectWallet = async () => {
    const result = await Web3Service.connectWallet()
    if (result.success) {
      setWalletConnected(true)
      setWalletAddress(result.address)
      await updateBalance()
      setStep(2)
    } else {
      alert(`Connection failed: ${result.error}`)
    }
  }

  const simulateMaliciousTransaction = async () => {
    setTransactionPending(true)
    
    // Delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // This is a DEMO - shows what real scam would do
      const result = await Web3Service.simulateMaliciousApproval()
      
      setTransactionResult(result)
      setShowRealTransaction(true)
      setTransactionPending(false)
      setStep(3)
    } catch (error) {
      setTransactionResult({
        success: false,
        error: error.message
      })
      setTransactionPending(false)
    }
  }

  const redFlags = [
    'URL uses free hosting (netlify.app, vercel.app)',
    'Urgent security alerts with time pressure',
    'Poor English and spelling mistakes',
    'Asks to connect wallet unnecessarily',
    'Shows "0 USDT Max" but asks for approval',
    'No official domain or SSL certificate'
  ]

  const scamSteps = [
    {
      step: 1,
      title: 'Create Urgency',
      description: 'Fake security alert about your wallet being compromised',
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Request Connection',
      description: 'Ask to connect wallet to "verify" or "secure" funds',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Show Fake Interface',
      description: 'Display legitimate-looking interface with your real balance',
      icon: <Globe className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Malicious Approval',
      description: 'Make you sign unlimited token approval transaction',
      icon: <Lock className="w-6 h-6" />
    },
    {
      step: 5,
      title: 'Drain Funds',
      description: 'Immediately transfer all your tokens after approval',
      icon: <Shield className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Browser Window Simulation */}
        <div className="browser-window max-w-4xl mx-auto">
          {/* Browser Bar */}
          <div className="browser-bar">
            <div className="flex items-center space-x-2">
              <div className="browser-dot bg-red-500"></div>
              <div className="browser-dot bg-yellow-500"></div>
              <div className="browser-dot bg-green-500"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-900 text-gray-300 px-4 py-2 rounded text-sm font-mono">
                https://<span className="text-red-400">usdt-secure</span>-bsc.netlify.app
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              ⚠️ Fake Website
            </div>
          </div>

          {/* Fake Website Content */}
          <div className="bg-white p-8">
            {/* Step 1: Security Alert */}
            {step === 1 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
                  <AlertTriangle size={48} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  ⚠️ URGENT SECURITY ALERT
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  We've detected suspicious activity on your wallet address.
                  Immediate action required to secure your funds.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="font-bold text-red-700 mb-4 text-lg">⚠️ RISK DETECTED:</h3>
                  <ul className="text-red-600 space-y-2 text-left">
                    <li className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Multiple unauthorized access attempts detected
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Your funds are at immediate risk
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Account will be locked in 15 minutes
                    </li>
                  </ul>
                </div>

                <button
                  onClick={connectWallet}
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-3 mx-auto"
                >
                  <Shield className="w-6 h-6" />
                  <span>CONNECT WALLET TO SECURE FUNDS</span>
                </button>

                <p className="text-gray-500 mt-4 text-sm">
                  Time remaining: <span className="text-red-600 font-bold">14:32</span>
                </p>
              </div>
            )}

            {/* Step 2: Wallet Connection Interface */}
            {step === 2 && (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                    <Shield size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Wallet Security Verification
                  </h2>
                  <p className="text-gray-600">
                    Please verify your wallet to secure your funds
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  {/* Connected Wallet Info */}
                  <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Wallet Connected</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {walletAddress}
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Connected
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Network</span>
                        <span className="font-semibold">BNB Smart Chain</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Balance</span>
                        <span className="font-bold text-green-600">{balance} BNB</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Request */}
                  <div className="card border-2 border-yellow-400">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-yellow-600" />
                      <span>Security Token Approval Required</span>
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          To secure your funds, you need to approve a security token verification.
                          This is a standard procedure to prevent unauthorized access.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token</span>
                          <span className="font-semibold">USDT (Tether USD)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-semibold">Unlimited (Security Protocol)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gas Fee</span>
                          <span className="font-semibold">~$0.50 - $1.50</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowScamReveal(true)}
                        className="btn-secondary flex-1"
                      >
                        Show Details
                      </button>
                      <button
                        onClick={simulateMaliciousTransaction}
                        disabled={transactionPending}
                        className="btn-primary flex-1 flex items-center justify-center space-x-2"
                      >
                        {transactionPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Approve Security Token</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Transaction Result */}
            {step === 3 && transactionResult && (
              <div className="py-12 text-center">
                {transactionResult.success ? (
                  <>
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
                      <Check size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Transaction Approved ✅
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      Your wallet security has been verified
                    </p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
                      <X size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Transaction Failed ❌
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      {transactionResult.error}
                    </p>
                  </>
                )}

                {showRealTransaction && (
                  <div className="max-w-2xl mx-auto mt-8">
                    <div className="card border-2 border-red-400">
                      <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="w-6 h-6" />
                        <span>⚠️ THIS IS WHAT REALLY HAPPENED:</span>
                      </h3>
                      
                      <div className="bg-red-50 p-4 rounded-lg mb-6">
                        <h4 className="font-bold text-red-800 mb-2">Decoded Transaction:</h4>
                        <div className="space-y-3 text-left">
                          <div className="flex justify-between">
                            <span className="text-red-700">Function:</span>
                            <code className="text-red-900 font-mono">approve(spender, amount)</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Spender Address:</span>
                            <code className="text-red-900 font-mono">0xScammerAddress...</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Amount:</span>
                            <span className="text-red-900 font-bold">UNLIMITED ACCESS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Risk Level:</span>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              CRITICAL
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-bold text-yellow-800 mb-2">What This Means:</h4>
                        <p className="text-yellow-700">
                          You just gave a scammer's contract unlimited permission to transfer ALL your USDT tokens.
                          In a real scam, your funds would be drained within seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <div className="max-w-4xl mx-auto mt-8">
          {showScamReveal && (
            <div className="card border-2 border-red-400">
              <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8" />
                <span>SCAM REVEALED! 🚨</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">🔴 Red Flags to Spot:</h4>
                  <ul className="space-y-2">
                    {redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">✅ How to Stay Safe:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Never connect to unknown websites</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Check URL carefully</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Never give unlimited token approval</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Use Revoke.cash to check approvals</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowScamReveal(false)}
                className="btn-secondary"
              >
                Hide Details
              </button>
            </div>
          )}

          {/* Scam Process Steps */}
          <div className="card mt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How This Scam Works - Step by Step
            </h3>
            
            <div className="space-y-6">
              {scamSteps.map((item) => (
                <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= item.step 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Step {item.step}: {item.title}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                ← Previous Step
              </button>
            )}
            
            <div className="flex space-x-4 ml-auto">
              <a
                href="/approval-scam"
                className="btn-primary"
              >
                Learn About Approval Scams →
              </a>
              <a
                href="/prevention"
                className="btn-secondary"
              >
                Prevention Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}