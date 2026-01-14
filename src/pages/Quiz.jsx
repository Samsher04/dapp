import React, { useState } from 'react'
import { 
  AlertTriangle, CheckCircle, XCircle, 
  Trophy, RefreshCw, Share2, Star
} from 'lucide-react'

const quizQuestions = [
  {
    id: 1,
    question: 'What is the biggest red flag in a crypto website?',
    options: [
      'Using free hosting like netlify.app',
      'Having a modern design',
      'Offering high returns',
      'Being advertised on social media'
    ],
    correct: 0,
    explanation: 'Legitimate crypto projects use their own domains, not free hosting services.'
  },
  {
    id: 2,
    question: 'What does "unlimited token approval" mean?',
    options: [
      'Temporary access to tokens',
      'Read-only access to balance',
      'Complete control over all tokens',
      'One-time transaction permission'
    ],
    correct: 2,
    explanation: 'Unlimited approval gives the spender COMPLETE access to spend ALL your tokens of that type.'
  },
  {
    id: 3,
    question: 'Where should you NEVER share your seed phrase?',
    options: [
      'In encrypted password managers',
      'On any website or app',
      'With family members',
      'On paper in a safe'
    ],
    correct: 1,
    explanation: 'Seed phrase should NEVER be entered on any website, app, or shared digitally.'
  },
  {
    id: 4,
    question: 'What should you do first if you suspect a scam?',
    options: [
      'Contact the scammer',
      'Revoke all token approvals',
      'Wait and see what happens',
      'Transfer more funds to test'
    ],
    correct: 1,
    explanation: 'Immediately revoke approvals at revoke.cash to prevent further losses.'
  },
  {
    id: 5,
    question: 'Which URL is most likely legitimate?',
    options: [
      'https://trust-wallet.netlify.app',
      'https://app.uniswap.org',
      'https://pancakeswap-bsc.vercel.app',
      'https://metamask-support.com'
    ],
    correct: 1,
    explanation: 'app.uniswap.org is the official Uniswap domain. Others use free hosting or unofficial domains.'
  },
  {
    id: 6,
    question: 'What is a "dusting attack"?',
    options: [
      'Sending small amounts to track wallets',
      'Hacking through dust particles',
      'Cleaning wallet transactions',
      'Mining cryptocurrency'
    ],
    correct: 0,
    explanation: 'Dusting attacks send tiny amounts to track wallet activity and identify holders.'
  },
  {
    id: 7,
    question: 'How often should you review token approvals?',
    options: [
      'Never',
      'Once a year',
      'Monthly',
      'After every transaction'
    ],
    correct: 2,
    explanation: 'Review approvals monthly and revoke any that are no longer needed.'
  },
  {
    id: 8,
    question: 'What is the safest way to store large crypto amounts?',
    options: [
      'Browser extension wallet',
      'Mobile wallet',
      'Hardware wallet',
      'Exchange wallet'
    ],
    correct: 2,
    explanation: 'Hardware wallets keep private keys offline, providing the highest security.'
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setAnswers([])
    setSelectedOption(null)
  }

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return
    
    setSelectedOption(optionIndex)
    
    const isCorrect = optionIndex === quizQuestions[currentQuestion].correct
    const newScore = isCorrect ? score + 1 : score
    
    setAnswers([...answers, {
      questionId: quizQuestions[currentQuestion].id,
      selected: optionIndex,
      correct: quizQuestions[currentQuestion].correct,
      isCorrect
    }])
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
        setScore(newScore)
      } else {
        setScore(newScore)
        setShowResult(true)
      }
    }, 2000)
  }

  const shareResults = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    const text = `I scored ${percentage}% on the Crypto Security Quiz! Test your knowledge at ${window.location.origin}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Crypto Security Quiz Results',
        text: text,
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard! Share with friends.')
    }
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500'
    if (percentage >= 60) return 'from-yellow-500 to-amber-500'
    return 'from-red-500 to-orange-500'
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Crypto Security Expert! 🎉'
    if (percentage >= 60) return 'Good Awareness! Keep Learning 📚'
    return 'Needs Improvement! Study More 🧠'
  }

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8">
            <Trophy size={64} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crypto Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Knowledge Test</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Test your knowledge of crypto scams and security practices.
            {quizQuestions.length} questions to check your awareness.
          </p>
          
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">🎯 Quiz Topics</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Spotting scam websites</li>
                  <li>• Token approval risks</li>
                  <li>• Wallet security</li>
                  <li>• Emergency response</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">🏆 Scoring</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• {quizQuestions.length} questions</li>
                  <li>• Immediate feedback</li>
                  <li>• Detailed explanations</li>
                  <li>• Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            onClick={startQuiz}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Quiz
          </button>
          
          <p className="text-gray-500 mt-4">
            Average score: 65% • Time: 5-10 minutes
          </p>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center p-6 bg-gradient-to-r ${getScoreColor(percentage)} rounded-full mb-6`}>
              <div className="text-white text-center">
                <div className="text-4xl font-bold">{percentage}%</div>
                <div className="text-sm">SCORE</div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getScoreMessage(percentage)}
            </h1>
            <p className="text-gray-600">
              You got {score} out of {quizQuestions.length} questions correct
            </p>
          </div>

          {/* Results Breakdown */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Results</h2>
            
            <div className="space-y-4">
              {answers.map((answer, index) => {
                const question = quizQuestions.find(q => q.id === answer.questionId)
                return (
                  <div key={index} className={`p-4 rounded-lg ${
                    answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold text-gray-900">
                          Question {index + 1}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{question.question}</p>
                    
                    {!answer.isCorrect && (
                      <div className="mt-2 p-3 bg-yellow-50 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Correct answer:</strong> {question.options[question.correct]}
                        </p>
                        <p className="text-sm text-yellow-800 mt-1">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Certificate */}
          <div className="card mb-8 border-2 border-yellow-400">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mb-4">
                <Star size={32} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h2>
              
              <p className="text-gray-600 mb-6">
                You've completed the Crypto Security Knowledge Test with a score of {percentage}%
              </p>
              
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-300 mb-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Crypto Security Awareness</h3>
                  <p className="text-gray-700 mb-4">Certificate of Knowledge</p>
                  <div className="border-t border-gray-300 pt-4">
                    <p className="text-lg text-gray-900">Score: <strong>{score}/{quizQuestions.length}</strong></p>
                    <p className="text-gray-600">Completed on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="btn-secondary">
                  Download Certificate
                </button>
                <button
                  onClick={shareResults}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Share2 size={18} />
                  <span>Share Results</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Recommended Next Steps</h2>
            
            <div className="space-y-4">
              {percentage < 60 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Study These Topics:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span>🎯</span>
                      <a href="/qr-demo" className="text-blue-600 hover:underline">
                        QR Code Scams Deep Dive
                      </a>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span>🔐</span>
                      <a href="/approval-scam" className="text-blue-600 hover:underline">
                        Token Approval Security
                      </a>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span>🛡️</span>
                      <a href="/prevention" className="text-blue-600 hover:underline">
                        Complete Prevention Guide
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Practice Safety:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Review your current token approvals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Set up wallet security features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Share this quiz with friends</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Retake Quiz */}
          <div className="text-center mt-8">
            <button
              onClick={startQuiz}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="font-semibold text-gray-900">
              Score: {score}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{currentQuestion + 1}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Question</h2>
              <p className="text-gray-600">Select the correct answer</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {currentQ.options.map((option, index) => {
              let optionClasses = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 "
              
              if (selectedOption === null) {
                optionClasses += "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              } else if (selectedOption === index) {
                optionClasses += index === currentQ.correct 
                  ? "border-green-500 bg-green-50" 
                  : "border-red-500 bg-red-50"
              } else if (index === currentQ.correct) {
                optionClasses += "border-green-500 bg-green-50"
              } else {
                optionClasses += "border-gray-200 opacity-50"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                  className={optionClasses}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedOption === null 
                        ? 'bg-gray-100 text-gray-700' 
                        : index === currentQ.correct 
                          ? 'bg-green-100 text-green-700' 
                          : selectedOption === index 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{option}</span>
                    
                    {selectedOption !== null && index === currentQ.correct && (
                      <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                    )}
                    {selectedOption === index && index !== currentQ.correct && (
                      <XCircle className="w-6 h-6 text-red-600 ml-auto" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {selectedOption !== null && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedOption === currentQ.correct 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-gray-900">Explanation:</span>
              </div>
              <p className="text-gray-700">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Next Button */}
        {selectedOption !== null && currentQuestion < quizQuestions.length - 1 && (
          <div className="text-center">
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion + 1)
                setSelectedOption(null)
              }}
              className="btn-primary"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}