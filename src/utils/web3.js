import { ethers } from 'ethers'

class Web3Service {
  constructor() {
    this.provider = null
    this.signer = null
    this.address = null
    this.chainId = null
    this.isConnected = false
  }

  // Check if MetaMask/Trust Wallet is installed
  isWalletInstalled() {
    return typeof window !== 'undefined' && window.ethereum
  }

  // Connect to wallet
  async connectWallet() {
    try {
      if (!this.isWalletInstalled()) {
        throw new Error('Please install MetaMask or Trust Wallet!')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      this.address = accounts[0]
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.provider.getSigner()
      
      // Get chain ID
      const network = await this.provider.getNetwork()
      this.chainId = network.chainId
      
      this.isConnected = true

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect()
        } else {
          this.address = accounts[0]
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        this.chainId = parseInt(chainId, 16)
      })

      return {
        success: true,
        address: this.address,
        chainId: this.chainId
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null
    this.signer = null
    this.address = null
    this.isConnected = false
  }

  // Get wallet balance
  async getBalance() {
    if (!this.isConnected) return '0'
    try {
      const balance = await this.provider.getBalance(this.address)
      return ethers.utils.formatEther(balance)
    } catch (error) {
      return '0'
    }
  }

  // Sign a message (for demo purposes)
  async signMessage(message) {
    if (!this.isConnected) return null
    try {
      const signature = await this.signer.signMessage(message)
      return signature
    } catch (error) {
      return null
    }
  }

  // Simulate malicious approval transaction
  async simulateMaliciousApproval() {
    if (!this.isConnected) {
      throw new Error('Please connect wallet first')
    }

    // This is a DEMO - no real transaction
    // In real scam, this would be USDT contract with unlimited approval
    
    const demoTransaction = {
      to: '0x0000000000000000000000000000000000000000', // Null address for demo
      data: '0x095ea7b3000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      value: '0x0',
      gasLimit: '0x7b0c'
    }

    // Show what would happen
    return {
      success: true,
      message: 'DEMO ONLY: In real scam, this would give unlimited token access',
      decoded: {
        function: 'approve(address spender, uint256 amount)',
        spender: '0xDeadBeef... (Scammer Address)',
        amount: 'UNLIMITED (115792089... tokens)',
        risk: 'CRITICAL - Would drain all tokens'
      }
    }
  }
}

export default new Web3Service()