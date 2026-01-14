import React, { useState, useEffect } from 'react'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import Web3Service from '../utils/web3'

export default function WalletConnectButton({ onConnect, onDisconnect }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (Web3Service.isConnected) {
      setIsConnected(true)
      setAddress(Web3Service.address)
      const bal = await Web3Service.getBalance()
      setBalance(bal)
    }
  }

  const handleConnect = async () => {
    const result = await Web3Service.connectWallet()
    if (result.success) {
      setIsConnected(true)
      setAddress(result.address)
      const bal = await Web3Service.getBalance()
      setBalance(bal)
      if (onConnect) onConnect(result)
    } else {
      alert(`Connection failed: ${result.error}`)
    }
  }

  const handleDisconnect = () => {
    Web3Service.disconnect()
    setIsConnected(false)
    setAddress('')
    setBalance('0')
    if (onDisconnect) onDisconnect()
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-600">Connected Wallet</p>
          <p className="font-mono text-gray-900">{formatAddress(address)}</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-700 font-semibold">
            {parseFloat(balance).toFixed(4)} BNB
          </span>
        </div>

        <button
          onClick={copyAddress}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <button
          onClick={handleDisconnect}
          className="btn-secondary flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="btn-primary flex items-center space-x-2"
    >
      <Wallet className="w-5 h-5" />
      <span>Connect Wallet</span>
    </button>
  )
}