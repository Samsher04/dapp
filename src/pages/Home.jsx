import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, AlertTriangle, QrCode, Globe, Wallet, 
  FileWarning, CheckCircle, Zap, Users, BookOpen 
} from 'lucide-react'

const features = [
  {
    icon: <QrCode className="w-8 h-8" />,
    title: "QR Code Scams",
    description: "Learn how scammers use QR codes to steal wallets",
    color: "from-blue-500 to-cyan-500",
    link: "/qr-demo"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Fake Websites",
    description: "Identify phishing websites that mimic real platforms",
    color: "from-purple-500 to-pink-500",
    link: "/fake-website"
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Wallet Connection",
    description: "See what information scammers get when you connect",
    color: "from-green-500 to-emerald-500",
    link: "/wallet-connect"
  },
  {
    icon: <FileWarning className="w-8 h-8" />,
    title: "Approval Scams",
    description: "Understand unlimited token approval risks",
    color: "from-red-500 to-orange-500",
    link: "/approval-scam"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Prevention Guide",
    description: "Learn how to protect yourself from scams",
    color: "from-indigo-500 to-blue-500",
    link: "/prevention"
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Knowledge Test",
    description: "Test your scam detection skills",
    color: "from-yellow-500 to-amber-500",
    link: "/quiz"
  }
]

const stats = [
  { value: "$2.8B+", label: "Crypto stolen in 2023" },
  { value: "320K+", label: "Scam victims annually" },
  { value: "97%", label: "QR code scams success rate" },
  { value: "60%", label: "Preventable with education" }
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-primary-500 to-danger-500 rounded-full mb-6">
          <Shield size={48} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Protect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-danger-600">Crypto Assets</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Interactive educational demo showing exactly how crypto scams work.
          Learn to detect, prevent, and protect yourself.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/qr-demo" className="btn-primary flex items-center space-x-2">
            <Zap size={20} />
            <span>Start Learning</span>
          </Link>
          <Link to="/quiz" className="btn-secondary flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Test Your Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="card text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-6 mb-12 shadow-lg">
        <div className="flex items-center space-x-4">
          <AlertTriangle size={32} className="flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">⚠️ Real Experience Based</h3>
            <p>
              This demo is based on actual scam techniques that have stolen millions from users.
              The creator lost funds to similar scams and built this to educate others.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        What You'll <span className="text-primary-600">Learn</span>
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group"
          >
            <div className="card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
              <div className="mt-4 text-primary-600 font-semibold flex items-center">
                Explore Demo
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* How to Use */}
      <div className="card mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Perfect For</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">👨‍💻 Crypto Beginners</h4>
            <p className="text-gray-600">Learn basic security practices</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🏢 Corporate Training</h4>
            <p className="text-gray-600">Employee security awareness</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🎓 Educational Institutions</h4>
            <p className="text-gray-600">Workshops and courses</p>
          </div>
        </div>
      </div>

      {/* Demo Note */}
      <div className="warning-box bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300">
        <div className="flex items-start space-x-4">
          <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">💡 How to Use This Demo</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• All demonstrations are simulated - no real transactions</li>
              <li>• Click through each section to see how scams work</li>
              <li>• Pay attention to red flags and warning signs</li>
              <li>• Use the prevention guide to protect yourself</li>
              <li>• Share with friends and family to spread awareness</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}