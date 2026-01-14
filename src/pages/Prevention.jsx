import React, { useState } from 'react'
import { 
  Shield, Lock, AlertTriangle, CheckCircle, 
  Key, Smartphone, Globe, Wallet, FileText,
  ExternalLink, Download, Copy
} from 'lucide-react'

export default function Prevention() {
  const [copied, setCopied] = useState(false)

  const securityChecklist = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Check URLs Carefully',
      description: 'Always verify website URLs before connecting wallet',
      tips: [
        'Look for https:// (not http://)',
        'Check for official domains (trustwallet.com, metamask.io)',
        'Avoid free hosting domains (netlify.app, vercel.app)'
      ]
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Wallet Connection Safety',
      description: 'Be cautious when connecting wallet to websites',
      tips: [
        'Never connect to unknown websites',
        'Check what permissions are being requested',
        'Use different wallets for different purposes'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Token Approvals',
      description: 'Manage token approvals carefully',
      tips: [
        'Never give unlimited approval',
        'Use specific amounts only',
        'Regularly review and revoke unused approvals'
      ]
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Private Key Security',
      description: 'Protect your private keys and seed phrases',
      tips: [
        'Never share seed phrase with anyone',
        'Use hardware wallets for large amounts',
        'Store backups securely offline'
      ]
    }
  ]

  const essentialTools = [
    {
      name: 'Revoke.cash',
      url: 'https://revoke.cash',
      description: 'Check and revoke token approvals',
      icon: '🔄',
      category: 'Security'
    },
    {
      name: 'BSCScan',
      url: 'https://bscscan.com',
      description: 'Verify transactions and contracts',
      icon: '🔍',
      category: 'Verification'
    },
    {
      name: 'De.Fi Scanner',
      url: 'https://de.fi',
      description: 'Smart contract security audit',
      icon: '🛡️',
      category: 'Security'
    },
    {
      name: 'RugDoc.io',
      url: 'https://rugdoc.io',
      description: 'Project reviews and risk analysis',
      icon: '📊',
      category: 'Research'
    },
    {
      name: 'Wallet Guard',
      url: 'https://walletguard.app',
      description: 'Real-time transaction protection',
      icon: '🚨',
      category: 'Protection'
    },
    {
      name: 'StolenCrypto.xyz',
      url: 'https://stolencrypto.xyz',
      description: 'Report and track stolen funds',
      icon: '💰',
      category: 'Recovery'
    }
  ]

  const emergencySteps = [
    'Immediately revoke all token approvals at revoke.cash',
    'Transfer remaining funds to a new wallet',
    'Report scam address on BSCScan',
    'File complaint at cybercrime.gov.in',
    'Contact exchanges if funds were sent there',
    'Warn others on social media'
  ]

  const walletTypes = [
    {
      type: 'Hot Wallet',
      examples: 'MetaMask, Trust Wallet, Coinbase Wallet',
      use: 'Small daily transactions',
      security: 'Medium',
      tips: 'Use for small amounts only'
    },
    {
      type: 'Cold Wallet',
      examples: 'Ledger, Trezor',
      use: 'Long-term storage',
      security: 'High',
      tips: 'Store majority of funds here'
    },
    {
      type: 'Multi-sig Wallet',
      examples: 'Gnosis Safe',
      use: 'Team funds, large amounts',
      security: 'Very High',
      tips: 'Requires multiple signatures'
    }
  ]

  const copyChecklist = () => {
    const checklistText = securityChecklist.map(item => 
      `✅ ${item.title}:\n${item.tips.map(tip => `  • ${tip}`).join('\n')}`
    ).join('\n\n')
    
    navigator.clipboard.writeText(`Crypto Security Checklist:\n\n${checklistText}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
          <Shield size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Complete Crypto <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Security Guide</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Protect your funds with these essential security practices and tools
        </p>
      </div>

      {/* Security Checklist */}
      <div className="card mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🔐 Security Checklist</h2>
            <p className="text-gray-600">Essential steps to secure your crypto assets</p>
          </div>
          <button
            onClick={copyChecklist}
            className="btn-secondary flex items-center space-x-2"
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied!' : 'Copy Checklist'}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {securityChecklist.map((item, index) => (
            <div key={index} className="step-card border-blue-200 bg-blue-50/50">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {item.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Tools */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <span>🛠️ Essential Security Tools</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essentialTools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-blue-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{tool.icon}</div>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                  {tool.name}
                </h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="text-blue-600 font-semibold flex items-center">
                  Visit Tool
                  <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Response */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <span>🚨 Emergency Response Plan</span>
        </h2>
        
        <div className="danger-box bg-gradient-to-r from-red-50 to-orange-50 border-red-300">
          <h3 className="font-bold text-red-800 mb-4">If You've Been Scammed:</h3>
          <div className="space-y-3">
            {emergencySteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">{index + 1}</span>
                </div>
                <p className="text-red-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="info-box">
            <h4 className="font-bold text-blue-800 mb-2">⚖️ Legal Actions:</h4>
            <ul className="space-y-2 text-blue-700">
              <li>• File FIR at local police station</li>
              <li>• Report to cybercrime.gov.in</li>
              <li>• Contact a crypto-savvy lawyer</li>
              <li>• Report to relevant exchanges</li>
            </ul>
          </div>
          
          <div className="success-box">
            <h4 className="font-bold text-green-800 mb-2">📞 Support Resources:</h4>
            <ul className="space-y-2 text-green-700">
              <li>• Crypto scam victim support groups</li>
              <li>• Blockchain forensic companies</li>
              <li>• Community forums for advice</li>
              <li>• Social media awareness campaigns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Wallet Types Comparison */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">💰 Wallet Security Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Wallet Type</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Examples</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Best For</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Security Level</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Tips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {walletTypes.map((wallet, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{wallet.type}</td>
                  <td className="py-4 px-4 text-gray-700">{wallet.examples}</td>
                  <td className="py-4 px-4 text-gray-700">{wallet.use}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      wallet.security === 'Very High' ? 'bg-green-100 text-green-800' :
                      wallet.security === 'High' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {wallet.security}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{wallet.tips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="card">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">🏆 Best Practices Summary</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Security</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Enable biometric authentication</li>
              <li>• Use app lock for wallet apps</li>
              <li>• Keep device software updated</li>
              <li>• Avoid public WiFi for transactions</li>
            </ul>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transaction Safety</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Always double-check addresses</li>
              <li>• Use address book for frequent sends</li>
              <li>• Start with small test transactions</li>
              <li>• Verify contract addresses on BSCScan</li>
            </ul>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Security</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Use 2FA wherever possible</li>
              <li>• Keep software wallets updated</li>
              <li>• Educate yourself continuously</li>
              <li>• Stay skeptical of "too good" offers</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold mb-2">Golden Rule of Crypto Security</h3>
              <p className="text-gray-300">
                <strong>"If you don't own the private keys, you don't own the crypto."</strong>
                <br />
                Always maintain control of your keys and never share them with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Resources */}
      <div className="mt-8 text-center">
        <button className="btn-success inline-flex items-center space-x-2">
          <Download size={20} />
          <span>Download Complete Security Guide (PDF)</span>
        </button>
        <p className="text-gray-600 mt-2">
          Includes printable checklist, emergency contacts, and detailed instructions
        </p>
      </div>
    </div>
  )
}