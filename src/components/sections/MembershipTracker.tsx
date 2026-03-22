'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Calendar, Award, ChevronRight,
    LogIn, LogOut, CheckCircle2, Flame, Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/app/actions/auth'

interface Profile {
    id: string
    full_name: string | null
    email: string
    whatsapp_number: string | null
    role: string
}

interface Membership {
    id: string
    plan: string
    status: string
    start_date: string
    expiry_date: string
    price_paid: number
}

interface CheckIn {
    checked_in_at: string
}

export default function MembershipTracker() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [membership, setMembership] = useState<Membership | null>(null)
    const [checkins, setCheckins] = useState<CheckIn[]>([])
    const [streak, setStreak] = useState(0)
    const [daysLeft, setDaysLeft] = useState(0)
    const [progress, setProgress] = useState(0)
    const [whatsapp, setWhatsapp] = useState('')
    const [savingWA, setSavingWA] = useState(false)
    const [checkingIn, setCheckingIn] = useState(false)
    const [checkinMsg, setCheckinMsg] = useState('')
    const [dataLoading, setDataLoading] = useState(false)

    // Calculate streak from checkins
    const calculateStreak = (checkinList: CheckIn[]): number => {
        if (!checkinList.length) return 0
        const dates = checkinList
            .map(c => new Date(c.checked_in_at).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

        let count = 0
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        if (dates[0] !== today && dates[0] !== yesterday) return 0

        for (let i = 0; i < dates.length; i++) {
            const expected = new Date(Date.now() - i * 86400000).toDateString()
            if (dates[i] === expected) count++
            else break
        }
        return count
    }

    // Load user data from Supabase
    const loadData = async (userId: string) => {
        setDataLoading(true)
        try {
            const supabase = createClient()

            // Get profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, full_name, email, whatsapp_number, role')
                .eq('id', userId)
                .single()

            if (profileData) {
                setProfile(profileData)
                // Remove leading 91 for display, show as +91 XXXXXXXXXX format
                const rawNumber = profileData.whatsapp_number ?? ''
                const displayNumber = rawNumber.startsWith('91') && rawNumber.length === 12
                    ? rawNumber.slice(2)
                    : rawNumber
                setWhatsapp(displayNumber)
            }

            // Get active membership
            const { data: membershipData } = await supabase
                .from('memberships')
                .select('id, plan, status, start_date, expiry_date, price_paid')
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (membershipData) {
                setMembership(membershipData)

                // Calculate days left and progress
                const now = new Date()
                const expiry = new Date(membershipData.expiry_date)
                const start = new Date(membershipData.start_date)
                const totalDays = Math.ceil((expiry.getTime() - start.getTime()) / 86400000)
                const usedDays = Math.ceil((now.getTime() - start.getTime()) / 86400000)
                const remaining = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / 86400000))

                setDaysLeft(remaining)
                setProgress(Math.min(100, Math.round((usedDays / totalDays) * 100)))
            }

            // Get checkins for streak
            const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
            const { data: checkinData } = await supabase
                .from('workout_checkins')
                .select('checked_in_at')
                .eq('user_id', userId)
                .gte('checked_in_at', thirtyDaysAgo)
                .order('checked_in_at', { ascending: false })

            if (checkinData) {
                setCheckins(checkinData)
                setStreak(calculateStreak(checkinData))
            }
        } catch (err) {
            console.error('Error loading member data:', err)
        } finally {
            setDataLoading(false)
        }
    }

    // Check auth on mount
    useEffect(() => {
        const supabase = createClient()

        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setIsLoggedIn(true)
                await loadData(user.id)
            }
            setLoading(false)
        }

        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setIsLoggedIn(true)
                    await loadData(session.user.id)
                }
                if (event === 'SIGNED_OUT') {
                    setIsLoggedIn(false)
                    setProfile(null)
                    setMembership(null)
                    setCheckins([])
                    setStreak(0)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Log workout checkin
    const handleCheckin = async () => {
        if (!profile) return
        setCheckingIn(true)
        try {
            const supabase = createClient()

            // Check if already checked in today
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            const { data: existing } = await supabase
                .from('workout_checkins')
                .select('id')
                .eq('user_id', profile.id)
                .gte('checked_in_at', todayStart.toISOString())
                .maybeSingle()

            if (existing) {
                setCheckinMsg('Already checked in today! 💪')
            } else {
                await supabase.from('workout_checkins').insert({ user_id: profile.id })
                setCheckinMsg('Workout logged! Keep it up! 🔥')
                await loadData(profile.id)
            }

            setTimeout(() => setCheckinMsg(''), 3000)
        } catch {
            setCheckinMsg('Something went wrong. Try again.')
            setTimeout(() => setCheckinMsg(''), 3000)
        } finally {
            setCheckingIn(false)
        }
    }

    // Save WhatsApp number
    const handleSaveWhatsapp = async () => {
        if (!profile) return
        setSavingWA(true)
        try {
            const supabase = createClient()
            // Always save as 91XXXXXXXXXX format in database
            const numberToSave = whatsapp.startsWith('91') ? whatsapp : `91${whatsapp}`
            await supabase
                .from('profiles')
                .update({ whatsapp_number: numberToSave })
                .eq('id', profile.id)
            setSavingWA(false)
        } catch {
            setSavingWA(false)
        }
    }

    // Handle sign out
    const handleSignOut = async () => {
        await signOut()
        setIsLoggedIn(false)
        setProfile(null)
    }

    const planLabel = membership
        ? membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)
        : null

    if (loading) return (
        <section id="member-login" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        </section>
    )

    return (
        <section id="member-login" className="py-24 relative overflow-hidden bg-background">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Member <span className="text-gradient">Dashboard</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto text-lg">
                        Manage your membership, track your progress, and unlock exclusive rewards.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">

                        {/* ── NOT LOGGED IN ── */}
                        {!isLoggedIn && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass p-8 md:p-12 rounded-3xl border border-white/5"
                            >
                                <div className="max-w-md mx-auto text-center">
                                    <div className="flex justify-center mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                            <User size={32} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest">
                                        Member Login
                                    </h3>
                                    <p className="text-muted text-sm mb-8">
                                        Log in to track your progress, manage your membership, and access exclusive features.
                                    </p>
                                    <a
                                        href="/login"
                                        className="btn-primary w-full py-5 flex items-center justify-center gap-2 group"
                                    >
                                        <LogIn size={20} />
                                        <span>Login to Dashboard</span>
                                    </a>
                                    <p className="text-muted text-xs mt-4">
                                        New here?{' '}
                                        <a href="#pricing" className="text-primary hover:underline font-bold">
                                            View membership plans →
                                        </a>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ── LOGGED IN DASHBOARD ── */}
                        {isLoggedIn && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {/* Sidebar */}
                                <div className="md:col-span-1 space-y-6">

                                    {/* Profile card */}
                                    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                                    <User size={48} className="text-white/20" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                                        </div>
                                        <h4 className="text-xl font-bold uppercase tracking-tight">
                                            {dataLoading ? '...' : (profile?.full_name ?? profile?.email ?? 'Member')}
                                        </h4>
                                        <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mt-1">
                                            {planLabel ? `${planLabel} Member` : 'No Active Plan'}
                                        </p>
                                        <button
                                            onClick={handleSignOut}
                                            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-white transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </button>
                                    </div>

                                    {/* Streak card */}
                                    <div className="glass p-6 rounded-3xl border border-white/5">
                                        <h5 className="text-xs uppercase tracking-widest text-muted font-bold mb-4">
                                            Workout Streak
                                        </h5>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                                <Flame size={24} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black">
                                                    {dataLoading ? '—' : `${streak} Days`}
                                                </div>
                                                <div className="text-[10px] uppercase tracking-widest text-muted">
                                                    {checkins.length} visits this month
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checkin button */}
                                        <button
                                            onClick={handleCheckin}
                                            disabled={checkingIn}
                                            className="mt-4 w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                                        >
                                            {checkingIn ? 'Logging...' : '+ Log Today\'s Workout'}
                                        </button>
                                        {checkinMsg && (
                                            <p className="text-xs text-center mt-2 text-green-400">{checkinMsg}</p>
                                        )}
                                    </div>

                                    {/* WhatsApp number */}
                                    <div className="glass p-6 rounded-3xl border border-white/5">
                                        <h5 className="text-xs uppercase tracking-widest text-muted font-bold mb-3">
                                            WhatsApp Number
                                        </h5>
                                        <div className="relative mb-2">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xs font-bold">
                                                +91
                                            </span>
                                            <input
                                                type="text"
                                                value={whatsapp}
                                                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                                                placeholder="98765 43210"
                                                maxLength={10}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveWhatsapp}
                                            disabled={savingWA}
                                            className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
                                        >
                                            {savingWA ? 'Saving...' : 'Save Number'}
                                        </button>
                                    </div>
                                </div>

                                {/* Main content */}
                                <div className="md:col-span-2 space-y-6">

                                    {/* Membership status */}
                                    <div className="glass p-8 rounded-3xl border border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="text-primary" size={24} />
                                                <h5 className="text-lg font-bold uppercase tracking-tight">
                                                    Membership Status
                                                </h5>
                                            </div>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${membership?.status === 'active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-white/5 text-muted border-white/10'
                                                }`}>
                                                {membership?.status ?? 'No Plan'}
                                            </span>
                                        </div>

                                        {membership ? (
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
                                                        <span>Membership Usage</span>
                                                        <span className="text-white/60">{daysLeft} Days Remaining</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className="h-full bg-gradient-to-r from-primary to-secondary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                                            Plan
                                                        </div>
                                                        <div className="text-sm font-bold">{planLabel}</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                                            Expiry Date
                                                        </div>
                                                        <div className="text-sm font-bold">
                                                            {new Date(membership.expiry_date).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                                            Start Date
                                                        </div>
                                                        <div className="text-sm font-bold">
                                                            {new Date(membership.start_date).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                                            Amount Paid
                                                        </div>
                                                        <div className="text-sm font-bold">
                                                            ₹{(membership.price_paid / 100).toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-muted text-sm mb-4">No active membership found.</p>
                                                <a
                                                    href="#pricing"
                                                    className="btn-primary py-3 px-8 text-xs inline-block"
                                                >
                                                    View Plans →
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Renew section — show when 7 days or less remaining */}
                                    {membership && daysLeft <= 7 && (
                                        <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <h5 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                                                        Renew & Save
                                                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                                            {daysLeft === 0 ? 'Expired' : `${daysLeft} days left`}
                                                        </span>
                                                    </h5>
                                                    <p className="text-sm text-muted mt-1">
                                                        Extend your membership now and keep your streak going.
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href="#pricing"
                                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                                            >
                                                <span>View Plans</span>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    {/* No membership — show plans prompt */}
                                    {!membership && (
                                        <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                                            <h5 className="text-lg font-bold uppercase tracking-tight mb-2">
                                                Get Started
                                            </h5>
                                            <p className="text-sm text-muted mb-6">
                                                Choose a plan and start your fitness journey today.
                                            </p>
                                            <a
                                                href="#pricing"
                                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                                            >
                                                <span>View Membership Plans</span>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
