'use client'

import { useState, useTransition } from 'react'
import { sendOtp, verifyOtp, saveProfile } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Loader2, User, Phone, Calendar } from 'lucide-react'

type Step = 'email' | 'otp' | 'profile'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Profile form fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')

  // Step 1 — Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      const result = await sendOtp(formData)
      if (result.error) { setError(result.error); return }
      setStep('otp')
    })
  }

  // Step 2 — Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', otp)
      const result = await verifyOtp(formData)
      if (result.error) { setError(result.error); return }

      if (result.role === 'admin') {
        // Admin — skip profile form, go directly to admin
        router.push('/admin')
        router.refresh()
        return
      }

      if (result.isNewMember) {
        // First time member — show profile completion form
        setStep('profile')
      } else {
        // Returning member — go to homepage
        router.push('/#member-login')
        router.refresh()
      }
    })
  }

  // Step 3 — Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('full_name', fullName)
      formData.append('phone', phone)
      formData.append('age', age)
      const result = await saveProfile(formData)
      if (result.error) { setError(result.error); return }
      // Profile saved — go to homepage
      router.push('/#member-login')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-black tracking-tighter text-white inline-block mb-2">
            YOGI<span className="text-primary">.</span>
          </Link>
          <p className="text-muted text-sm font-medium tracking-widest uppercase">
            {step === 'email' && 'Admin & Member Portal'}
            {step === 'otp' && 'Enter Your Code'}
            {step === 'profile' && 'Complete Your Profile'}
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2rem] border-white/5 shadow-2xl">

          {/* ── STEP 1: Email ── */}
          {step === 'email' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-muted text-sm mb-6">
                Enter your email to receive a login code.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-primary/10 border border-primary/20 text-primary text-xs py-3 px-4 rounded-xl text-center">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={isPending || !email}
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? <Loader2 className="animate-spin" size={20} />
                    : <><span>Send Login Code</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  }
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 'otp' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-muted text-sm mb-1">We sent a code to:</p>
              <p className="text-white font-bold text-sm mb-6 bg-white/5 px-3 py-2 rounded-lg inline-block">
                {email}
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
                    Login Code
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text" inputMode="numeric" maxLength={8}
                      value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="00000000" required autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-center text-2xl tracking-[0.5em] font-black"
                    />
                  </div>
                  <p className="text-[10px] text-muted text-center uppercase tracking-widest">
                    Check spam folder if not in inbox
                  </p>
                </div>
                {error && (
                  <div className="bg-primary/10 border border-primary/20 text-primary text-xs py-3 px-4 rounded-xl text-center">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={isPending || otp.length < 6}
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? <Loader2 className="animate-spin" size={20} />
                    : <><span>Access Dashboard</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  }
                </button>
                <button type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError('') }}
                  className="w-full text-center text-xs text-muted hover:text-white transition-colors py-2 uppercase tracking-widest font-bold"
                >
                  ← Use different email
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3: Profile Completion ── */}
          {step === 'profile' && (
            <>
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 h-1 rounded-full bg-primary" />
                <div className="flex-1 h-1 rounded-full bg-primary" />
                <div className="flex-1 h-1 rounded-full bg-primary" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                One last step 👋
              </h2>
              <p className="text-muted text-sm mb-6">
                Tell us a bit about yourself to complete your profile.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-5">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text" required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold">
                      +91
                    </div>
                    <input
                      type="tel" required maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-[4.5rem] pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-muted ml-1">
                    This will also be used for WhatsApp updates
                  </p>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
                    Age *
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="number" required min={10} max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-primary/10 border border-primary/20 text-primary text-xs py-3 px-4 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <button type="submit"
                  disabled={isPending || !fullName || !phone || !age}
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? <Loader2 className="animate-spin" size={20} />
                    : <><span>Complete Profile & Enter</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  }
                </button>

                <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
                  You can update these details anytime from your dashboard
                </p>
              </form>
            </>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              Both members and admins use this login.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-white/40 hover:text-white text-xs transition-colors">
            ← Back to main website
          </Link>
        </div>
      </div>
    </div>
  )
}
