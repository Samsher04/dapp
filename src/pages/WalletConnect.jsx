import React, { useState, useEffect } from 'react'
import { 
  Wallet, Shield, Eye, Send, Lock, Globe, 
  AlertTriangle, CheckCircle, ExternalLink
} from 'lucide-react'
import Web3Service from '../utils/web3'

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState(null)
  const [step, setStep] = useState(1)
  const [permissions, setPermissions] = useState({
    viewBalance: false,
    viewActivity: false,
    requestTransactions: false
  })

  const checkConnection = async () => {
    if (Web3Service.isConnected) {
      setIsConnected(true)
      const address = Web3Service.address
      const balance = await Web3Service.getBalance()
      
      setWalletInfo({
        address,
        balance,
        network: 'BNB Smart Chain',
        chainId: 56
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const connectWallet = async () => {
    const result = await Web3Service.connectWallet()
    if (result.success) {
      setIsConnected(true)
      const balance = await Web3Service.getBalance()
      
      setWalletInfo({
        address: result.address,
        balance,
        network: 'BNB Smart Chain',
        chainId: result.chainId
      })
      
      setStep(2)
    }
  }

  const disconnectWallet = () => {
    Web3Service.disconnect()
    setIsConnected(false)
    setWalletInfo(null)
    setStep(1)
    setPermissions({
      viewBalance: false,
      viewActivity: false,
      requestTransactions: false
    })
  }

  const whatScammerSees = [
    'Your wallet address (public key)',
    'Current balance in wallet',
    'Transaction history',
    'Network you are connected to',
    'Tokens you hold'
  ]

  const whatScammerCannotSee = [
    'Private key or seed phrase',
    'Passwords',
    'Other wallet addresses you own',
    'Personal information (unless you shared)',
    'Direct control over funds'
  ]

  const connectionSteps = [
    {
      step: 1,
      title: 'Website Requests Connection',
      description: 'Website asks to connect to your wallet via MetaMask/Trust Wallet',
      icon: <Globe className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'You Approve Connection',
      description: 'You click "Connect" in the wallet popup',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Website Gets Limited Access',
      description: 'Website can see your address and balance',
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Further Actions Required',
      description: 'For transactions, separate approval is needed',
      icon: <Send className="w-6 h-6" />
    }
  ]

  const togglePermission = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
          <Wallet size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Wallet Connection <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Security Demo</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See exactly what information websites can access when you connect your wallet
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Connection Demo */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Live Connection Demo</h2>
          
          {!isConnected ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Connect Your Wallet
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                This demo will show you what information becomes visible when you connect your wallet to a website.
                No transactions will be made.
              </p>
              
              <button
                onClick={connectWallet}
                className="btn-primary text-lg px-8"
              >
                Connect Wallet (Demo)
              </button>
              
              <div className="warning-box mt-8">
                <p className="text-yellow-800">
                  <strong>Note:</strong> This is a demo. In real scenarios, always check what permissions are being requested.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Wallet Connected</h3>
                  <p className="text-gray-600">Information visible to website:</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="btn-secondary"
                >
                  Disconnect
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Wallet Address</span>
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <code className="font-mono text-gray-900 break-all">
                    {walletInfo.address}
                  </code>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Balance</span>
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {walletInfo.balance} BNB
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Network</span>
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-900">
                    {walletInfo.network}
                  </div>
                </div>
              </div>
              
              <div className="danger-box">
                <h4 className="font-bold text-red-800 mb-2">⚠️ What This Means:</h4>
                <p className="text-red-700">
                  The website can now see your wallet address and balance. 
                  However, it CANNOT move your funds without additional permissions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Information Visibility */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👁️ Information Visibility</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span>What Websites CAN See:</span>
              </h3>
              <div className="space-y-2">
                {whatScammerSees.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <span>What Websites CANNOT See:</span>
              </h3>
              <div className="space-y-2">
                {whatScammerCannotSee.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <Lock className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="info-box mt-6">
            <h4 className="font-bold text-blue-800 mb-2">💡 Key Takeaway:</h4>
            <p className="text-blue-700">
              Wallet connection alone is relatively safe. The real danger comes from 
              signing transactions that give websites permission to move your funds.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Process */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">🔄 Wallet Connection Process</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {connectionSteps.map((item) => (
            <div key={item.step} className={`step-card ${
              step >= item.step 
                ? 'border-blue-300 bg-blue-50/50' 
                : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  step >= item.step 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {item.step}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Demo */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔐 Permission Types</h2>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePermission('viewBalance')}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    permissions.viewBalance 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {permissions.viewBalance && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
                <div>
                  <h4 className="font-bold text-gray-900">View Wallet Balance</h4>
                  <p className="text-gray-600 text-sm">Can see how much crypto you have</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                permissions.viewBalance 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {permissions.viewBalance ? 'Granted' : 'Not Granted'}
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePermission('viewActivity')}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    permissions.viewActivity 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {permissions.viewActivity && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
                <div>
                  <h4 className="font-bold text-gray-900">View Wallet Activity</h4>
                  <p className="text-gray-600 text-sm">Can see your transaction history</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                permissions.viewActivity 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {permissions.viewActivity ? 'Granted' : 'Not Granted'}
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePermission('requestTransactions')}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    permissions.requestTransactions 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {permissions.requestTransactions && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
                <div>
                  <h4 className="font-bold text-gray-900">Request Transactions</h4>
                  <p className="text-gray-600 text-sm">Can ask you to sign transactions</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                permissions.requestTransactions 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {permissions.requestTransactions ? 'Granted' : 'Not Granted'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          permissions.requestTransactions 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <h4 className={`font-bold mb-2 ${
            permissions.requestTransactions ? 'text-red-800' : 'text-green-800'
          }`}>
            {permissions.requestTransactions ? '⚠️ High Risk' : '✅ Safe'}
          </h4>
          <p className={permissions.requestTransactions ? 'text-red-700' : 'text-green-700'}>
            {permissions.requestTransactions 
              ? 'Website can now ask you to sign transactions. This is where scams happen!'
              : 'Website can only view information. It cannot move your funds.'}
          </p>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🛡️ Safety Tips</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Do's</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Always check website URL before connecting</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Use different wallets for different purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Regularly review connected websites</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Don'ts</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <span className="text-gray-700">Never connect to suspicious websites</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <span className="text-gray-700">Don't sign transactions you don't understand</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <span className="text-gray-700">Avoid connecting to multiple unknown sites</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <a href="/fake-website" className="btn-secondary">
          ← Fake Website Demo
        </a>
        <a href="/approval-scam" className="btn-primary">
          Approval Scams →
        </a>
      </div>
    </div>
  )
}