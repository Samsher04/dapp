import React, { useState, useRef } from "react";
import {
  QrCode,
  Smartphone,
  AlertTriangle,
  Copy,
  Download,
} from "lucide-react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export default function QRDemo() {
  const [qrImage, setQrImage] = useState("");
  const [step, setStep] = useState(1);
  const qrRef = useRef(null);

  const generateScamQR = async () => {
    // Fake scam URL simulation
    const scamUrl = `${window.location.origin}/fake-website?ref=urgent-security-alert`;

    try {
      const qr = await QRCode.toDataURL(scamUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1e40af",
          light: "#ffffff",
        },
      });
      setQrImage(qr);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const link = document.createElement("a");
      link.download = "scam-qr-demo.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyScamMessage = () => {
    const message = `⚠️ URGENT: Your wallet has suspicious activity detected!\n\nPlease scan this QR immediately to secure your funds:\n\n🔗 ${window.location.origin}/fake-website\n\nYour account will be locked in 15 minutes if you don't act.`;
    navigator.clipboard.writeText(message);
    alert("Scam message copied! This is what scammers send.");
  };

  const scamTactics = [
    "Creates fake urgency with time limits",
    "Uses official-looking logos and branding",
    "Sends via Telegram/WhatsApp groups",
    "Claims to be from 'Wallet Support Team'",
    "Includes fear of losing all funds",
  ];

  const preventionTips = [
    "Never scan QR codes from unknown sources",
    "Verify URLs before connecting wallet",
    "Use wallet's built-in QR scanner only",
    "Check sender identity thoroughly",
    "When in doubt, don't scan!",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
          <QrCode size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          QR Code{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            Phishing Scams
          </span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how scammers use QR codes to trick you into visiting malicious
          websites
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 ${
                    step > s
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Generate QR */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Step 1: Scammer Creates QR
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">
                Scammers create QR codes that look legitimate but point to
                malicious websites. They often distribute these in crypto
                groups, social media, or via direct messages.
              </p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">
                    🔴 Common Platforms:
                  </h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Telegram crypto groups</li>
                    <li>• WhatsApp "support" messages</li>
                    <li>• Twitter replies and DMs</li>
                    <li>• Discord community servers</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">
                    🎯 Scammer's Goal:
                  </h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Get you to scan the QR code</li>
                    <li>• Redirect to fake website</li>
                    <li>• Steal wallet credentials</li>
                    <li>• Drain your funds</li>
                  </ul>
                </div>
              </div>

              <button onClick={generateScamQR} className="btn-primary w-full">
                Generate Demo Scam QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Show QR */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code */}
            <div className="card" ref={qrRef}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Generated Scam QR
                </h3>

                {qrImage && (
                  <div className="qr-container mx-auto mb-6">
                    <img src={qrImage} alt="Scam QR Code" className="mx-auto" />
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-semibold">
                        ⚠️ DO NOT SCAN - This is a demo scam QR
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={downloadQR}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download size={18} />
                    <span>Download QR</span>
                  </button>
                  <button
                    onClick={copyScamMessage}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Copy size={18} />
                    <span>Copy Message</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scam Message */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Typical Scam Message
              </h3>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="font-bold">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold">Wallet Security Team</p>
                      <p className="text-sm text-gray-300">Official Verified</p>
                    </div>
                  </div>

                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-300">
                          URGENT SECURITY ALERT
                        </p>
                        <p className="text-sm mt-1">
                          We've detected suspicious activity on your wallet.
                          Please scan the QR code immediately to verify your
                          identity and secure your funds. Your account will be
                          locked in 15 minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(3)} className="btn-primary w-full">
                Next: See What Happens When Scanned →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Analysis */}
      {step === 3 && (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Scam Tactics */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span>Scammer's Tactics</span>
              </h3>

              <div className="space-y-3">
                {scamTactics.map((tactic, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700">{tactic}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <QrCode className="w-6 h-6 text-green-500" />
                <span>Prevention Tips</span>
              </h3>

              <div className="space-y-3">
                {preventionTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Happens When You Scan?
            </h3>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Redirect to Fake Website
                  </h4>
                  <p className="text-gray-600">
                    QR opens a website that looks like Trust Wallet/MetaMask
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Fake Security Alert
                  </h4>
                  <p className="text-gray-600">
                    Website shows urgent message about your wallet being
                    compromised
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Wallet Connection Request
                  </h4>
                  <p className="text-gray-600">
                    Asks you to connect wallet to "verify identity" or "secure
                    funds"
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Malicious Approval
                  </h4>
                  <p className="text-gray-600">
                    Makes you sign transaction giving unlimited access to your
                    tokens
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <a
                  href="/fake-website"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Continue to Fake Website Demo →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="btn-secondary">
            ← Previous Step
          </button>
        )}
        {step < 3 && (
          <button
            onClick={() => setStep(step + 1)}
            className="btn-primary ml-auto"
          >
            Next Step →
          </button>
        )}
      </div>
    </div>
  );
}
